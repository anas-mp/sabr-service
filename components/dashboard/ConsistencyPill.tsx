'use client'

import { Sparkles } from 'lucide-react'

interface ConsistencyPillProps {
    score: number
}

export function ConsistencyPill({ score }: ConsistencyPillProps) {
    const getStatus = (s: number) => {
        if (s >= 80) return { label: "Strong Discipline", color: "text-scholar-emerald" }
        if (s >= 50) return { label: "Building Momentum", color: "text-scholar-gold" }
        return { label: "Stabilizing Routine", color: "text-muted-text" }
    }

    const { label, color } = getStatus(score)

    return (
        <div className="glass-card px-5 py-2 flex items-center gap-3 border-scholar-gold/20">
            <div className="flex flex-col text-right">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${color}`}>{label}</span>
                <span className="text-xs text-muted-text">Consistency Score</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-scholar-gold/20 flex items-center justify-center bg-white/5">
                <span className="font-serif text-sm text-soft-white">{score}%</span>
            </div>
        </div>
    )
}
