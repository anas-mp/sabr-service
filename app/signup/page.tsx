import { signup } from '../auth/actions'
import Link from 'next/link'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const params = await searchParams

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Link
                href="/"
                className="absolute top-8 left-8 text-scholar-gold/80 hover:text-scholar-gold transition-colors font-serif"
            >
                ← Return Home
            </Link>

            <div className="w-full max-w-md space-y-8 glass-card p-10">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl text-soft-white font-serif">
                        Join the Ranks
                    </h1>
                    <p className="text-muted-text text-sm tracking-wide">
                        BEGIN YOUR PREPARATION
                    </p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label
                            className="text-xs text-scholar-gold uppercase tracking-widest"
                            htmlFor="full_name"
                        >
                            Full Name
                        </label>
                        <input
                            className="w-full h-12 px-4 glass-input"
                            name="full_name"
                            placeholder="Officer Candidate Name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-xs text-scholar-gold uppercase tracking-widest"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="w-full h-12 px-4 glass-input"
                            name="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-xs text-scholar-gold uppercase tracking-widest"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="w-full h-12 px-4 glass-input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <SubmitButton
                        formAction={signup}
                        className="w-full h-12 bg-scholar-gold hover:bg-yellow-600 text-scholar-navy font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02]"
                    >
                        Sign Up
                    </SubmitButton>

                    {params?.message && (
                        <p className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-center rounded-xl text-sm">
                            {params.message}
                        </p>
                    )}
                </form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-muted-text hover:text-scholar-gold text-sm transition-colors"
                    >
                        Already registered? Enter here.
                    </Link>
                </div>
            </div>
        </div>
    )
}
