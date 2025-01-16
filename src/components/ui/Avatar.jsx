import * as AvatarPrimitive from '@radix-ui/react-avatar';

export const Avatar = ({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  status,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    idle: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100 ${sizeClasses[size]} ${className}`}
        {...props}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium uppercase text-gray-600"
          delayMs={600}
        >
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusColors[status]}`}
        />
      )}
    </div>
  );
};

// Usage example:
/*
import { Avatar } from './Avatar';

function MyComponent() {
  return (
    <div>
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="User Name"
        fallback="UN"
        size="md"
        status="online"
      />
    </div>
  );
}
*/ 