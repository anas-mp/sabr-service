'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, MonitorOff, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

// Constants
const TIMER_SESSIONS = [25, 50, 90]
const QUOTES = [
    "Every minute counts.",
    "Patience is to the soul what head is to the body.",
    "Knowledge is not what is memorized, but what benefits.",
    "The best of deeds is that which is done consistently.",
    "Stand firm until the victory arrives."
]

export default function FocusPage() {
    const supabase = createClient()

    // State
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [duration, setDuration] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [isSilentMode, setIsSilentMode] = useState(false)
    const [quoteIndex, setQuoteIndex] = useState(0)
    const [sessionComplete, setSessionComplete] = useState(false)

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Format Time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Progress Calculation
    const progress = ((duration - timeLeft) / duration) * 100
    const circumference = 2 * Math.PI * 120 // Radius 120

    // Quote Rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % QUOTES.length)
        }, 300000) // Change quote every 5 mins
        return () => clearInterval(interval)
    }, [])

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleComplete()
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft])

    const handleStart = () => setIsActive(true)
    const handlePause = () => setIsActive(false)

    const handleReset = () => {
        setIsActive(false)
        setTimeLeft(duration)
        setSessionComplete(false)
    }

    const handleDurationChange = (minutes: number) => {
        setIsActive(false)
        setDuration(minutes * 60)
        setTimeLeft(minutes * 60)
        setSessionComplete(false)
    }

    const handleComplete = async () => {
        setIsActive(false)
        setSessionComplete(true)
        if (timerRef.current) clearInterval(timerRef.current)

        // Save Session Logic
        const hours = duration / 3600
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase.from('study_logs').insert({
                user_id: user.id,
                study_date: new Date().toISOString(),
                hours: parseFloat(hours.toFixed(2))
            })
        }
    }

    return (
        <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center relative overflow-hidden ${isSilentMode ? 'bg-[#050505]' : 'bg-[#0B0F19]'}`}>

            {/* Header Controls */}
            <div className="absolute top-8 w-full max-w-7xl px-8 flex justify-between items-center z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-text hover:text-soft-white transition-colors group">
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium tracking-wide opacity-80 group-hover:opacity-100">EXIT SESSION</span>
                </Link>

                <button
                    onClick={() => setIsSilentMode(!isSilentMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 backdrop-blur-sm ${isSilentMode ? 'bg-scholar-emerald/10 border-scholar-emerald/50 text-scholar-emerald shadow-[0_0_15px_rgba(6,95,70,0.3)]' : 'bg-white/5 border-white/10 text-muted-text hover:text-soft-white hover:bg-white/10'}`}
                >
                    <MonitorOff className="w-4 h-4" />
                    <span className="text-xs font-medium tracking-widest uppercase">
                        {isSilentMode ? 'Silent Mode On' : 'Silent Mode Off'}
                    </span>
                </button>
            </div>

            {/* Main Timer Display */}
            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-10">

                {/* Duration Pre-sets (Hidden if Active) */}
                <AnimatePresence>
                    {!isActive && !sessionComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md mt-12"
                        >
                            {TIMER_SESSIONS.map((mins) => (
                                <button
                                    key={mins}
                                    onClick={() => handleDurationChange(mins)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${duration === mins * 60 ? 'bg-scholar-emerald text-white shadow-lg shadow-scholar-emerald/20' : 'text-muted-text hover:text-soft-white hover:bg-white/5'}`}
                                >
                                    {mins}m
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Circular Timer */}
                <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center">
                    {/* Background Circle */}
                    <div className="absolute inset-0 rounded-full border border-white/5" />
                    <div className="absolute inset-4 rounded-full border border-white/5" />

                    {/* Glow Effect behind timer */}
                    <div className="absolute inset-0 bg-scholar-emerald/5 rounded-full blur-3xl" />

                    {/* SVG Progress */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="120"
                            stroke="rgba(255, 255, 255, 0.05)"
                            strokeWidth="2"
                            fill="transparent"
                            className="md:r-[160]"
                        />
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="120"
                            stroke={isSilentMode ? "#10B981" : "#065F46"}
                            strokeWidth="4"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                            transition={{ duration: 1, ease: "linear" }}
                            className="md:r-[160] drop-shadow-[0_0_10px_rgba(6,95,70,0.5)]"
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="z-10 text-center flex flex-col items-center">
                        <span className="text-xs font-medium tracking-[0.2em] text-scholar-emerald/80 mb-2 uppercase">Time Remaining</span>
                        <motion.div
                            key={timeLeft}
                            initial={{ opacity: 0.8, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-7xl md:text-8xl font-serif text-soft-white tracking-tighter tabular-nums"
                        >
                            {formatTime(timeLeft)}
                        </motion.div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    {!isActive ? (
                        <button
                            onClick={handleStart}
                            className="w-20 h-20 rounded-full bg-scholar-emerald hover:bg-scholar-emerald/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(6,95,70,0.3)] hover:shadow-[0_0_40px_rgba(6,95,70,0.5)] group border border-white/10"
                        >
                            <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 border border-white/10 backdrop-blur-sm"
                        >
                            <Pause className="w-8 h-8 text-soft-white" />
                        </button>
                    )}

                    <button
                        onClick={handleReset}
                        className="w-12 h-12 rounded-full bg-transparent hover:bg-white/5 flex items-center justify-center transition-all duration-300 text-muted-text hover:text-white border border-transparent hover:border-white/5"
                        title="Reset Timer"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* Quote / Reflection */}
                <div className="max-w-md text-center px-4 h-20 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={quoteIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-lg font-serif italic text-muted-text/60 leading-relaxed"
                        >
                            "{QUOTES[quoteIndex]}"
                        </motion.p>
                    </AnimatePresence>
                </div>

            </div>

            {/* Ambient Background Effects */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-scholar-emerald/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-scholar-gold/5 rounded-full blur-3xl pointer-events-none opacity-50" />

        </div>
    )
}
