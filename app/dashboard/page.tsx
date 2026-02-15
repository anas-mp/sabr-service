import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from 'next/link'
import { Greeting } from "@/components/dashboard/Greeting"
import { AyahCenterpiece } from "@/components/dashboard/AyahCenterpiece"
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary"
import { ConsistencyPill } from "@/components/dashboard/ConsistencyPill"
import { DistractionLog } from "@/components/dashboard/DistractionLog"
import { ManualEntry } from "@/components/dashboard/ManualEntry"
import { StudyHeatmap } from "@/components/dashboard/StudyHeatmap"
import { FocusWidget } from "@/components/dashboard/FocusWidget"
import { JournalWidget } from "@/components/dashboard/JournalWidget"
import { InsightEngine } from "@/components/dashboard/InsightEngine"
import { OfficerIdentity } from "@/components/dashboard/OfficerIdentity"

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ view?: string }>
}) {
    const params = await searchParams
    const viewMode = (params?.view === 'month' ? 'month' : 'week') as 'month' | 'week'
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    // Query Date Range Logic
    const now = new Date()
    // Always fetch at least 14 days for comparison, or 30 for month view
    const daysToFetch = viewMode === 'month' ? 30 : 14
    const startDate = new Date()
    startDate.setDate(now.getDate() - daysToFetch)

    const heatmapStartDate = new Date()
    heatmapStartDate.setDate(now.getDate() - 365) // Fetch full year for heatmap

    // Fetch logs for Chart (Short term)
    const { data: chartLogsData } = await supabase
        .from('study_logs')
        .select('study_date, hours')
        .eq('user_id', user.id)
        .gte('study_date', startDate.toISOString())
        .order('study_date', { ascending: true })

    // Fetch logs for Heatmap (Long term)
    const { data: heatmapLogsData } = await supabase
        .from('study_logs')
        .select('study_date, hours')
        .eq('user_id', user.id)
        .gte('study_date', heatmapStartDate.toISOString())
        .order('study_date', { ascending: true })

    const logs = chartLogsData || []
    const heatmapLogs = heatmapLogsData || []

    // Segregate Data
    const weekStart = new Date()
    weekStart.setDate(now.getDate() - 7)

    const prevWeekStart = new Date()
    prevWeekStart.setDate(now.getDate() - 14)

    const currentWeekLogs = logs.filter((l: any) => new Date(l.study_date) >= weekStart)
    const prevWeekLogs = logs.filter((l: any) => {
        const d = new Date(l.study_date)
        return d >= prevWeekStart && d < weekStart
    })

    // Calculate Metrics
    const currentWeeklyHours = currentWeekLogs.reduce((sum: number, log: any) => sum + Number(log.hours), 0)
    const lastWeeklyHours = prevWeekLogs.reduce((sum: number, log: any) => sum + Number(log.hours), 0)



    // Chart Data Processing
    // If view=week, use currentWeekLogs. If view=month, use all logs (last 30 days)
    const chartLogs = viewMode === 'month' ? logs : currentWeekLogs

    const processedLogs = chartLogs.reduce((acc: any, log: any) => {
        // Parse "YYYY-MM-DD" manually to avoid UTC conversion shifts
        const [y, m, d] = log.study_date.split('-').map(Number)
        // Create local date object (month is 0-indexed)
        const dateObj = new Date(y, m - 1, d)

        const dateKey = viewMode === 'month'
            ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : dateObj.toLocaleDateString('en-US', { weekday: 'short' })

        const existing = acc.find((item: any) => item.date === dateKey)
        if (existing) {
            existing.hours += Number(log.hours)
        } else {
            acc.push({ date: dateKey, hours: Number(log.hours) })
        }
        return acc
    }, [])

    // Ensure date range consistency (fill empty days)
    const daysToShow = viewMode === 'month' ? 30 : 7
    const chartData = Array.from({ length: daysToShow }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - ((daysToShow - 1) - i))

        const dateLabel = viewMode === 'month'
            ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : d.toLocaleDateString('en-US', { weekday: 'short' })

        const found = processedLogs.find((item: any) => item.date === dateLabel)
        return found || { date: dateLabel, hours: 0 }
    })


    // Calculate Streak (Consecutive days ending today/yesterday)
    let streak = 0
    const sortedLogs = [...logs].sort((a, b) => new Date(b.study_date).getTime() - new Date(a.study_date).getTime())
    const todayStr = new Date().toISOString().split('T')[0]
    const yesterdayStr = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]

    // Check if studied today or yesterday to keep streak alive
    let currentDateToCheck = sortedLogs.some(l => l.study_date === todayStr) ? todayStr : yesterdayStr

    // Simple streak logic
    let streakDate = new Date(currentDateToCheck)
    while (true) {
        const dateStr = streakDate.toISOString().split('T')[0]
        const hasLog = sortedLogs.some(l => l.study_date === dateStr && Number(l.hours) > 0)
        if (hasLog) {
            streak++
            streakDate.setDate(streakDate.getDate() - 1)
        } else {
            break
        }
    }

    // Weighted Consistency Score
    // 60% based on Hours (Target 20hrs = 100%)
    // 40% based on Streak (Target 5 days = 100%)
    const hoursScore = Math.min((currentWeeklyHours / 20) * 100, 100)
    const streakScore = Math.min((streak / 5) * 100, 100)

    const consistencyScore = Math.round((hoursScore * 0.6) + (streakScore * 0.4))


    // Fetch Recent Distractions (Last 5)
    // Note: Re-fetching here for completeness if needed, or keeping previous logic
    const { data: distractionLogs } = await supabase
        .from('distraction_logs')
        .select('id, note, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-10">
            {/* Header: Greeting & Consistency Pill */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <Greeting fullName={profile?.full_name ?? null} />
                <ConsistencyPill score={consistencyScore} />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Row 1: Ayah Centerpiece (Full Width) */}
                <div className="col-span-1 md:col-span-12">
                    <AyahCenterpiece />
                </div>

                {/* Row 2: Analytics & Widgets */}
                <div className="col-span-1 md:col-span-8 flex flex-col gap-10">
                    <Link href="/journal" className="block hover:opacity-90 transition-opacity">
                        <OfficerIdentity />
                    </Link>
                    <div className="h-[400px]">
                        <AnalyticsSummary data={chartData} viewMode={viewMode} />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                    <div className="flex-1 min-h-[100px]">
                        <InsightEngine currentWeeklyHours={currentWeeklyHours} lastWeeklyHours={lastWeeklyHours} />
                    </div>
                    <div className="flex-1 min-h-[160px]">
                        <FocusWidget />
                    </div>
                    <div className="flex-1 min-h-[160px]">
                        <JournalWidget />
                    </div>
                </div>

                {/* Row 3: Heatmap & Manual Entry/Distractions */}
                <div className="col-span-1 md:col-span-8">
                    <StudyHeatmap data={heatmapLogs.map((log: any) => ({
                        date: new Date(log.study_date).toISOString().split('T')[0],
                        hours: Number(log.hours)
                    }))} />
                </div>
                <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                    <div className="flex-1">
                        <ManualEntry />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <DistractionLog initialLogs={distractionLogs || []} />
                    </div>
                </div>

            </div>
        </div>
    )
}
