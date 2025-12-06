'use client';

import { useReactions } from '@/hooks/useReactions';
import ReactionTypes from './ReactionTypes';

interface ReactionStatsProps {
  postId: number;
  compact?: boolean;
}

export default function ReactionStats({ postId, compact = false }: ReactionStatsProps) {
  const { reactions, totalReactions } = useReactions(postId);

  if (totalReactions === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No reactions yet. Be the first!
        </p>
      </div>
    );
  }

  const topReactions = Object.entries(reactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => ({
      ...ReactionTypes.find(r => r.id === id),
      count
    }))
    .filter(Boolean);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-1">
          {topReactions.slice(0, 2).map((reaction, index) => (
            <div
              key={reaction?.id || index}
              className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-white dark:border-gray-700 flex items-center justify-center text-xs"
              title={`${reaction?.label}: ${reaction?.count}`}
            >
              {reaction?.emoji}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {totalReactions} reaction{totalReactions !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Reactions Summary
        </h4>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total: {totalReactions}
        </span>
      </div>

      <div className="space-y-3">
        {ReactionTypes.map(reactionType => {
          const count = reactions[reactionType.id] || 0;
          if (count === 0) return null;

          const percentage = totalReactions > 0 ? (count / totalReactions) * 100 : 0;

          return (
            <div key={reactionType.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{reactionType.emoji}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {reactionType.label}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-${reactionType.color}-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Most popular:
          </span>
          <div className="flex items-center space-x-1">
            {topReactions.map((reaction, index) => (
              <div
                key={reaction?.id || index}
                className="flex items-center space-x-1"
              >
                <span>{reaction?.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reaction?.count}
                </span>
                {index < topReactions.length - 1 && (
                  <span className="text-gray-400">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}