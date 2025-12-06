'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { themesConfig } from '@/config/site';
import { storageService } from '@/services/storage';
import type { ThemeConfig } from '@/types/components';

type Theme = keyof typeof themesConfig;

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  themeConfig: ThemeConfig;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get saved theme from storage
    const savedTheme = storageService.getTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine initial theme
    let initialTheme: Theme = 'light';
    
    if (savedTheme && savedTheme in themesConfig) {
      initialTheme = savedTheme as Theme;
    } else if (prefersDark) {
      initialTheme = 'dark';
    }

    setThemeState(initialTheme);
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!storageService.getTheme()) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'blue', 'green', 'purple');
    root.classList.add(theme);

    // Set theme color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themesConfig[theme].primary);
    }

    // Save to storage
    storageService.setTheme(theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    if (newTheme in themesConfig) {
      setThemeState(newTheme);
    }
  };

  const themeConfig = themesConfig[theme];
  const availableThemes = Object.keys(themesConfig) as Theme[];

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName: themeConfig.name,
        themeConfig,
        toggleTheme,
        setTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
