'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GreetingProps {
    fullName: string | null
}

export function Greeting({ fullName }: GreetingProps) {
    const [greeting, setGreeting] = useState({ title: '', subtitle: '' })
    const name = fullName || 'Scholar'

    useEffect(() => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) {
            setGreeting({
                title: `Good Morning, ${name}.`,
                subtitle: "Build quietly. Rise steadily."
            })
        } else if (hour >= 12 && hour < 17) {
            setGreeting({
                title: `Stay focused, ${name}.`,
                subtitle: "Consistency is shaping you."
            })
        } else if (hour >= 17 && hour < 21) {
            setGreeting({
                title: `Welcome back, ${name}.`,
                subtitle: "Refinement happens daily."
            })
        } else {
            setGreeting({
                title: `Good Evening, ${name}.`,
                subtitle: "End the day with intention."
            })
        }
    }, [name])

    // Prevent hydration mismatch by rendering nothing until mounted client-side
    // or just render a generic state. using simple null check for now.
    if (!greeting.title) return <div className="h-32" />

    return (
        <div className="mb-16 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6"
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-scholar-gold text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium"
                >
                    Preparation is private. Discipline is visible.
                </motion.p>

                <div className="relative inline-block">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-soft-white leading-tight tracking-tight">
                        {greeting.title}
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.8, duration: 1.2, ease: "anticipate" }}
                        className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-scholar-gold/0 via-scholar-gold to-scholar-gold/0"
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-muted-text text-lg md:text-xl font-light tracking-wide italic font-serif"
                >
                    "{greeting.subtitle}"
                </motion.p>
            </motion.div>
        </div>
    )
}
