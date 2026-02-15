'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Wind } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function OverwhelmedPage() {
    const [action, setAction] = useState("Breathe in...")

    useEffect(() => {
        const cycle = () => {
            setAction("Breathe in...")
            setTimeout(() => setAction("Hold..."), 4000)
            setTimeout(() => setAction("Breathe out..."), 8000)
            setTimeout(() => setAction("Hold..."), 12000)
        }
        cycle()
        const interval = setInterval(cycle, 16000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans text-soft-white">

            {/* Ambient Background matching Dashboard */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-scholar-emerald/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-scholar-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-3xl w-full flex flex-col items-center space-y-16 animate-in fade-in duration-1000">

                {/* Header */}
                <div className="flex items-center gap-2 opacity-50 mb-8">
                    <Wind className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-[0.2em]">Decompression Zone</span>
                </div>

                {/* Breathing Circle */}
                <div className="relative flex items-center justify-center py-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1.5, 1, 1],
                            opacity: [0.1, 0.3, 0.3, 0.1, 0.1],
                        }}
                        transition={{
                            duration: 16,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                        className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-scholar-emerald blur-3xl absolute"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1.1, 1, 1],
                            borderColor: ["rgba(6, 95, 70, 0.2)", "rgba(198, 167, 94, 0.4)", "rgba(198, 167, 94, 0.4)", "rgba(6, 95, 70, 0.2)", "rgba(6, 95, 70, 0.2)"]
                        }}
                        transition={{
                            duration: 16,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                        className="w-56 h-56 md:w-72 md:h-72 rounded-full border border-scholar-emerald/20 flex items-center justify-center relative bg-[#0B0F19]/50 backdrop-blur-sm"
                    >
                        <motion.span
                            key={action}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="text-2xl md:text-3xl font-serif text-soft-white tracking-widest uppercase opacity-90"
                        >
                            {action}
                        </motion.span>
                    </motion.div>
                </div>

                {/* Quranic Wisdom */}
                <div className="space-y-6 max-w-xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif text-soft-white leading-tight">
                        "And whoever does righteousness — it is for his own soul."
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-scholar-gold/30"></div>
                        <p className="text-xs text-scholar-gold uppercase tracking-[0.2em]">
                            Quran 45:15
                        </p>
                        <div className="h-[1px] w-12 bg-scholar-gold/30"></div>
                    </div>
                </div>

                {/* Reassurance */}
                <div className="space-y-10">
                    <p className="text-muted-text text-lg font-light max-w-md mx-auto leading-relaxed">
                        It’s okay to pause. This journey is long, and Allah is with the patient.
                        You don’t need to carry it all at once. Just the next step.
                    </p>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-soft-white rounded-xl transition-all hover:scale-105 hover:border-scholar-emerald/30 group"
                    >
                        <ArrowLeft className="w-4 h-4 text-scholar-emerald group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm uppercase tracking-widest font-medium">Return to Dashboard</span>
                    </Link>
                </div>

            </div>
        </div>
    )
}
