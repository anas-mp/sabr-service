export const Logo = ({ className = "w-6 h-6" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer Octagon/Star Base */}
            <path
                d="M50 0L85.3553 14.6447L100 50L85.3553 85.3553L50 100L14.6447 85.3553L0 50L14.6447 14.6447L50 0Z"
                className="stroke-scholar-gold/30"
                strokeWidth="2"
            />

            {/* Inner Decorative Circle */}
            <circle cx="50" cy="50" r="35" className="stroke-scholar-gold/50" strokeWidth="1" />

            {/* Stylized 'Qalam' (Pen) Nib / Minaret Shape */}
            <path
                d="M50 20C50 20 65 50 65 70C65 78.2843 58.2843 85 50 85C41.7157 85 35 78.2843 35 70C35 50 50 20 50 20Z"
                className="fill-scholar-gold"
            />

            {/* Center Split of Pen */}
            <path d="M50 20V75" className="stroke-[#0B0F19]" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
