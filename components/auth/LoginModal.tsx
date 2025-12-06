'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'login' | 'register';
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  mode = 'login' 
}: LoginModalProps) {
  const [activeMode, setActiveMode] = useState<'login' | 'register'>(mode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeMode === 'login') {
        await authService.login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await authService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }

      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {activeMode === 'login' 
                    ? 'Sign in to comment, react, and bookmark' 
                    : 'Join our community to engage with content'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setActiveMode('login')}
                  className={`flex-1 py-3 text-center font-medium transition ${
                    activeMode === 'login'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveMode('register')}
                  className={`flex-1 py-3 text-center font-medium transition ${
                    activeMode === 'register'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-2">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {activeMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter your name"
                        required={activeMode === 'register'}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {activeMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="••••••••"
                        required={activeMode === 'register'}
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {activeMode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {activeMode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    activeMode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeMode === 'login' 
                      ? "Don't have an account? " 
                      : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => setActiveMode(activeMode === 'login' ? 'register' : 'login')}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {activeMode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}