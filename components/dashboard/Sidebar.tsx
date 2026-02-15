'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, LayoutGrid, Library, ScrollText, Users, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function Sidebar({ user }: { user: any }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const navItems = [
        { label: 'Study Room', icon: LayoutGrid, href: '/dashboard' },
        { label: 'Focus Engine', icon: BookOpen, href: '/focus' },
        { label: 'Journal', icon: ScrollText, href: '/journal' },
    ]

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0B0F19] border-r border-white/5 flex flex-col p-6 z-50">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 bg-scholar-emerald/20 rounded-lg flex items-center justify-center border border-scholar-emerald/30">
                    <BookOpen className="w-5 h-5 text-scholar-emerald" />
                </div>
                <h1 className="text-soft-white font-serif text-lg tracking-wide">Sabr & Service</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-scholar-emerald/10 text-scholar-emerald' : 'text-muted-text hover:bg-white/5 hover:text-soft-white'}`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-scholar-emerald' : 'text-muted-text group-hover:text-soft-white'}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    )
                })}

                <div className="pt-6 mt-6 border-t border-white/5 px-2">
                    <Link
                        href="/overwhelmed"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-scholar-gold/5 border border-scholar-gold/10 text-scholar-gold hover:bg-scholar-gold/10 transition-all group"
                    >
                        <div className="w-2 h-2 rounded-full bg-scholar-gold animate-pulse" />
                        <span className="font-medium text-xs uppercase tracking-wider">I feel overwhelmed</span>
                    </Link>
                </div>
            </nav>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex flex-col gap-3 px-2 mb-3 cursor-default">
                    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-soft-white font-serif text-xs border border-white/10 shrink-0">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-soft-white font-medium truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 text-[10px] text-muted-text hover:text-soft-white transition-colors tracking-widest uppercase py-2"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
