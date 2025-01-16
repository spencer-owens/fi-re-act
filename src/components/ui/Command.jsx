import * as React from 'react';
import * as CommandPrimitive from 'cmdk';

const Command = React.forwardRef(({ className = '', ...props }, ref) => (
  <CommandPrimitive.Root
    ref={ref}
    className={`flex h-full w-full flex-col overflow-hidden rounded-md bg-white ${className}`}
    {...props}
  />
));
Command.displayName = 'Command';

const CommandInput = React.forwardRef(({ className = '', ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <CommandPrimitive.Input
      ref={ref}
      className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  </div>
));
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef(({ className = '', ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={`max-h-[300px] overflow-y-auto overflow-x-hidden ${className}`}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-gray-500"
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef(({ className = '', ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={`overflow-hidden p-1 text-gray-700 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 ${className}`}
    {...props}
  />
));
CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef(({ className = '', ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

const CommandSeparator = React.forwardRef(({ className = '', ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={`-mx-1 h-px bg-gray-200 ${className}`}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
};

// Usage example:
/*
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './Command';

function SearchComponent() {
  return (
    <Command>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Channels">
          <CommandItem>#general</CommandItem>
          <CommandItem>#random</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Users">
          <CommandItem>John Doe</CommandItem>
          <CommandItem>Jane Smith</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
*/ 