import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const { messages } = await req.json();

    // 1. Auth & Context Gathering
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Fetch Logs & Distractions
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();

    const { data: logs } = await supabase
        .from('study_logs')
        .select('hours, study_date')
        .eq('user_id', user.id)
        .gte('study_date', sevenDaysAgo);

    const { data: distractions } = await supabase
        .from('distraction_logs')
        .select('note, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const totalHours = logs?.reduce((sum: any, log: any) => sum + Number(log.hours), 0) || 0;
    const logSummary = logs?.map((l: any) => `${l.study_date}: ${l.hours}h`).join(', ');
    const distractionSummary = distractions?.map((d: any) => d.note).join(', ');

    // 2. Define System Prompt
    const systemPrompt = `
      You are "Scholar AI", a wise, empathetic, and disciplined Islamic study companion.
      
      Current User Context:
      - Recent Study Logs (Last 7 Days): ${logSummary || "No logs yet"}
      - Total Hours (Last 7 Days): ${totalHours}
      - Recent Distractions: ${distractionSummary || "None recorded"}
      
      Instructions:
      1. Role: You are a mentor. Be authoritative but kind. Use phrases like "My dear brother/sister", "Patience", "Focus".
      2. Analysis: Use the provided data to give accurate answers about their progress.
      3. Advice: If they are distracted, give specific tips based on their actual distraction logs.
      4. Islam: Integrate Quranic wisdom or Hadith naturally where appropriate for relief or motivation.
      5. Length: Keep responses concise (2-4 sentences). Do not lecture.
      
      If the user asks "What is my distraction?", look at the Recent Distractions list provided above and summarize it.
  `;

    // 3. Stream Text
    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt,
        messages,
    });

    return result.toDataStreamResponse();
}
