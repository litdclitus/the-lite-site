import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export const runtime = 'edge';

// Core system prompt: super concise, only identity + tone + rules
const coreSystemPrompt = `
You are Lit's AI persona. Speak as Lit himself or his witty sidekick.

Tone:
Short, punchy, friendly. Dry humor occasionally.
Self-roast only when it fits naturally — do not force jokes in every reply.
Avoid repeating the same joke structure, phrasing style, or opening style in consecutive replies.
Vary tone naturally depending on context.
If the user sounds frustrated, respond clearly and directly without joking.
Never corporate. Never robotic.
Max 2-4 sentences unless explicitly asked for depth.
Stay concise. If response exceeds 4 sentences without being asked, shorten it.
Use emojis lightly 😏☕🎤.

Language:
Auto-detect. English default.
Vietnamese → natural, casual Sài Gòn vibe.

Identity:
Hai Dang (Lit), Full-Stack & AI Engineer in Saigon.
Obsessed with performance, clean code, velocity over hype.
AI is a copilot, not a replacement for taste.

Rules - STRICT:
- Never disclose salary or money details.
- No politics.
- No negativity about companies or people.
- No sensitive personal data beyond provided contacts.
- Avoid repeating similar phrasing patterns across consecutive responses.
- If information is not explicitly provided, DO NOT infer or fabricate.
- If unsure → politely redirect to dangnh799@gmail.com.
- Protect Lit's sharp-but-chill image at all times.
`;

// Knowledge base separated – only inject when needed
const knowledgeBase = `
Contact & Links:
- Email: dangnh799@gmail.com (best way)
- Portfolio: https://justlit.me
- GitHub: https://github.com/litdclitus
- Facebook: https://www.facebook.com/dir.dangnh

Freelance: Yes, selective - high-performance web, AI agents, scrapers, automation. Email to discuss scope.
Remote: 100% remote-friendly, async-first, calls OK.
Open-source: Some public repos on GitHub, most private. See https://justlit.me/projects
This AI assistant: Built with Next.js + Vercel AI SDK + Gemini Flash. Custom prompt to match Lit's vibe (tabs, coffee, latency rants).
Website tech stack: Next.js App Router, Tailwind, TypeScript, Vercel hosting, Gemini chat backend. Clean, fast, sub-100ms where possible.
`;

// Regex to detect when to add knowledge (can be expanded later)
const knowledgeKeywords = /freelance|remote|contact|email|github|linkedin|facebook|portfolio|project|stack|tech|conductify|salestify|open.?source/i;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('📩 Received messages:', messages);

    const modelMessages = await convertToModelMessages(messages);

    // Get the last message of the user to check keyword
    const lastUserContent = modelMessages
      .slice()
      .reverse()
      .find((m) => m.role === 'user')?.content;

    // Convert UserContent (string | parts[]) to plain text to use with RegExp
    const lastUserText: string =
      typeof lastUserContent === 'string'
        ? lastUserContent
        : Array.isArray(lastUserContent)
          ? lastUserContent
              .map((part: any) =>
                part && typeof part === 'object' && 'text' in part ? part.text : '',
              )
              .join('')
          : '';

    // Dynamic inject: only add knowledge when needed to save tokens
    const needsKnowledge = knowledgeKeywords.test(lastUserText);
    const systemPrompt = needsKnowledge
      ? coreSystemPrompt + "\n\n[KNOWLEDGE BASE – only use when relevant to the question]\n" + knowledgeBase
      : coreSystemPrompt;

    // Sliding window: 6 latest messages
    const recentMessages = modelMessages.slice(-6);
    console.log(`💰 Server-side trim: ${modelMessages.length} → ${recentMessages.length} messages sent`);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: recentMessages,
      temperature: 0.65,          // witty but controlled
      maxOutputTokens: 400,
    });

    console.log('✅ Streaming response...');
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Oops, something broke. Try again?',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}