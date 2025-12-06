export const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#1a56db',
      secondary: '#7e3af2',
      background: '#ffffff',
      surface: '#f9fafb',
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        disabled: '#9ca3af',
      },
      border: '#e5e7eb',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#111827',
      surface: '#1f2937',
      text: {
        primary: '#f3f4f6',
        secondary: '#9ca3af',
        disabled: '#6b7280',
      },
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    },
  },
  blue: {
    name: 'Blue',
    colors: {
      primary: '#1e40af',
      secondary: '#1d4ed8',
      background: '#dbeafe',
      surface: '#eff6ff',
      text: {
        primary: '#1e3a8a',
        secondary: '#3b82f6',
        disabled: '#93c5fd',
      },
      border: '#bfdbfe',
      success: '#047857',
      warning: '#d97706',
      error: '#dc2626',
      info: '#1d4ed8',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(30 64 175 / 0.05)',
      md: '0 4px 6px -1px rgb(30 64 175 / 0.1), 0 2px 4px -2px rgb(30 64 175 / 0.1)',
      lg: '0 10px 15px -3px rgb(30 64 175 / 0.1), 0 4px 6px -4px rgb(30 64 175 / 0.1)',
    },
  },
  green: {
    name: 'Green',
    colors: {
      primary: '#047857',
      secondary: '#059669',
      background: '#d1fae5',
      surface: '#ecfdf5',
      text: {
        primary: '#064e3b',
        secondary: '#059669',
        disabled: '#6ee7b7',
      },
      border: '#a7f3d0',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0ea5e9',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(4 120 87 / 0.05)',
      md: '0 4px 6px -1px rgb(4 120 87 / 0.1), 0 2px 4px -2px rgb(4 120 87 / 0.1)',
      lg: '0 10px 15px -3px rgb(4 120 87 / 0.1), 0 4px 6px -4px rgb(4 120 87 / 0.1)',
    },
  },
  purple: {
    name: 'Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      background: '#f5f3ff',
      surface: '#faf5ff',
      text: {
        primary: '#5b21b6',
        secondary: '#7c3aed',
        disabled: '#c4b5fd',
      },
      border: '#ddd6fe',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#8b5cf6',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(124 58 237 / 0.05)',
      md: '0 4px 6px -1px rgb(124 58 237 / 0.1), 0 2px 4px -2px rgb(124 58 237 / 0.1)',
      lg: '0 10px 15px -3px rgb(124 58 237 / 0.1), 0 4px 6px -4px rgb(124 58 237 / 0.1)',
    },
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes.light;

export function getTheme(themeName: ThemeName): Theme {
  return themes[themeName] || themes.light;
}

export function applyTheme(themeName: ThemeName) {
  const theme = getTheme(themeName);
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      root.style.setProperty(`--color-${key}`, value);
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        root.style.setProperty(`--color-${key}-${subKey}`, subValue);
      });
    }
  });
  
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.colors.primary);
  }
}

export function getCurrentTheme(): ThemeName {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('theme') as ThemeName;
  if (savedTheme && savedTheme in themes) return savedTheme;
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}