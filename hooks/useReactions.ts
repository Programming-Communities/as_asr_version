import { useState, useEffect } from 'react';
import wordpressService from '@/services/wordpress';
import { storageService } from '@/services/storage';

export const useReactions = (postId: number) => {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
    loadUserReaction();
  }, [postId]);

  const loadReactions = async () => {
    try {
      const data = await wordpressService.getReactions(postId);
      setReactions(data);
    } catch (error) {
      console.error('Error loading reactions:', error);
      setReactions({});
    }
  };

  const loadUserReaction = () => {
    const guestToken = storageService.getCookie('guest_token');
    if (guestToken) {
      const userReactions = storageService.getLocal<Record<number, string>>('user_reactions', {});
      setUserReaction(userReactions[postId] || null);
    }
  };

  const submitReaction = async (reactionId: string) => {
    if (loading) return false;

    setLoading(true);

    try {
      let guestToken = storageService.getCookie('guest_token');
      if (!guestToken) {
        guestToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        storageService.setCookie('guest_token', guestToken, 365);
      }

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
        userReactions[postId] = reactionId;
        storageService.setLocal('user_reactions', userReactions);

        return true;
      }
    } catch (error) {
      console.error('Error submitting reaction:', error);
    } finally {
      setLoading(false);
    }

    return false;
  };

  // Calculate total reactions
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  return {
    reactions,
    userReaction,
    loading,
    totalReactions, // Add this
    submitReaction,
    refreshReactions: loadReactions,
  };
};