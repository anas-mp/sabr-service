'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
    message: string
    type: ToastType
    isVisible: boolean
    onClose: () => void
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border min-w-[300px]"
                    style={{
                        backgroundColor: type === 'success' ? 'rgba(6, 95, 70, 0.9)' :
                            type === 'error' ? 'rgba(127, 29, 29, 0.9)' :
                                'rgba(11, 15, 25, 0.9)',
                        borderColor: type === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                            type === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                                'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <div className={`p-1 rounded-full ${type === 'success' ? 'bg-scholar-emerald/20 text-scholar-emerald' :
                            type === 'error' ? 'bg-red-500/20 text-red-400' :
                                'bg-white/10 text-scholar-gold'
                        }`}>
                        {type === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
                        {type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
                        {type === 'info' && <Info className="w-5 h-5 text-white" />}
                    </div>

                    <p className="flex-1 text-sm font-medium text-white tracking-wide">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
