'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronRight } from 'lucide-react'

const PROMPTS = [
    "What kind of officer am I becoming?",
    "Am I studying with amanah?",
    "Would I respect my future self today?",
    "Who does my discipline serve?",
    "Is my character growing with my knowledge?"
]

export function OfficerIdentity() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % PROMPTS.length)
        }, 8000) // Rotate every 8 seconds
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="glass-card p-6 flex items-center justify-between group cursor-default hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-scholar-gold/10 flex items-center justify-center border border-scholar-gold/20">
                    <Shield className="w-5 h-5 text-scholar-gold" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-text font-medium">Officer Identity</span>
                    <div className="h-6 relative overflow-hidden w-64">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-sm font-serif text-soft-white italic absolute w-full truncate"
                            >
                                "{PROMPTS[index]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-scholar-gold transition-colors" />
        </div>
    )
}
