'use client'

interface InsightEngineProps {
    currentWeeklyHours: number
    lastWeeklyHours: number
}

// Simple text-based analysis component
export function InsightEngine({ currentWeeklyHours, lastWeeklyHours }: InsightEngineProps) {

    const getInsight = () => {
        const diff = currentWeeklyHours - lastWeeklyHours

        // Handle Edge Case: No study data at all
        if (currentWeeklyHours === 0 && lastWeeklyHours === 0) {
            return "Ready to start? Log your first session to see insights."
        }

        // Handle Infinite Growth (0 -> X)
        if (lastWeeklyHours === 0 && currentWeeklyHours > 0) {
            return "You've started building momentum this week. Keep going."
        }

        // Handle 100% Drop (X -> 0)
        if (lastWeeklyHours > 0 && currentWeeklyHours === 0) {
            return "No study recorded this week yet. Time to get back on track."
        }

        const percentChange = ((diff) / lastWeeklyHours) * 100
        const absPercent = Math.round(Math.abs(percentChange))

        if (diff > 0) {
            // Increase
            if (absPercent > 1000) return "Your study volume is showing massive growth compared to last week."
            return `Study volume is up ${absPercent}% from last week. Excellent momentum.`
        } else if (diff < 0) {
            // Decrease
            if (absPercent < 10) return "You are maintaining consistent volume compared to last week."
            return `Study volume is down ${absPercent}% from last week. Let's push a bit more.`
        }

        // Exact Same
        return "You are maintaining perfect consistency with last week's volume."
    }

    return (
        <div className="glass-card p-6 flex items-center justify-center text-center">
            <p className="text-sm font-serif text-scholar-emerald italic">
                "{getInsight()}"
            </p>
        </div>
    )
}
