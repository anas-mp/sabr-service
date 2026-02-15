'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Save, ArrowLeft } from 'lucide-react'

const officerPrompts = [
    "What kind of officer am I becoming?",
    "Am I studying with amanah?",
    "Would I respect my future self today?",
    "Did I maintain composure under pressure today?",
    "Who does my discipline serve?"
]

import { useToast } from '@/contexts/ToastContext'

export default function JournalPage() {
    const supabase = createClient()
    const { showToast } = useToast()
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [history, setHistory] = useState<{ id: string; content: string; created_at: string }[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [prompt, setPrompt] = useState(officerPrompts[0])
    const [wordCount, setWordCount] = useState(0)

    useEffect(() => {
        setPrompt(officerPrompts[Math.floor(Math.random() * officerPrompts.length)])
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setHistory(data)
    }

    const handleSave = async () => {
        if (!content.trim()) return

        setIsSaving(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase.from('journal_entries').insert({
                user_id: user.id,
                content: content
            })
            setContent('')
            fetchHistory() // Refresh history
            showToast('Reflection recorded.', 'success')
        }
        setIsSaving(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
        setWordCount(e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length)
    }

    return (
        <div className="min-h-screen bg-scholar-navy p-6 md:p-12 flex flex-col relative overflow-hidden">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-8 relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-muted-text hover:text-soft-white flex items-center gap-2 text-sm uppercase tracking-widest transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-scholar-gold text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                    >
                        {showHistory ? "Close Log" : "Officer Log"}
                    </button>
                </div>

                <div className="flex gap-8 h-full">
                    {/* Main Writing Area */}
                    <div className="flex-1 flex flex-col space-y-8 transition-all duration-500">
                        {/* Prompt Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 md:p-12 text-center space-y-4"
                        >
                            <p className="text-muted-text text-sm uppercase tracking-widest">Daily Reflection</p>
                            <h2 className="text-2xl md:text-3xl font-serif text-soft-white leading-relaxed">
                                "{prompt}"
                            </h2>
                        </motion.div>

                        <div className="flex-1 glass-card p-6 md:p-8 flex flex-col space-y-4 relative min-h-[400px]">
                            <textarea
                                value={content}
                                onChange={handleChange}
                                placeholder="Begin your reflection..."
                                className="flex-1 w-full bg-transparent border-none outline-none text-soft-white/90 text-lg leading-relaxed resize-none placeholder-white/20 font-serif"
                            />

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-xs text-muted-text uppercase tracking-widest">
                                    {wordCount} Words
                                </span>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || wordCount === 0}
                                    className="bg-scholar-gold/10 hover:bg-scholar-gold/20 text-scholar-gold px-6 py-2 rounded-lg text-sm uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? "Saving..." : "Log Entry"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* History Sidebar */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: showHistory ? 300 : 0,
                            opacity: showHistory ? 1 : 0,
                            display: showHistory ? 'block' : 'none'
                        }}
                        className="glass-card h-full overflow-hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-white/10">
                            <h3 className="text-soft-white font-serif">Past Reflections</h3>
                        </div>
                        <div className="overflow-y-auto p-2 space-y-2 flex-1 custom-scrollbar">
                            {history.map((entry) => (
                                <div key={entry.id} className="p-3 bg-white/5 rounded-lg text-sm text-muted-text hover:bg-white/10 cursor-pointer transition-colors">
                                    <p className="line-clamp-3 font-serif italic mb-2">"{entry.content}"</p>
                                    <p className="text-[10px] uppercase tracking-wider opacity-50">
                                        {new Date(entry.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    )
}
