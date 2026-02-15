import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export function FocusWidget() {
    return (
        <Link href="/focus" className="block h-full group">
            <div className="glass-card p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(6,95,70,0.15)] group-hover:border-scholar-emerald/30 relative overflow-hidden">

                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-scholar-emerald/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-scholar-emerald/10 text-scholar-emerald">
                            <Zap className="w-6 h-6" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-text group-hover:text-scholar-emerald transition-transform group-hover:translate-x-1" />
                    </div>

                    <div>
                        <h3 className="text-soft-white font-serif text-lg leading-tight mb-1">Focus Engine</h3>
                        <p className="text-xs text-muted-text">
                            Start a deep study session. Build momentum.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-4">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-scholar-emerald w-0 group-hover:w-full transition-all duration-700 ease-out" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
