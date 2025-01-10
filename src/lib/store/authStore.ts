import { create } from 'zustand'

export interface UserProfile {
  email: string;
  name: string;
  ucc: string;
  createdon: string;
  lastlogin: string;
  disabled: boolean;
  usertype: string;
  phoneno: string | null;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null, error: null })
}))