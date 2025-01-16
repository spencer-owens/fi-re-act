import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = ({ 
  children, 
  content, 
  delayDuration = 200,
  side = 'top',
  ...props 
}) => (
  <TooltipPrimitive.Root delayDuration={delayDuration}>
    <TooltipPrimitive.Trigger asChild>
      {children}
    </TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        className="z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white animate-slide-up-fade"
        {...props}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

// Usage example:
/*
import { TooltipProvider, Tooltip } from './Tooltip';

function App() {
  return (
    <TooltipProvider>
      <Tooltip content="Add to favorites">
        <button>⭐</button>
      </Tooltip>
    </TooltipProvider>
  );
}
*/ 