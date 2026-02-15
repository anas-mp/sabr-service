'use server'

import { createClient } from '@/utils/supabase/client'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface ChatResponse {
    message: string
    action?: string
}

async function getSupabase() {
    const cookieStore = await cookies()
    return createServerClient(
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
}

export async function askScholar(userMessage: string): Promise<ChatResponse> {
    const supabase = await getSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { message: "I cannot identify you, traveler. Please sign in." }
    }

    try {
        // 1. Fetch User Context (Logs & Distractions)
        const now = new Date()
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString()

        // Fetch study logs
        const { data: logs } = await supabase
            .from('study_logs')
            .select('hours, study_date')
            .eq('user_id', user.id)
            .gte('study_date', sevenDaysAgo)

        // Fetch distractions
        const { data: distractions } = await supabase
            .from('distraction_logs')
            .select('note, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

        const totalHours = logs?.reduce((sum, log) => sum + Number(log.hours), 0) || 0
        const logSummary = logs?.map(l => `${l.study_date}: ${l.hours}h`).join(', ')
        const distractionSummary = distractions?.map(d => d.note).join(', ')

        // 2. Check for API Key
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return { message: "System Update Required: Please add your GEMINI_API_KEY to the .env.local file to activate the advanced Scholar AI." }
        }

        // 3. Generate Content with Gemini
        const genAI = new GoogleGenerativeAI(apiKey)
        // Using gemini-flash-latest as verified working model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

        const prompt = `
            You are "Scholar AI", a wise, empathetic, and disciplined Islamic study companion.
            
            Current User Context:
            - Recent Study Logs (Last 7 Days): ${logSummary || "No logs yet"}
            - Total Hours (Last 7 Days): ${totalHours}
            - Recent Distractions: ${distractionSummary || "None recorded"}
            
            User Query: "${userMessage}"
            
            Instructions:
            1. Role: You are a mentor. Be authoritative but kind. Use phrases like "My dear brother/sister", "Patience", "Focus".
            2. Analysis: Use the provided data to give accurate answers about their progress.
            3. Advice: If they are distracted, give specific tips based on their actual distraction logs.
            4. Islam: Integrate Quranic wisdom or Hadith naturally where appropriate for relief or motivation.
            5. Length: Keep responses concise (2-4 sentences). Do not lecture.
            
            If the user asks "What is my distraction?", look at the Recent Distractions list provided above and summarize it.
        `

        const result = await model.generateContent(prompt)
        const response = result.response
        return { message: response.text() }

    } catch (error: any) {
        console.error("AI Error Detailed:", JSON.stringify(error, null, 2))

        // Handle Rate Limiting specifically
        if (error.message?.includes('429') || error.status === 429) {
            return { message: "The Scholar is deep in contemplation (System Busy). Please try again in a few seconds." }
        }

        return { message: "The archives are momentarily inaccessible. Please check your API key or try again later." }
    }
}
