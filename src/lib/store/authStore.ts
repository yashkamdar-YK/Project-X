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
  error: string | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null, error: null })
}))