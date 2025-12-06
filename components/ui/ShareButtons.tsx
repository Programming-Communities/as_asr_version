'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link2, Mail, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
  className?: string;
}

export default function ShareButtons({ title, url, excerpt = '', className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${excerpt}\n\n${url}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: shareLinks.facebook,
      color: 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: shareLinks.twitter,
      color: 'text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: shareLinks.linkedin,
      color: 'text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: shareLinks.whatsapp,
      color: 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900',
    },
    {
      name: 'Email',
      icon: Mail,
      href: shareLinks.email,
      color: 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {shareButtons.map((button) => {
          const Icon = button.icon;
          return (
            <a
              key={button.name}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition ${button.color}`}
              aria-label={`Share on ${button.name}`}
              title={`Share on ${button.name}`}
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>

      <div className="relative">
        <button
          onClick={handleCopyLink}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label={copied ? 'Link copied!' : 'Copy link'}
          title={copied ? 'Link copied!' : 'Copy link'}
        >
          <Link2 size={18} />
        </button>
        
        {copied && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
            <span className="relative">
              Copied!
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}