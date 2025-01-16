import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

export const PopoverRoot = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = React.forwardRef(({ 
  className = '', 
  align = 'center', 
  sideOffset = 4,
  children,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={`z-50 w-72 rounded-md border bg-white p-4 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 ${className}`}
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-current text-white" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = 'PopoverContent';

export const PopoverClose = PopoverPrimitive.Close;

// Usage example:
/*
import { PopoverRoot, PopoverTrigger, PopoverContent } from './Popover';

function EmojiPicker() {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <button className="rounded-md px-2 py-1 hover:bg-gray-100">
          😀
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <div className="grid grid-cols-8 gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className="rounded p-1 hover:bg-gray-100"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </PopoverRoot>
  );
}
*/ 