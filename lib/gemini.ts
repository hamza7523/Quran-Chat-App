/**
 * Gemini 1.5 Flash — Qur'anic Scholar AI
 *
 * Fixes applied:
 * - Aggressive anti-markdown system prompt (### --- ** * all banned)
 * - stopSequences to prevent runaway responses
 * - maxOutputTokens capped at 700 (enough for 4–5 rich paragraphs)
 * - Post-processing strip pass as safety net
 * - Explicit "end your response naturally" instruction
 */

const GEMINI_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type GeminiResponse = {
  text: string;
  citations: { surah: string; ayahNumber: number }[];
};

// ─── System Prompts ───────────────────────────────────────────────────────────

const BASE_INSTRUCTIONS = `
You are a knowledgeable, warm Islamic scholar helping Muslims connect with the Qur'an.

FORMATTING — STRICTLY FOLLOW THESE OR YOUR RESPONSE IS WRONG:
- Write in plain flowing paragraphs only. NO exceptions.
- NEVER use: ###, ##, #, ---, ***, **, *, -, bullet points, numbered lists, or any markdown.
- Do NOT number sections like "1." or "2." — just write naturally.
- Separate thoughts with a blank line between paragraphs. That is all.
- Dont refer to user as Brother or Sister in your output, just give responses gender neutral

CITATIONS — ALWAYS do this for every verse you mention:
1. Arabic text on its own line.
2. English translation in quotes on the next line.
3. Reference in this exact format on its own line: [Surah Name Chapter:Verse]

Example of correct citation:
إِنَّ مَعَ الْعُسْرِ يُسْرًا
"Indeed, with hardship will be ease."
[Ash-Sharh 94:6]

RESPONSE LENGTH:
- Give a complete, satisfying answer in 3 to 5 paragraphs maximum.
- End your response naturally when the answer is complete. Do not pad or repeat.
- Never trail off mid-sentence. Always finish your last sentence cleanly.

CONTENT:
- Be warm, compassionate, and scholarly.
- Respond in the same language the user writes in.
- Never issue fatwas or definitive religious rulings.
`.trim();

const MODE_PROMPTS: Record<string, string> = {
  ask: `${BASE_INSTRUCTIONS}

You are in Qur'anic Knowledge mode. Help the user understand Qur'anic meanings, context, stories of prophets, and scholarly interpretations. Mention tafsir context where relevant.`,

  comfort: `${BASE_INSTRUCTIONS}

You are in Spiritual Comfort mode. The user needs support. Begin with empathy, then share Qur'anic verses offering hope, patience (sabr), and trust in Allah (tawakkul). Lead with the heart before the mind.`,

  dua: `${BASE_INSTRUCTIONS}

You are in Du'a mode. Help the user make sincere supplication. Prioritize Qur'anic duas, explain their meaning, and guide personalization. Mention etiquette of du'a briefly.`,
};

// ─── Citation Parser ──────────────────────────────────────────────────────────

export function extractCitations(
  text: string
): { surah: string; ayahNumber: number }[] {
  const pattern = /\[([A-Za-z'-]+(?:\s[A-Za-z'-]+)*)\s+(\d+):(\d+)\]/g;
  const seen = new Set<string>();
  const citations: { surah: string; ayahNumber: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const surah = match[1].trim();
    const chapter = match[2];
    const ayah = parseInt(match[3], 10);
    const key = `${surah}:${chapter}:${ayah}`;
    if (!seen.has(key)) {
      seen.add(key);
      citations.push({ surah, ayahNumber: ayah });
    }
  }
  return citations;
}

// ─── Markdown stripper (safety net) ──────────────────────────────────────────

function stripMarkdown(text: string): string {
  return text
    // Remove headers: ###, ##, #
    .replace(/^#{1,6}\s+/gm, '')
    // Remove horizontal rules: ---, ***, ___
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove bold/italic: **, *, __
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Remove numbered list markers: "1. ", "2. " at line start
    .replace(/^\d+\.\s+/gm, '')
    // Remove bullet list markers: "- ", "• " at line start
    .replace(/^[-•]\s+/gm, '')
    // Collapse 3+ consecutive newlines into 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Main Chat Function ───────────────────────────────────────────────────────

export async function chatWithGemini(
  userMessage: string,
  history: ChatMessage[],
  mode: 'ask' | 'comfort' | 'dua',
  quranContext?: string
): Promise<GeminiResponse> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set');

  const systemPrompt = MODE_PROMPTS[mode] ?? MODE_PROMPTS.ask;

  const contextualSystem = quranContext
    ? `${systemPrompt}\n\nVERIFIED QUR'ANIC TEXT — use these exact translations for these verses:\n${quranContext}`
    : systemPrompt;

  // Cap history at last 6 messages
  const recentHistory = history.slice(-6);

  const contents = [
    ...recentHistory.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const body = {
    system_instruction: {
      parts: [{ text: contextualSystem }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 2048,       // ~4–5 rich paragraphs; prevents runaway
      temperature: 0.65,          // slightly lower = more disciplined formatting
      topP: 0.9,
      stopSequences: [
        '###',                    // hard stop if markdown headers appear
        '\n---',                  // hard stop on horizontal rules
        '\n***',
      ],
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  };

  const res = await fetch(`${GEMINI_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    'I apologize, I was unable to generate a response. Please try again.';

  // Always run the strip pass — catches anything that slips through
  const text = stripMarkdown(rawText);
  const citations = extractCitations(text);

  return { text, citations };
}

// ─── Conversation Title Generator ─────────────────────────────────────────────

export async function generateConversationTitle(
  firstMessage: string,
  mode: 'ask' | 'comfort' | 'dua'
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return firstMessage.slice(0, 40);

  const modeLabel =
    mode === 'ask'
      ? 'Quranic question'
      : mode === 'comfort'
      ? 'comfort request'
      : "du'a request";

  try {
    const res = await fetch(`${GEMINI_BASE}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Generate a short title (max 6 words, no quotes, no markdown, no punctuation at the end) for a ${modeLabel} starting with: "${firstMessage.slice(0, 100)}"`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 16,
          temperature: 0.4,
          stopSequences: ['###', '\n'],
        },
      }),
    });

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const title = data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.replace(/[#*\-]/g, '')
      .trim();

    return title ?? firstMessage.slice(0, 40);
  } catch {
    return firstMessage.slice(0, 40);
  }
}