'use client';

import { useState, useEffect } from 'react';
import { X, Home, BookOpen, Users, Settings, LogOut, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceType } from '@/hooks/useDeviceType';
import { storageService } from '@/services/storage';
import Link from 'next/link';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  alwaysVisible?: boolean;
}

export default function Sidebar({ 
  isOpen = true, 
  onClose = () => {}, 
  alwaysVisible = true 
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState('');
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const device = useDeviceType();

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load data from storage only on client side
  useEffect(() => {
    if (isClient) {
      const bookmarks = storageService.getBookmarks();
      const historyData = storageService.getHistory();
      
      setBookmarkCount(Object.keys(bookmarks).length);
      setHistoryCount(historyData.length);
      setHistory(historyData.slice(0, 3)); // Only keep recent history for display
    }
  }, [isClient]);

  // Handle internal state for always visible sidebar
  useEffect(() => {
    if (alwaysVisible) {
      setInternalIsOpen(true);
    }
  }, [alwaysVisible]);

  useEffect(() => {
    if (!alwaysVisible && internalIsOpen && isClient) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && internalIsOpen) {
          onClose();
          setInternalIsOpen(false);
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(e.target as Node) && internalIsOpen) {
          onClose();
          setInternalIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
      };
    }
  }, [internalIsOpen, onClose, alwaysVisible, isClient]);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'blog', label: 'Blog', icon: BookOpen, href: '/blog' },
    { id: 'categories', label: 'Categories', icon: Users, href: '/categories' },
    { id: 'bookmarks', label: 'Bookmarks', icon: BookOpen, href: '/bookmarks', getCount: () => bookmarkCount },
    { id: 'history', label: 'History', icon: BookOpen, href: '/history', getCount: () => historyCount },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  // Toggle function for always visible sidebar
  const toggleSidebar = () => {
    if (alwaysVisible) {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // If always visible and closed, show minimal version
  if (alwaysVisible && !internalIsOpen) {
    return (
      <div className="w-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Always visible sidebar (expanded)
  if (alwaysVisible) {
    return (
      <aside className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
        {/* Header with close button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Menu</h3>
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            aria-label="Collapse sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const count = item.getCount ? item.getCount() : 0;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                className={`
                  flex items-center justify-between p-3 rounded-lg transition
                  ${activeItem === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {count > 0 && isClient && (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                      {count}
                    </span>
                  )}
                  <ChevronRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent History - Only show on client side */}
        {isClient && history.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Recent History
            </h3>
            <div className="space-y-2">
              {history.map((item) => (
                <Link
                  key={item.id}
                  href={`/post/${item.slug}`}
                  className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                >
                  <div className="truncate">{item.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(item.lastRead).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Logout - Only show on client side */}
        {isClient && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                storageService.removeLocal('user');
                window.location.href = '/';
              }}
              className="flex items-center justify-center w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <LogOut size={20} />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        )}
      </aside>
    );
  }

  // Mobile/Overlay sidebar (for non-always-visible mode)
  return (
    <AnimatePresence>
      {internalIsOpen && isClient && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              onClose();
              setInternalIsOpen(false);
            }}
          />

          {/* Sidebar */}
          <motion.aside
            id="sidebar"
            initial={{ x: device === 'mobile' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: device === 'mobile' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed top-0 bottom-0 z-50 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 w-64 md:w-80 right-0 border-l border-gray-200 dark:border-gray-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <button
                  onClick={() => {
                    onClose();
                    setInternalIsOpen(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const count = item.getCount ? item.getCount() : 0;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.id);
                      onClose();
                      setInternalIsOpen(false);
                    }}
                    className={`
                      flex items-center justify-between p-3 rounded-lg transition
                      ${activeItem === item.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {count > 0 && (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                          {count}
                        </span>
                      )}
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Recent History */}
            {history.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Recent History
                </h3>
                <div className="space-y-2">
                  {history.map((item) => (
                    <Link
                      key={item.id}
                      href={`/post/${item.slug}`}
                      onClick={() => {
                        onClose();
                        setInternalIsOpen(false);
                      }}
                      className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                    >
                      <div className="truncate">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(item.lastRead).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => {
                  storageService.removeLocal('user');
                  window.location.href = '/';
                }}
                className="flex items-center justify-center w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <LogOut size={20} />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}