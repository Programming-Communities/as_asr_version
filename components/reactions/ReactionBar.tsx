'use client';

import { useState, useEffect } from 'react';
import { Smile, ThumbsUp, Heart, PartyPopper, Clapperboard, Flame } from 'lucide-react';
import wordpressService from '@/services/wordpress';
import { storageService } from '@/services/storage';

const reactionTypes = [
  { id: 'like', emoji: '👍', label: 'Like', icon: ThumbsUp, color: 'text-blue-500' },
  { id: 'love', emoji: '❤️', label: 'Love', icon: Heart, color: 'text-red-500' },
  { id: 'celebrate', emoji: '🎉', label: 'Celebrate', icon: PartyPopper, color: 'text-yellow-500' },
  { id: 'clap', emoji: '👏', label: 'Clap', icon: Clapperboard, color: 'text-green-500' },
  { id: 'fire', emoji: '🔥', label: 'Fire', icon: Flame, color: 'text-orange-500' },
  { id: 'smile', emoji: '😊', label: 'Smile', icon: Smile, color: 'text-purple-500' },
];

interface ReactionBarProps {
  postId: number;
}

export default function ReactionBar({ postId }: ReactionBarProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadReactions();
    loadUserReaction();
  }, [postId]);

  const loadReactions = async () => {
    try {
      const data = await wordpressService.getReactions(postId);
      setReactions(data || {});
    } catch (error) {
      console.error('Error loading reactions:', error);
      setReactions({});
    }
  };

  const loadUserReaction = () => {
    const guestToken = storageService.getCookie('guest_token');
    if (guestToken) {
      const userReactions = storageService.getLocal<Record<number, string>>('user_reactions', {});
      setUserReaction(userReactions?.[postId] || null);
    }
  };

  const handleReaction = async (reactionId: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setShowPicker(false);

    let guestToken = storageService.getCookie('guest_token');
    if (!guestToken) {
      guestToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      storageService.setCookie('guest_token', guestToken, 365);
    }

    try {
      const success = await wordpressService.submitReaction(postId, reactionId, guestToken);
      
      if (success) {
        const newReactions = { ...reactions };
        const oldReaction = userReaction;

        if (oldReaction && newReactions[oldReaction]) {
          newReactions[oldReaction] = Math.max(0, newReactions[oldReaction] - 1);
        }

        newReactions[reactionId] = (newReactions[reactionId] || 0) + 1;
        setReactions(newReactions);
        setUserReaction(reactionId);

        const userReactions = storageService.getLocal<Record<number, string>>('user_reactions', {});
        if (userReactions) {
          userReactions[postId] = reactionId;
          storageService.setLocal('user_reactions', userReactions);
        }

        if (oldReaction !== reactionId) {
          const button = document.getElementById(`reaction-${reactionId}`);
          if (button) {
            button.classList.add('animate-bounce');
            setTimeout(() => button.classList.remove('animate-bounce'), 1000);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          disabled={isLoading}
        >
          <Smile size={20} />
          <span className="font-medium">
            {userReaction ? 'Reacted' : 'React'}
          </span>
        </button>

        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-slide-up">
            <div className="grid grid-cols-3 gap-2">
              {reactionTypes.map((reaction) => {
                const Icon = reaction.icon;
                const count = reactions[reaction.id] || 0;
                const isActive = userReaction === reaction.id;

                return (
                  <button
                    key={reaction.id}
                    id={`reaction-${reaction.id}`}
                    onClick={() => handleReaction(reaction.id)}
                    className={`
                      flex flex-col items-center p-2 rounded-lg transition-all
                      ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    disabled={isLoading}
                    aria-label={`React with ${reaction.label}`}
                  >
                    <span className="text-2xl mb-1">{reaction.emoji}</span>
                    <span className={`text-xs font-medium ${reaction.color}`}>
                      {count > 0 && count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        {totalReactions > 0 ? (
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {reactionTypes
                .filter(reaction => reactions[reaction.id] > 0)
                .slice(0, 3)
                .map((reaction) => (
                  <div
                    key={reaction.id}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-sm"
                    title={`${reaction.label}: ${reactions[reaction.id]}`}
                  >
                    {reaction.emoji}
                  </div>
                ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Be the first to react!
          </p>
        )}
      </div>

      {userReaction && (
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm">
          You reacted with {
            reactionTypes.find(r => r.id === userReaction)?.emoji || '👍'
          }
        </div>
      )}
    </div>
  );
}