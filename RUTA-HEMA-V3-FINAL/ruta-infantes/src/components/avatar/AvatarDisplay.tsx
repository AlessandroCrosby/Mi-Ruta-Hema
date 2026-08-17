import { Avatar } from '@/types';
import { AVATAR_TYPES, AVATAR_COLORS } from '@/lib/constants';

interface AvatarDisplayProps {
  avatar: Avatar;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
}

export function AvatarDisplay({ avatar, size = 'md', showName = false }: AvatarDisplayProps) {
  const avatarType = AVATAR_TYPES.find(t => t.id === avatar.type);
  const avatarColor = AVATAR_COLORS.find(c => c.id === avatar.color);

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl', 
    xl: 'text-8xl'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`${sizeClasses[size]} animate-bounce-gentle`}
        style={{ 
          color: avatarColor?.color || 'currentColor',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}
      >
        {avatarType?.emoji || '🤗'}
      </div>
      {showName && (
        <p className="text-sm font-fredoka font-medium text-center">
          {avatar.name}
        </p>
      )}
    </div>
  );
}