'use client'

import Link from 'next/link'
import { ScrollText, ArrowRight } from 'lucide-react'

export function JournalWidget() {
    return (
        <div className="glass-card p-6 h-full flex flex-col justify-between group hover:bg-white/5 transition-colors duration-300">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-soft-white">
                    <ScrollText className="w-5 h-5" />
                    <span className="text-sm font-medium uppercase tracking-widest">Journal</span>
                </div>
                <span className="text-[10px] text-muted-text">2 hours ago</span>
            </div>

            <div className="space-y-2">
                <p className="text-soft-white/80 font-serif italic text-sm line-clamp-2">
                    "Reflecting on the concept of Sabr in the context of contemporary jurisprudence..."
                </p>
            </div>

            <Link href="/journal">
                <button className="w-full flex items-center justify-between px-4 py-2 mt-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-soft-white transition-all group-hover:pl-6">
                    <span>New Entry</span>
                    <ArrowRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </button>
            </Link>
        </div>
    )
}
