'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, Trophy } from 'lucide-react'

interface StudyHeatmapProps {
    data: { date: string; hours: number }[]
}

export function StudyHeatmap({ data }: StudyHeatmapProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Create a map for O(1) data lookup
    const logMap = useMemo(() => {
        return new Map(data.map(d => [d.date, d.hours]))
    }, [data])

    // Metrics Calculation (Global, based on full dataset)
    const { streak, totalActiveDays, consistency } = useMemo(() => {
        const today = new Date()

        let s = 0
        let active = 0
        let streakAlive = true

        // Check last 365 days
        for (let i = 0; i < 365; i++) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const iso = d.toISOString().split('T')[0]
            const hours = logMap.get(iso) || 0

            if (hours > 0) {
                active++
                if (streakAlive) s++
            } else if (i === 0) {
                // Today doesn't break streak if 0 yet
            } else {
                streakAlive = false
            }
        }
        return {
            streak: s,
            totalActiveDays: active,
            consistency: Math.round((active / 365) * 100)
        }
    }, [data, logMap])

    // Calendar Grid Generation for Current Month
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        const firstDayOfMonth = new Date(year, month, 1)
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Adjust for start day of week (0=Sun, 1=Mon, etc.)
        const startDayOfWeek = firstDayOfMonth.getDay()

        const days = []
        // Pad previous month days
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ day: null, date: null, hours: 0 })
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i)
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
            const hours = logMap.get(iso) || 0
            days.push({
                day: i,
                date: iso,
                hours: hours,
                isToday: new Date().toDateString() === d.toDateString()
            })
        }
        return days
    }, [currentDate, logMap])

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    const getIntensityClass = (hours: number) => {
        if (hours === 0) return 'hover:bg-white/5 text-muted-text'
        if (hours < 1) return 'bg-scholar-emerald/20 text-scholar-emerald border border-scholar-emerald/30'
        if (hours < 3) return 'bg-scholar-emerald/40 text-white border border-scholar-emerald/50'
        if (hours < 5) return 'bg-scholar-emerald text-white border border-scholar-emerald shadow-[0_0_10px_rgba(16,185,129,0.3)]'
        return 'bg-gradient-to-br from-scholar-gold to-yellow-600 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)]'
    }

    return (
        <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-scholar-emerald/10 text-scholar-emerald">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-soft-white font-serif text-lg leading-tight">Study Calendar</h3>
                        <p className="text-xs text-muted-text flex items-center gap-2">
                            <span className="flex items-center gap-1 text-scholar-gold"><Flame className="w-3 h-3" /> {streak} Day Streak</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-scholar-emerald"><Trophy className="w-3 h-3" /> {totalActiveDays} Active Days</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                    <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded text-muted-text hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={goToToday} className="px-3 text-xs font-medium text-soft-white hover:text-scholar-emerald transition-colors min-w-[100px] text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded text-muted-text hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="z-10">
                <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] text-muted-text uppercase tracking-wider font-medium opacity-60">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => (
                        <div key={idx} className="aspect-square relative group">
                            {day.day && (
                                <div
                                    className={`
                                        w-full h-full rounded-lg flex flex-col items-center justify-center transition-all duration-300
                                        ${getIntensityClass(day.hours)}
                                        ${day.isToday ? 'ring-1 ring-white/30' : ''}
                                    `}
                                >
                                    <span className="text-xs">{day.day}</span>
                                    {day.hours > 0 && (
                                        <span className="text-[9px] opacity-0 group-hover:opacity-100 absolute bottom-1 transition-opacity">
                                            {day.hours}h
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-3 text-[10px] text-muted-text z-10">
                <span>Less</span>
                <div className="flex items-center gap-1.5">
                    {[
                        { label: "0 hours", color: "bg-white/5 border-white/5" },
                        { label: "< 1 hour", color: "bg-scholar-emerald/20 border-scholar-emerald/30" },
                        { label: "1-3 hours", color: "bg-scholar-emerald/40 border-scholar-emerald/50" },
                        { label: "3-5 hours", color: "bg-scholar-emerald border-scholar-emerald" },
                        { label: "5+ hours", color: "bg-gradient-to-br from-scholar-gold to-yellow-600 border-scholar-gold shadow-[0_0_8px_rgba(234,179,8,0.4)]" },
                    ].map((item, i) => (
                        <div key={i} className="relative group cursor-help">
                            <div className={`w-3 h-3 rounded border ${item.color}`}></div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-white/10 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                {item.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <span>More</span>
            </div>

            {/* Decorative Bg */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-scholar-emerald/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
    )
}
