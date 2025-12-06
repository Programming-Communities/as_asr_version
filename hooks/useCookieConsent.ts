'use client';

import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';
import { cookieConfig } from '@/config/site';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState(false);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedConsent = storageService.getCookie('consent');
    const savedPreferences = storageService.getCookiePreferences();
    
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      setHasConsent(true);
    }
    
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };

    storageService.setCookiePreferences(allAccepted);
    storageService.setCookie('consent', 'all', cookieConfig.maxAge);
    setHasConsent(true);
    setIsVisible(false);

    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: allAccepted }));
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };

    storageService.setCookiePreferences(necessaryOnly);
    storageService.setCookie('consent', 'necessary', cookieConfig.maxAge);
    setHasConsent(true);
    setIsVisible(false);

    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: necessaryOnly }));
  };

  const savePreferences = (customPreferences: Record<string, boolean>) => {
    storageService.setCookiePreferences(customPreferences);
    storageService.setCookie('consent', 'custom', cookieConfig.maxAge);
    setHasConsent(true);
    setIsVisible(false);
    setPreferences(customPreferences);

    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: customPreferences }));
  };

  const updatePreference = (category: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  return {
    hasConsent,
    preferences,
    isVisible,
    setIsVisible,
    acceptAll,
    acceptNecessary,
    savePreferences,
    updatePreference,
  };
}