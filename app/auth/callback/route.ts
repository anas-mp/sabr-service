import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it, otherwise default to /dashboard
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        // Create a temporary object to hold cookies
        const cookieUpdates: { name: string, value: string, options: any }[] = []

        const supabaseWithCookies = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieUpdates.push({ name, value, options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieUpdates.push({ name, value: '', options: { ...options, maxAge: 0 } })
                    },
                },
            }
        )

        const { error: exchangeError } = await supabaseWithCookies.auth.exchangeCodeForSession(code)

        if (!exchangeError) {
            const response = NextResponse.redirect(`${origin}${next}`)

            // Apply the cookies to the response
            cookieUpdates.forEach(({ name, value, options }) => {
                response.cookies.set({ name, value, ...options })
            })

            return response
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
