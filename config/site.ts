export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Al Asr Centers',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Islamic Educational Center',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://al-asr-centers.com',
  links: {
    facebook: 'https://facebook.com/al-asr-centers',
    twitter: 'https://twitter.com/al-asr-centers',
    youtube: 'https://youtube.com/@al-asr-centers',
    instagram: 'https://instagram.com/al-asr-centers',
  },
  features: {
    enablePWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
    enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
    enableReactions: process.env.NEXT_PUBLIC_ENABLE_REACTIONS === 'true',
    enableAds: process.env.NEXT_PUBLIC_ENABLE_ADS === 'false', // false by default
  },
};

export const themesConfig = {
  light: {
    name: 'Light',
    primary: '#1a56db',
    secondary: '#7e3af2',
    background: '#ffffff',
    text: '#111827',
    accent: '#0694a2',
    isDark: false,
  },
  dark: {
    name: 'Dark',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#111827',
    text: '#f3f4f6',
    accent: '#0ea5e9',
    isDark: true,
  },
  blue: {
    name: 'Blue',
    primary: '#1e40af',
    secondary: '#1d4ed8',
    background: '#dbeafe',
    text: '#1e3a8a',
    accent: '#3b82f6',
    isDark: false,
  },
  green: {
    name: 'Green',
    primary: '#047857',
    secondary: '#059669',
    background: '#d1fae5',
    text: '#064e3b',
    accent: '#10b981',
    isDark: false,
  },
  purple: {
    name: 'Purple',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    background: '#f5f3ff',
    text: '#5b21b6',
    accent: '#a78bfa',
    isDark: false,
  },
};

export const adsConfig = {
  desktop: {
    sidebar: {
      slot: 'desktop-sidebar',
      format: 'vertical' as const,
      sizes: [[300, 600], [300, 250]],
    },
    inArticle: {
      slot: 'desktop-inarticle',
      format: 'horizontal' as const,
      sizes: [[728, 90], [970, 250]],
    },
    footer: {
      slot: 'desktop-footer',
      format: 'horizontal' as const,
      sizes: [[728, 90]],
    },
  },
  tablet: {
    sidebar: {
      slot: 'tablet-sidebar',
      format: 'vertical' as const,
      sizes: [[300, 250]],
    },
    inArticle: {
      slot: 'tablet-inarticle',
      format: 'horizontal' as const,
      sizes: [[468, 60]],
    },
  },
  mobile: {
    inArticle: {
      slot: 'mobile-inarticle',
      format: 'rectangle' as const,
      sizes: [[300, 250]],
    },
    sticky: {
      slot: 'mobile-sticky',
      format: 'horizontal' as const,
      sizes: [[320, 50]],
    },
  },
};

export const cookieConfig = {
  maxAge: parseInt(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || '365'),
  necessary: true,
  categories: ['analytics', 'marketing', 'personalization'] as const,
};
