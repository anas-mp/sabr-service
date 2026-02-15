'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PlusCircle, Clock, Trash2 } from 'lucide-react'
import { SubmitButton } from '@/components/ui/SubmitButton'

import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'

type StudyLog = {
    id: string
    hours: number
    created_at: string
}

export function ManualEntry() {
    const supabase = createClient()
    const router = useRouter()
    const { showToast } = useToast()
    const [hours, setHours] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [isLogging, setIsLogging] = useState(false)
    const [dailyLogs, setDailyLogs] = useState<StudyLog[]>([])

    // Fetch logs for selected date
    useEffect(() => {
        const fetchLogs = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('study_logs')
                .select('id, hours, created_at')
                .eq('user_id', user.id)
                .eq('study_date', date)
                .order('created_at', { ascending: false })

            if (data) setDailyLogs(data)
        }
        fetchLogs()
    }, [date, supabase])

    const handleLog = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hours || isNaN(parseFloat(hours))) return

        setIsLogging(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: newLog, error } = await supabase.from('study_logs').insert({
                user_id: user.id,
                study_date: date,
                hours: parseFloat(hours)
            }).select().single()

            if (newLog) {
                setDailyLogs([newLog, ...dailyLogs])
                setHours('')
                showToast('Manual entry recorded successfully.', 'success')
                router.refresh()
            }
        }
        setIsLogging(false)
    }

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('study_logs').delete().eq('id', id)
        if (!error) {
            setDailyLogs(dailyLogs.filter(log => log.id !== id))
            showToast('Entry deleted.', 'info')
            router.refresh()
        }
    }

    return (
        <div className="glass-card p-6 h-full flex flex-col space-y-4">
            <h3 className="text-soft-white font-serif text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-scholar-gold" />
                Manual Entry
            </h3>

            <form onSubmit={handleLog} className="flex flex-col gap-3">
                <div className="space-y-1">
                    <label className="text-xs text-muted-text uppercase tracking-widest">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-soft-white focus:outline-none focus:border-scholar-gold/30 transition-colors"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-muted-text uppercase tracking-widest">Hours</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="24"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            placeholder="e.g. 2.5"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-soft-white placeholder-white/20 focus:outline-none focus:border-scholar-gold/30 transition-colors pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {hours && (
                            <button
                                type="button"
                                onClick={() => setHours('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                            >
                                <PlusCircle className="w-4 h-4 rotate-45" />
                            </button>
                        )}
                    </div>
                </div>

                <SubmitButton
                    disabled={isLogging || !hours}
                    className="w-full py-2 bg-white/5 hover:bg-scholar-gold/10 text-muted-text hover:text-scholar-gold rounded-lg text-xs uppercase tracking-widest transition-colors disabled:opacity-50 mt-2"
                >
                    {isLogging ? "Logging..." : "Add Entry"}
                </SubmitButton>
            </form>

            {/* Daily Logs List */}
            <div className="flex-1 overflow-y-auto min-h-[100px] border-t border-white/5 pt-4 mt-2 pr-2">
                <h4 className="text-xs text-muted-text uppercase tracking-widest mb-3">Today's Logs</h4>
                <div className="space-y-2 pb-12">
                    {dailyLogs.length === 0 ? (
                        <p className="text-xs text-muted-text/50 italic text-center">No logs for this date.</p>
                    ) : (
                        dailyLogs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                <span className="text-sm text-soft-white font-medium">{log.hours} hrs</span>
                                <button
                                    onClick={() => handleDelete(log.id)}
                                    className="p-1 text-muted-text hover:text-red-400 transition-colors"
                                    title="Delete Entry"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
