import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// ─── Platform-safe storage adapter ───────────────────────────────────────────
// AsyncStorage crashes during Expo web SSR because `window` is not defined
// in Node.js. We lazily import it only on native, and fall back to a no-op
// on web so the SSR render pass doesn't crash.

const nativeStorage =
  Platform.OS !== 'web'
    ? require('@react-native-async-storage/async-storage').default
    : {
        getItem: async (_key: string) => null,
        setItem: async (_key: string, _value: string) => {},
        removeItem: async (_key: string) => {},
      };

// ─── Client ───────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: nativeStorage,
    autoRefreshToken: true,
    persistSession: Platform.OS !== 'web', // no session persistence needed on web SSR
    detectSessionInUrl: false,
  },
});

// ─── Database Types ───────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  name: string;
  intent: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  mode: 'ask' | 'comfort' | 'dua';
  title: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type DailyAyahCache = {
  id: string;
  date: string;
  surah_number: number;
  ayah_number: number;
  arabic_text: string;
  english_text: string;
  surah_name: string;
  reference: string;
};

// ─── SQL Schema (run once in your Supabase SQL editor) ───────────────────────
/*
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL DEFAULT 'Guest',
  intent      TEXT NOT NULL DEFAULT 'explore',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  mode        TEXT NOT NULL CHECK (mode IN ('ask', 'comfort', 'dua')),
  title       TEXT NOT NULL DEFAULT 'New Conversation',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content             TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_ayah_cache (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date            DATE NOT NULL UNIQUE,
  surah_number    INT NOT NULL,
  ayah_number     INT NOT NULL,
  arabic_text     TEXT NOT NULL,
  english_text    TEXT NOT NULL,
  surah_name      TEXT NOT NULL,
  reference       TEXT NOT NULL
);

CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

CREATE INDEX IF NOT EXISTS idx_conversations_user_id    ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at      ON messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_daily_ayah_date          ON daily_ayah_cache(date);

ALTER TABLE user_profiles    DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations     DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages          DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ayah_cache  DISABLE ROW LEVEL SECURITY;
*/

// ─── User Profile Helpers ─────────────────────────────────────────────────────

export async function createUserProfile(
  name: string,
  intent: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({ name, intent })
    .select()
    .single();
  if (error) { console.error('[Supabase] createUserProfile:', error.message); return null; }
  return data;
}

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select()
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

// ─── Conversation Helpers ─────────────────────────────────────────────────────

export async function createConversation(
  id: string, // <-- 1. Accept the local ID here
  userId: string,
  mode: Conversation['mode'],
  title: string
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ id, user_id: userId, mode, title }) // <-- 2. Insert the local ID into the DB
    .select()
    .single();
    
  if (error) { 
    console.error('[Supabase] createConversation:', error.message); 
    return null; 
  }
  return data;
}
export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select()
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);
  if (error) { console.error('[Supabase] getConversations:', error.message); return []; }
  return data ?? [];
}

export async function updateConversationTitle(id: string, title: string): Promise<void> {
  await supabase.from('conversations').update({ title }).eq('id', id);
}

// ─── Message Helpers ──────────────────────────────────────────────────────────

export async function insertMessage(
  conversationId: string,
  role: Message['role'],
  content: string
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single();
  if (error) { console.error('[Supabase] insertMessage:', error.message); return null; }
  return data;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select()
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) { console.error('[Supabase] getMessages:', error.message); return []; }
  return data ?? [];
}

// ─── Daily Ayah Cache Helpers ─────────────────────────────────────────────────

export async function getCachedDailyAyah(date: string): Promise<DailyAyahCache | null> {
  const { data, error } = await supabase
    .from('daily_ayah_cache')
    .select()
    .eq('date', date)
    .single();
  if (error) return null;
  return data;
}

export async function cacheDailyAyah(ayah: Omit<DailyAyahCache, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('daily_ayah_cache')
    .upsert(ayah, { onConflict: 'date' });
  if (error) console.error('[Supabase] cacheDailyAyah:', error.message);
}