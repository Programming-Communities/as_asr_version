'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ProgressBarProps {
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  color = '#3b82f6',
  height = 3,
  showPercentage = false 
}: ProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setPercentage(Math.round(value * 100));
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 origin-left"
        style={{
          scaleX,
          height: `${height}px`,
          backgroundColor: color,
        }}
      />
      
      {showPercentage && percentage > 0 && percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg"
        >
          {percentage}% read
        </motion.div>
      )}
    </>
  );
}
