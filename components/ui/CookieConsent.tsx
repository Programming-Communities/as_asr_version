'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Check, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { storageService } from '@/services/storage';
import { cookieConfig } from '@/config/site';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    const savedPreferences = storageService.getCookiePreferences();
    const hasConsent = storageService.getCookie('consent');

    if (!hasConsent) {
      setIsVisible(true);
    }

    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
      timestamp: Date.now(),
    };

    storageService.setCookiePreferences(allAccepted);
    storageService.setCookie('consent', 'all', cookieConfig.maxAge);
    setIsVisible(false);

    // Trigger consent event for analytics
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsent', { detail: allAccepted }));
    }
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
      timestamp: Date.now(),
    };

    storageService.setCookiePreferences(necessaryOnly);
    storageService.setCookie('consent', 'necessary', cookieConfig.maxAge);
    setIsVisible(false);

    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: necessaryOnly }));
  };

  const handleSavePreferences = () => {
    storageService.setCookiePreferences({
      ...preferences,
      timestamp: Date.now(),
    });
    
    storageService.setCookie('consent', 'custom', cookieConfig.maxAge);
    setIsVisible(false);
    setShowSettings(false);

    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: preferences }));
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        {showSettings ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cookie className="text-blue-600 dark:text-blue-400" size={20} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cookie Settings
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We use cookies to enhance your experience. Choose which types of cookies you allow.
            </p>

            <div className="space-y-4">
              {Object.entries(preferences).map(([key, value]) => {
                const label = {
                  necessary: 'Necessary',
                  analytics: 'Analytics',
                  marketing: 'Marketing',
                  personalization: 'Personalization',
                }[key as keyof typeof preferences];

                const description = {
                  necessary: 'Required for the website to function',
                  analytics: 'Help us understand how visitors interact',
                  marketing: 'Used to deliver relevant advertisements',
                  personalization: 'Remember your preferences and settings',
                }[key as keyof typeof preferences];

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      key === 'necessary'
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {label}
                        </span>
                        {key === 'necessary' && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                            Always on
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {description}
                      </p>
                    </div>
                    {key !== 'necessary' && (
                      <button
                        onClick={() => handleTogglePreference(key as keyof typeof preferences)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                        aria-label={`Toggle ${label}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <Check size={18} />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Cookie className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Necessary Only
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center space-x-2"
                  >
                    <Settings size={18} />
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Accept All
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Read our{' '}
                  <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
