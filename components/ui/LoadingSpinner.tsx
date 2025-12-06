'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
  type?: 'default' | 'bars' | 'dots' | 'pulse';
}

export default function LoadingSpinner({ 
  fullScreen = false, 
  text = 'Loading...',
  type = 'default' 
}: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const spinnerClass = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
    : 'flex items-center justify-center p-8';

  const SpinnerContent = () => {
    switch (type) {
      case 'bars':
        return (
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-8 bg-blue-600 dark:bg-blue-400 rounded"
                animate={{
                  height: ['20px', '40px', '20px'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        );

      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={spinnerClass}
      >
        <div className="text-center">
          <SpinnerContent />
          {text && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600 dark:text-gray-400 font-medium"
            >
              {text}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
