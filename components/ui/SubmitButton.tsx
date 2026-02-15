'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { ComponentProps } from 'react'

interface SubmitButtonProps extends ComponentProps<'button'> {
    children: React.ReactNode
    className?: string
}

export function SubmitButton({ children, className, ...props }: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending || props.disabled}
            className={`flex items-center justify-center gap-2 ${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
            {...props}
        >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    )
}
