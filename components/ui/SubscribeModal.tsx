'use client';

import { useState } from 'react';
import { X, Mail, Bell, Check } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    weeklyDigest: true,
    newPosts: true,
    trending: false,
    announcements: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('subscribed', 'true');
      setIsSuccess(true);
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl transition-all">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="text-green-600 dark:text-green-400" size={32} />
                    </div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Successfully Subscribed!
                    </Dialog.Title>
                    <p className="text-gray-600 dark:text-gray-400">
                      Thank you for subscribing to our newsletter.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Bell className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div>
                          <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                            Stay Updated
                          </Dialog.Title>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get the latest articles and insights
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        aria-label="Close"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Notification Preferences
                        </h4>
                        <div className="space-y-3">
                          {[
                            { id: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of top articles' },
                            { id: 'newPosts', label: 'New Posts', description: 'When new articles are published' },
                            { id: 'trending', label: 'Trending Content', description: 'Popular articles this week' },
                            { id: 'announcements', label: 'Announcements', description: 'Site updates and news' },
                          ].map((pref) => (
                            <div key={pref.id} className="flex items-start">
                              <input
                                type="checkbox"
                                id={pref.id}
                                checked={preferences[pref.id as keyof typeof preferences]}
                                onChange={(e) => setPreferences({
                                  ...preferences,
                                  [pref.id]: e.target.checked,
                                })}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={pref.id} className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {pref.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  {pref.description}
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        By subscribing, you agree to our{' '}
                        <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Privacy Policy
                        </a>
                        {' '}and{' '}
                        <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Terms of Service
                        </a>.
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                      </button>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}