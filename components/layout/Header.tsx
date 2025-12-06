'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Home, BookOpen, Users, Bookmark, History, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import SearchBar from '@/components/search/SearchBar';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { storageService } from '@/services/storage';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  count?: number;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load counts from storage
    const bookmarks = storageService.getBookmarks();
    const history = storageService.getHistory();
    setBookmarkCount(Object.keys(bookmarks).length);
    setHistoryCount(history.length);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main navigation items (keep these in header)
  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home, exact: true },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/categories', label: 'Categories', icon: Users },
  ];

  // User menu items (will be in dropdown/sidebar)
  const userMenuItems: NavItem[] = [
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark, count: bookmarkCount },
    { href: '/history', label: 'History', icon: History, count: historyCount },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    storageService.removeLocal('user');
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="hidden md:inline text-xl font-bold text-gray-900 dark:text-white">
                Al-Asr Islamic Service
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? pathname === item.href
                : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  User
                </span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                  {/* Profile header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Welcome, User</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Member since 2024</p>
                      </div>
                    </div>
                  </div>

                  {/* User menu items */}
                  <div className="py-2">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`
                            flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition
                            ${isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon size={18} />
                            <span>{item.label}</span>
                          </div>
                          {(item.count && item.count > 0) ? (
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                              {item.count}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Logout button */}
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-2">
              {/* Main navigation */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center p-3 rounded-lg transition
                      ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-500">User Menu</p>
                
                {/* User menu items */}
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg transition
                        ${isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="mr-3" />
                        <span>{item.label}</span>
                      </div>
                      {(item.count && item.count > 0) ? (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                          {item.count}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}

                {/* Logout in mobile */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-800">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}