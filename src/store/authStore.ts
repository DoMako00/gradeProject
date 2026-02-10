import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  ensureProfileExists,
  authUserFromSession,
  getSessionWithProfile,
  type ProfileRow,
} from '../lib/authHelpers';
import type { AuthUser } from '../types';

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'user' | 'mechanic' | 'seller';
}

interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  profile: ProfileRow | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: Session | null, profile: ProfileRow | null, user: AuthUser | null) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<{ needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  login: (user: AuthUser) => void;
  logout: () => void;
  clear: () => void;
}

const initialState = {
  session: null as Session | null,
  user: null as AuthUser | null,
  profile: null as ProfileRow | null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setSession: (session, profile, user) =>
    set({
      session,
      profile,
      user,
      isAuthenticated: !!user,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      session: user ? get().session : null,
      profile: user ? get().profile : null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const session = data.session;
    if (!session) throw new Error('No session after sign in');
    const profile = await ensureProfileExists(session);
    const authUser = authUserFromSession(session, profile);
    set({
      session,
      user: authUser,
      profile,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  signUp: async (payload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          phone: payload.phone,
          role: payload.role,
        },
      },
    });
    if (error) throw error;
    if (data.session) {
      const profile = await ensureProfileExists(data.session);
      const authUser = authUserFromSession(data.session, profile);
      set({
        session: data.session,
        user: authUser,
        profile,
        isAuthenticated: true,
        isLoading: false,
      });
      return {};
    }
    return { needsEmailConfirmation: true };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ ...initialState });
  },

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  logout: () => set({ ...initialState }),

  clear: () => set(initialState),
}));

export const authStore = useAuthStore;
