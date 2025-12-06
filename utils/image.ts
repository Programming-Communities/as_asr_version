/**
 * Image optimization utility
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Generate optimized image URL
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!originalUrl) return '/images/placeholder.jpg';
  
  // Default options
  const {
    width = 1200,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover',
  } = options;

  // If using a CDN
  const isExternalUrl = originalUrl.startsWith('http');
  
  if (isExternalUrl) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality) params.set('q', quality.toString());
    params.set('fit', fit);
    
    return `${originalUrl}?${params.toString()}`;
  }

  return originalUrl;
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  if (!url) return { width: 1200, height: 630 };
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 1200, height: 630 });
    };
    img.src = url;
  });
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
}
