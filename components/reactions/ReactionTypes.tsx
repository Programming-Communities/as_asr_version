export interface ReactionType {
  id: string;
  emoji: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

const ReactionTypes: ReactionType[] = [
  {
    id: 'like',
    emoji: '👍',
    label: 'Like',
    icon: () => <span>👍</span>,
    color: 'blue',
  },
  {
    id: 'love',
    emoji: '❤️',
    label: 'Love',
    icon: () => <span>❤️</span>,
    color: 'red',
  },
  {
    id: 'celebrate',
    emoji: '🎉',
    label: 'Celebrate',
    icon: () => <span>🎉</span>,
    color: 'yellow',
  },
  {
    id: 'clap',
    emoji: '👏',
    label: 'Clap',
    icon: () => <span>👏</span>,
    color: 'green',
  },
  {
    id: 'fire',
    emoji: '🔥',
    label: 'Fire',
    icon: () => <span>🔥</span>,
    color: 'orange',
  },
  {
    id: 'smile',
    emoji: '😊',
    label: 'Smile',
    icon: () => <span>😊</span>,
    color: 'purple',
  },
  {
    id: 'thinking',
    emoji: '🤔',
    label: 'Thinking',
    icon: () => <span>🤔</span>,
    color: 'indigo',
  },
  {
    id: 'pray',
    emoji: '🙏',
    label: 'Pray',
    icon: () => <span>🙏</span>,
    color: 'gray',
  },
];

export default ReactionTypes;

export function getReactionType(id: string): ReactionType | undefined {
  return ReactionTypes.find(reaction => reaction.id === id);
}

export function getReactionEmoji(id: string): string {
  return getReactionType(id)?.emoji || '👍';
}

export function getReactionLabel(id: string): string {
  return getReactionType(id)?.label || 'Like';
}