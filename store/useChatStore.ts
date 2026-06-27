import { create } from 'zustand';
import { chatWithGemini, generateConversationTitle } from '../lib/gemini';
// Add createConversation to this import:
import { insertMessage, updateConversationTitle, createConversation as createSupabaseConversation } from '../lib/supabase'; 
import { searchQuran } from '../lib/quranApi';
// Import your auth store to grab the user ID:
import { useAuthStore } from './useAuthStore';
// ─── Types ─────────────────────────────────────────────────────────────────

export type ChatMode = 'ask' | 'comfort' | 'dua';

export interface Citation {
  surah: string;       // e.g. "Al-Baqarah"
  chapter: number;     // e.g. 2
  ayah: number;        // e.g. 255
  reference: string;   // e.g. "Al-Baqarah 2:255"
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isLoading?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  mode: ChatMode;
  title: string;
  messages: Message[];
  lastMessagePreview: string;
  updatedAt: string;
  createdAt: string;
}

export interface ModeMeta {
  title: string;
  subtitle: string;
}

// ─── Mode Meta ─────────────────────────────────────────────────────────────

const MODE_META: Record<ChatMode, ModeMeta> = {
  ask: {
    title: "Ask About the Qur'an",
    subtitle: 'Explore meaning, context & wisdom',
  },
  comfort: {
    title: 'Find Comfort',
    subtitle: 'Verses for difficult moments',
  },
  dua: {
    title: "Help Me Make Du'a",
    subtitle: 'Guided personal prayer',
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function nowISO() {
  return new Date().toISOString();
}

function formatUpdatedAt(iso: string): string {
  const diffMins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Parses [Surah Name X:Y] citations correctly.
 * Handles multi-word names: [Al-Baqarah 2:255], [Ar-Rahman 55:13]
 * The key fix: captures chapter AND ayah separately so surah name is clean.
 */
function parseCitations(text: string): Citation[] {
  const pattern = /\[([A-Za-z'-]+(?:\s[A-Za-z'-]+)*)\s+(\d+):(\d+)\]/g;
  const seen = new Set<string>();
  const citations: Citation[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const surah = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const ayah = parseInt(match[3], 10);
    const reference = `${surah} ${chapter}:${ayah}`;
    if (!seen.has(reference)) {
      seen.add(reference);
      citations.push({ surah, chapter, ayah, reference });
    }
  }
  return citations;
}

// ─── Store ──────────────────────────────────────────────────────────────────

interface ChatStore {
  conversations: Conversation[];
  createConversation: (mode: ChatMode) => string;
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (id: string, text: string) => Promise<void>;
  getModeMeta: (mode: ChatMode) => ModeMeta;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],

  createConversation: (mode) => {
    const id = generateUUID();
    const now = nowISO();
    const newConv: Conversation = {
      id,
      mode,
      title: MODE_META[mode].title,
      messages: [],
      lastMessagePreview: 'Tap to start…',
      updatedAt: formatUpdatedAt(now),
      createdAt: now,
    };
    set((s) => ({ conversations: [newConv, ...s.conversations] }));
    return id;
  },

  updateConversation: (id, patch) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: formatUpdatedAt(nowISO()) } : c
      ),
    }));
  },

  deleteConversation: (id) => {
    set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id) }));
  },

  getConversation: (id) => get().conversations.find((c) => c.id === id),

  getModeMeta: (mode) => MODE_META[mode],

  sendMessage: async (convId, text) => {
    const conv = get().getConversation(convId);
    if (!conv) return;

    const now = nowISO();

    // 1. Optimistic user message
    const userMsg: Message = {
      id: generateUUID(),
      role: 'user',
      content: text,
      createdAt: now,
    };

    // 2. Loading placeholder bubble
    const loadingId = generateUUID();
    const loadingMsg: Message = {
      id: loadingId,
      role: 'assistant',
      content: "Seeking wisdom from the Qur'an…",
      isLoading: true,
      createdAt: now,
    };

    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, userMsg, loadingMsg],
              lastMessagePreview: text.slice(0, 60),
              updatedAt: formatUpdatedAt(now),
            }
          : c
      ),
    }));

    try {
      // 3. Build history for Gemini (snapshot before this message)
      const history = conv.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 4. Fetch Quranic verse context to ground the AI
      // Use first 4 words as keyword — avoids over-broad searches
      let quranContext = '';
      try {
        const keywords = text.trim().split(/\s+/).slice(0, 4).join(' ');
        const searchRes = await searchQuran(keywords, 3);
        if (Array.isArray(searchRes) && searchRes.length > 0) {
          quranContext = searchRes
            .map((r) => `[${r.reference}]: "${r.englishText}"`)
            .join('\n');
        }
      } catch {
        // Non-fatal — Gemini answers from its own knowledge if search fails
      }

      // 5. Call Gemini
      const aiResponse = await chatWithGemini(
        text,
        history,
        conv.mode,
        quranContext || undefined
      );

      // 6. Strip markdown artifacts
      const cleanText = aiResponse.text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      // 7. Parse citations correctly (chapter + ayah separated)
      const citations = parseCitations(cleanText);

      // 8. Replace loading bubble with real response
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === loadingId
                    ? { ...m, content: cleanText, citations, isLoading: false }
                    : m
                ),
                lastMessagePreview: cleanText.slice(0, 60),
                updatedAt: formatUpdatedAt(nowISO()),
              }
            : c
        ),
      }));

// 9. Background: auto-title & sync conversation to Supabase on first user message
      if (conv.messages.length === 0) {
        // Grab the authenticated user from the auth store
        const user = useAuthStore.getState().user;
        
        if (user) {
          // CREATE the conversation in Supabase FIRST using the shared local ID
          await createSupabaseConversation(convId, user.id, conv.mode, conv.title).catch(console.error);
        }

        generateConversationTitle(text, conv.mode)
          .then((title) => {
            get().updateConversation(convId, { title });
            updateConversationTitle(convId, title).catch(() => {});
          })
          .catch(() => {});
      }

      // 10. Background: persist to Supabase
      // These will now succeed because the conversation row exists!
      insertMessage(convId, 'user', text).catch(() => {});
      insertMessage(convId, 'assistant', cleanText).catch(() => {});
    } catch (error) {
      console.error('[Chat] sendMessage error:', error);
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === loadingId
                    ? {
                        ...m,
                        content:
                          'I apologize, I am having trouble connecting right now. Please check your connection and try again.',
                        isLoading: false,
                      }
                    : m
                ),
              }
            : c
        ),
      }));
    }
  },
}));