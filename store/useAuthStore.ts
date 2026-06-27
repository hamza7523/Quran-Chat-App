import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

console.log('typeof create:', typeof create); // should log "function"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthStore {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  clearError: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  isLoading: false,
  error: null,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },

  clearError: () => set({ error: null }),

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { name }, // stored in auth.users.raw_user_meta_data
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }

      // Also create a row in user_profiles for app-level data
      if (data.user) {
        await supabase.from('user_profiles').upsert({
          id: data.user.id,
          name,
          intent: 'explore',
        });
      }

      set({ session: data.session, user: data.user, isLoading: false });
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return false;
      }

      set({ session: data.session, user: data.user, isLoading: false });
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ session: null, user: null, isLoading: false, error: null });
  },
}));