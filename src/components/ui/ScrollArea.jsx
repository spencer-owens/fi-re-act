import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

const ScrollArea = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={`relative overflow-hidden ${className}`}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef(({ className = '', orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={`flex touch-none select-none transition-colors ${
      orientation === 'vertical' ? 
      'h-full w-2.5 border-l border-l-transparent p-[1px]' : 
      'h-2.5 border-t border-t-transparent p-[1px]'
    } ${className}`}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };

// Usage example:
/*
import { ScrollArea } from './ScrollArea';

function MessageList() {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          {message.content}
        </div>
      ))}
    </ScrollArea>
  );
}
*/ 