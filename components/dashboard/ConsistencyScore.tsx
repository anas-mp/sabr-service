export function ConsistencyScore({ hours }: { hours: number }) {
    // Logic: 
    // < 10 hrs/week: "Stabilizing Routine"
    // 10-25 hrs/week: "Building Momentum"
    // > 25 hrs/week: "Strong Discipline"

    let status = "Stabilizing Routine"
    let color = "text-muted-text"

    if (hours > 25) {
        status = "Strong Discipline"
        color = "text-scholar-emerald"
    } else if (hours > 10) {
        status = "Building Momentum"
        color = "text-scholar-gold"
    }

    return (
        <div className="glass-card p-6 flex flex-col justify-center items-center h-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 text-center space-y-2">
            <h3 className="text-4xl font-serif text-soft-white">{hours}</h3>
            <p className="text-xs text-muted-text uppercase tracking-widest">Total Hours (This Week)</p>
            <div className={`mt-2 py-1 px-3 rounded-full text-xs font-medium bg-white/5 border border-white/5 ${color}`}>
                {status}
            </div>
        </div>
    )
}
