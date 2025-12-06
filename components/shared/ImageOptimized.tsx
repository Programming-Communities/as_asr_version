'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  blurDataURL?: string;
  onLoadingComplete?: () => void;
}

export default function ImageOptimized({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  sizes = '100vw',
  priority = false,
  quality = 85,
  blurDataURL,
  onLoadingComplete,
}: ImageOptimizedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const imageProps = {
    src: error ? '/images/placeholder.jpg' : src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    fill,
    sizes,
    priority,
    quality,
    blurDataURL,
    onLoad: handleLoad,
    onError: handleError,
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
      )}
      <Image {...imageProps} />
    </div>
  );
}