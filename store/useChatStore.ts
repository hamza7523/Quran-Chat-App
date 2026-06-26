import { create } from 'zustand';

export type ChatMode = 'ask' | 'comfort' | 'dua';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
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
  systemPrompt: string;
}

const MODE_META: Record<ChatMode, ModeMeta> = {
  ask: {
    title: "Ask About the Qur'an",
    subtitle: 'Explore meaning, context & wisdom',
    systemPrompt: `You are a knowledgeable Islamic scholar specializing in Qur'anic studies. 
Answer questions about the Qur'an with depth, accuracy, and humility. 
Always cite specific verses using the format [Surah Name X:Y] when referencing them.
Be respectful, clear, and grounded in classical scholarship.`,
  },
  comfort: {
    title: 'Find Comfort',
    subtitle: 'Verses for difficult moments',
    systemPrompt: `You are a compassionate Islamic guide helping someone find solace in the Qur'an.
Offer gentle, heartfelt responses grounded in Qur'anic wisdom.
Always cite relevant verses using the format [Surah Name X:Y].
Speak with warmth, empathy, and hope.`,
  },
  dua: {
    title: "Help Me Make Du'a",
    subtitle: 'Guided personal prayer',
    systemPrompt: `You are a knowledgeable Muslim guide helping someone make sincere du'a (supplication).
Draw from Qur'anic duas and prophetic supplications.
Always cite sources using the format [Surah Name X:Y] for Qur'anic references.
Be personal, encouraging, and spiritually uplifting.`,
  },
};

function nowISO() {
  return new Date().toISOString();
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

interface ChatStore {
  conversations: Conversation[];
  createConversation: (mode: ChatMode) => string;
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (id: string, text: string) => void;
  addAssistantMessage: (id: string, content: string) => void;
  getModeMeta: (mode: ChatMode) => ModeMeta;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],

  createConversation: (mode) => {
    const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = nowISO();
    const newConv: Conversation = {
      id,
      mode,
      title: MODE_META[mode].title,
      messages: [],
      lastMessagePreview: 'Tap to continue…',
      updatedAt: formatUpdatedAt(now),
      createdAt: now,
    };
    set((state) => ({ conversations: [newConv, ...state.conversations] }));
    return id;
  },

  updateConversation: (id, patch) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: formatUpdatedAt(nowISO()) } : c
      ),
    }));
  },

  deleteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    }));
  },

  getConversation: (id) => get().conversations.find((c) => c.id === id),

  sendMessage: (id, text) => {
    const msg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: nowISO(),
    };
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessagePreview: text.slice(0, 60),
              updatedAt: formatUpdatedAt(nowISO()),
            }
          : c
      ),
    }));
  },

  addAssistantMessage: (id, content) => {
    const msg: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content,
      createdAt: nowISO(),
    };
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessagePreview: content.slice(0, 60),
              updatedAt: formatUpdatedAt(nowISO()),
            }
          : c
      ),
    }));
  },

  getModeMeta: (mode) => MODE_META[mode],
}));