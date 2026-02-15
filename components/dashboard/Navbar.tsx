'use server'

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function signOut() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    await supabase.auth.signOut()
    return redirect("/login")
}

import { Logo } from "@/components/ui/Logo"

export async function DashboardNavbar() {
    return (
        <nav className="flex items-center justify-between py-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-3">
                {/* Logo Container with Glow */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-scholar-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Logo className="w-12 h-12 text-scholar-gold relative z-10" />
                </div>
                {/* Optional Text - Hidden for now as user just asked for logo replacement, but could add title */}
            </div>

            <form action={signOut}>
                <button className="text-xs text-muted-text hover:text-soft-white tracking-widest uppercase transition-colors">
                    Disconnect
                </button>
            </form>
        </nav>
    )
}
