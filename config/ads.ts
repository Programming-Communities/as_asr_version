export const adsConfig = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_ADS === 'true',
  
  providers: {
    google: {
      enabled: false,
      publisherId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || '',
    },
    custom: {
      enabled: true,
    },
  },

  slots: {
    desktop: {
      sidebar: {
        id: 'desktop-sidebar',
        sizes: [[300, 600], [300, 250]],
        refresh: 30,
      },
      inArticle: {
        id: 'desktop-inarticle',
        sizes: [[728, 90], [970, 250]],
        refresh: 60,
      },
      footer: {
        id: 'desktop-footer',
        sizes: [[728, 90]],
        refresh: 120,
      },
    },
    tablet: {
      sidebar: {
        id: 'tablet-sidebar',
        sizes: [[300, 250]],
        refresh: 30,
      },
      inArticle: {
        id: 'tablet-inarticle',
        sizes: [[468, 60]],
        refresh: 60,
      },
    },
    mobile: {
      inArticle: {
        id: 'mobile-inarticle',
        sizes: [[300, 250]],
        refresh: 30,
      },
      sticky: {
        id: 'mobile-sticky',
        sizes: [[320, 50]],
        refresh: 45,
        position: 'bottom',
      },
    },
  },

  targeting: {
    category: '',
    tags: '',
    postId: '',
    pageType: '',
  },

  privacy: {
    nonPersonalizedAds: false,
    restrictDataProcessing: false,
  },

  adBlockerDetection: {
    enabled: true,
    message: 'Please consider disabling your ad blocker to support our site.',
  },
};

export type AdSlot = keyof typeof adsConfig.slots.desktop | 
                     keyof typeof adsConfig.slots.tablet | 
                     keyof typeof adsConfig.slots.mobile;

export function getAdConfig(device: 'desktop' | 'tablet' | 'mobile', slot: AdSlot) {
  const deviceSlots = adsConfig.slots[device];
  if (!deviceSlots) return null;
  
  return deviceSlots[slot as keyof typeof deviceSlots] || null;
}

export function shouldShowAd(slot: AdSlot): boolean {
  if (!adsConfig.enabled) return false;
  
  const cookieConsent = localStorage.getItem('cookie_consent');
  if (cookieConsent) {
    try {
      const consent = JSON.parse(cookieConsent);
      if (!consent.marketing) return false;
    } catch {
      // If parsing fails, allow ads
    }
  }
  
  return true;
}