'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ayahs } from '@/lib/ayahs'
import { RefreshCw } from 'lucide-react'

export function AyahCenterpiece() {
    const [currentAyah, setCurrentAyah] = useState(ayahs[0])
    const [key, setKey] = useState(0)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
        setCurrentAyah(ayahs[dayOfYear % ayahs.length])
    }, [])

    const handleRefresh = () => {
        const randomIndex = Math.floor(Math.random() * ayahs.length)
        setCurrentAyah(ayahs[randomIndex])
        setKey(prev => prev + 1)
    }

    if (!isMounted) return null

    return (
        <div className="glass-card p-8 md:p-14 relative overflow-hidden group min-h-[400px] flex flex-col items-center justify-center">
            {/* Subtle Gradient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-scholar-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-scholar-emerald/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-10 w-full max-w-4xl">

                {/* Header / Meta */}
                <div className="flex items-center space-x-6 opacity-60">
                    <div className="h-[1px] w-8 md:w-16 bg-scholar-gold/30" />
                    <span className="text-scholar-gold text-[10px] md:text-xs uppercase tracking-[0.3em]">Daily Wisdom</span>
                    <div className="h-[1px] w-8 md:w-16 bg-scholar-gold/30" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 md:space-y-12 w-full"
                    >
                        {/* Arabic */}
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-soft-white leading-[1.6] md:leading-[1.8] py-2" style={{ fontFamily: "'Traditional Arabic', serif" }}>
                            {currentAyah.arabic}
                        </h2>

                        {/* English */}
                        <div className="space-y-4">
                            <p className="text-xl md:text-2xl text-muted-text font-serif leading-relaxed italic opacity-90">
                                "{currentAyah.english}"
                            </p>
                            <p className="text-[10px] md:text-xs text-scholar-emerald uppercase tracking-[0.2em] font-medium">
                                {currentAyah.source}
                            </p>
                        </div>

                        {/* Reflection Box */}
                        <div className="relative pt-8 max-w-2xl mx-auto">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-white/10" />
                            <p className="text-sm md:text-base text-soft-white/70 font-light leading-relaxed">
                                <span className="text-scholar-gold text-2xl font-serif mr-2 opacity-50">“</span>
                                {currentAyah.reflection}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="pt-6">
                    <button
                        onClick={handleRefresh}
                        className="group flex items-center gap-3 text-[10px] md:text-xs text-muted-text hover:text-scholar-gold transition-all duration-300 uppercase tracking-[0.2em] opacity-50 hover:opacity-100"
                    >
                        <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" />
                        Reflect Again
                    </button>
                </div>
            </div>
        </div>
    )
}
