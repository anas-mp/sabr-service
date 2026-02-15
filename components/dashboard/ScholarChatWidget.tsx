'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, User } from 'lucide-react'
import { askScholar } from '@/app/actions/scholar-ai'

interface Message {
    id: string
    role: 'user' | 'scholar'
    content: string
}

export function ScholarChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'scholar', content: "Assalamu Alaikum. I am your study companion. How can I assist your discipline today?" }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        try {
            const response = await askScholar(userMsg.content)
            const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'scholar', content: response.message }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', role: 'scholar', content: "Forgive me, I cannot access the archives right now." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-scholar-gold text-scholar-navy shadow-lg shadow-scholar-gold/20 flex items-center justify-center transition-all ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
            >
                <Sparkles className="w-6 h-6" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-8 right-8 z-50 w-[380px] h-[500px] glass-card flex flex-col overflow-hidden border border-scholar-gold/20 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-scholar-gold/10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-scholar-gold/20 flex items-center justify-center border border-scholar-gold/30">
                                    <Sparkles className="w-4 h-4 text-scholar-gold" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-serif text-soft-white font-medium">Scholar AI</h3>
                                    <p className="text-[10px] text-scholar-emerald uppercase tracking-wider">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-text hover:text-white transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-scholar-gold/10 text-soft-white border border-scholar-gold/20 rounded-tr-sm'
                                                : 'bg-white/5 text-muted-text border border-white/5 rounded-tl-sm font-serif'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm flex gap-1">
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-2 h-2 rounded-full bg-scholar-gold/50" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 rounded-full bg-scholar-gold/50" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 rounded-full bg-scholar-gold/50" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-black/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about your progress..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-soft-white placeholder-white/20 focus:outline-none focus:border-scholar-gold/30 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-scholar-gold hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
