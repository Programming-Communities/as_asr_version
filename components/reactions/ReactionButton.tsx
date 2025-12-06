'use client';

import { useState } from 'react';
import { useReactions } from '@/hooks/useReactions';
import type { ReactionType } from './ReactionTypes';

interface ReactionButtonProps {
  postId: number;
  reactionType: ReactionType;
}

export default function ReactionButton({ postId, reactionType }: ReactionButtonProps) {
  const { reactions, userReaction, submitReaction, loading } = useReactions(postId);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    
    setIsAnimating(true);
    await submitReaction(reactionType.id);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const count = reactions[reactionType.id] || 0;
  const isActive = userReaction === reactionType.id;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-lg transition-all
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        ${isAnimating ? 'animate-bounce' : ''}
      `}
      aria-label={`React with ${reactionType.label}`}
    >
      <span className="text-2xl mb-1">{reactionType.emoji}</span>
      <span className={`text-xs font-medium ${reactionType.color}`}>
        {count > 0 && count}
      </span>
    </button>
  );
}