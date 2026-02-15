import { Sidebar } from "@/components/dashboard/Sidebar"
import { ScholarChatWidget } from "@/components/dashboard/ScholarChatWidget"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-soft-white">
            <Sidebar user={user} />
            <main className="pl-64 min-h-screen">
                <div className="p-8 md:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
                    {children}
                </div>
            </main>
            <ScholarChatWidget />
        </div>
    )
}
