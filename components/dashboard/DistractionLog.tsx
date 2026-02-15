'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { XCircle } from 'lucide-react'

interface DistractionLogProps {
    initialLogs?: { id: string; note: string; created_at: string }[]
}

export function DistractionLog({ initialLogs = [] }: DistractionLogProps) {
    const supabase = createClient()
    const [note, setNote] = useState('')
    const [isLogging, setIsLogging] = useState(false)
    const [logs, setLogs] = useState(initialLogs)

    const handleLog = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!note.trim()) return

        setIsLogging(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: newLog, error } = await supabase.from('distraction_logs').insert({
                user_id: user.id,
                note: note
            }).select().single()

            if (newLog) {
                setLogs([newLog, ...logs])
                setNote('')
            }
        }
        setIsLogging(false)
    }

    return (
        <div className="glass-card p-6 h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-soft-white font-serif text-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500/80" />
                    Distraction Log
                </h3>
                <span className="text-xs text-muted-text">{logs.length} Recorded</span>
            </div>

            <form onSubmit={handleLog} className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What distracted you?"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-soft-white placeholder-white/20 focus:outline-none focus:border-red-500/30 transition-colors"
                    />
                    <button
                        disabled={isLogging || !note}
                        className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-muted-text hover:text-red-200 rounded-lg text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                        {isLogging ? "..." : "Log"}
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {logs.length === 0 ? (
                    <p className="text-xs text-muted-text/50 italic text-center py-4">No distractions recorded today.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="text-xs text-muted-text p-2 rounded bg-white/5 border border-white/5 flex justify-between items-center group">
                            <span>{log.note}</span>
                            <span className="opacity-0 group-hover:opacity-50 text-[10px]">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
