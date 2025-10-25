import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (user && token) {
      set({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
      });
    }
  },
}));
