'use client'

import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

interface AnalyticsSummaryProps {
    data: { date: string; hours: number }[]
    viewMode: 'week' | 'month'
}

export function AnalyticsSummary({ data, viewMode }: AnalyticsSummaryProps) {
    const router = useRouter()

    // Toggle view handler
    const toggleView = (mode: 'week' | 'month') => {
        router.push(`/dashboard?view=${mode}`, { scroll: false })
    }

    // Chart customization based on view
    const isMonth = viewMode === 'month'

    return (
        <div className="glass-card p-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-soft-white font-serif text-lg">Study Progress</h3>
                    <p className="text-xs text-muted-text uppercase tracking-widest mt-1">
                        {isMonth ? 'Last 30 Days' : 'Last 7 Days'}
                    </p>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1">
                    <button
                        onClick={() => toggleView('week')}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${!isMonth ? 'bg-scholar-emerald/20 text-scholar-emerald' : 'text-muted-text hover:text-soft-white'}`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => toggleView('month')}
                        className={`px-3 py-1 text-xs rounded-md transition-all ${isMonth ? 'bg-scholar-emerald/20 text-scholar-emerald' : 'text-muted-text hover:text-soft-white'}`}
                    >
                        Month
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94A3B8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval={isMonth ? 2 : 0} // Skip ticks for monthly view to avoid clutter
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0B0F19', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F1F5F9' }}
                            itemStyle={{ color: '#C6A75E' }}
                            formatter={(value: number) => [`${value} hrs`, 'Study Time']}
                        />
                        <Bar
                            dataKey="hours"
                            fill="#065F46"
                            radius={[4, 4, 0, 0]}
                            barSize={isMonth ? 10 : 30}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
