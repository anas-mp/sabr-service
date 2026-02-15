import { verifyEmail } from '../auth/actions'
import Link from 'next/link'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default async function VerifyPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string; message?: string }>
}) {
    const params = await searchParams
    const email = params.email || ''

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Link
                href="/signup"
                className="absolute top-8 left-8 text-scholar-gold/80 hover:text-scholar-gold transition-colors font-serif"
            >
                ← Back
            </Link>

            <div className="w-full max-w-md space-y-8 glass-card p-10">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl text-soft-white font-serif">
                        Verify Identity
                    </h1>
                    <p className="text-muted-text text-sm tracking-wide">
                        ENTER THE CODE SENT TO {email}
                    </p>
                </div>

                <form className="space-y-6">
                    <input type="hidden" name="email" value={email} />

                    <div className="space-y-2">
                        <label
                            className="text-xs text-scholar-gold uppercase tracking-widest"
                            htmlFor="code"
                        >
                            Verification Code
                        </label>
                        <input
                            className="w-full h-12 px-4 glass-input text-center text-xl tracking-widest"
                            name="code"
                            placeholder="123456"
                            maxLength={10}
                            required
                        />
                    </div>

                    <SubmitButton
                        formAction={verifyEmail}
                        className="w-full h-12 bg-scholar-gold hover:bg-yellow-600 text-scholar-navy font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02]"
                    >
                        Verify & Enter
                    </SubmitButton>

                    {params?.message && (
                        <p className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-center rounded-xl text-sm">
                            {params.message}
                        </p>
                    )}
                </form>

                <div className="text-center">
                    <p className="text-xs text-muted-text">
                        Check your spam folder if you don't see the code.
                    </p>
                </div>
            </div>
        </div>
    )
}
