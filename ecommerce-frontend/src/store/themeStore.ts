import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('theme') as Theme;
  return stored || 'dark';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
    set({ theme: next });
  },
  setTheme: (t: Theme) => {
    localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('light', t === 'light');
    set({ theme: t });
  },
}));
