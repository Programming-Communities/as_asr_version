'use client';

import { Hash } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      window.history.pushState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  // Handle scroll to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;

      const currentPosition = window.scrollY + 120;
      let currentActiveId = '';
      
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          if (element.offsetTop <= currentPosition) {
            currentActiveId = heading.id;
          }
        }
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  // Handle initial hash in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash && headings.some(h => h.id === hash)) {
        setTimeout(() => scrollToSection(hash), 100);
      }
    }
  }, [headings]);

  const handleTocClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <Hash size={20} className="text-blue-600 dark:text-blue-400" />
        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
          📋 Table of Contents
        </h4>
      </div>
      
      {headings.length > 0 ? (
        <>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {headings.map((heading, i) => (
              <a
                key={`${heading.id}-${i}`}
                href={`#${heading.id}`}
                onClick={(e) => handleTocClick(heading.id, e)}
                className={`flex items-start p-2 rounded-lg transition w-full ${
                  activeId === heading.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${heading.level === 3 ? 'ml-4' : heading.level === 4 ? 'ml-8' : ''}`}
              >
                <span className="text-sm flex-1">
                  {heading.text.length > 50 ? `${heading.text.substring(0, 50)}...` : heading.text}
                </span>
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 ml-2 ${
                  activeId === heading.id
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {i + 1}
                </span>
              </a>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            {headings.length} sections • Click to jump
          </p>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            No sections detected in this article
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Scroll to read the full content
          </p>
        </div>
      )}
    </div>
  );
}