'use client';

import type { WPCategory } from '@/types/wordpress';

interface CategoryBadgeProps {
  category: WPCategory;
  small?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function CategoryBadge({ 
  category, 
  small = false, 
  className = '',
  onClick 
}: CategoryBadgeProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      // Navigate to category page
      window.location.href = `/category/${category.slug}`;
    }
  };

  const sizeClasses = small 
    ? 'px-2 py-1 text-xs' 
    : 'px-3 py-1.5 text-sm';

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center 
        bg-blue-100 dark:bg-blue-900 
        text-blue-600 dark:text-blue-400
        rounded-full font-medium
        hover:bg-blue-200 dark:hover:bg-blue-800
        transition-all duration-200
        ${sizeClasses}
        ${className}
      `}
      aria-label={`View ${category.name} category`}
    >
      <span className="truncate">{category.name}</span>
    </button>
  );
}