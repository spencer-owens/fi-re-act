import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;

export const DropdownContent = ({ children, align = 'end', ...props }) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      align={align}
      className="min-w-[220px] bg-white rounded-md p-1 shadow-md animate-slide-down-fade"
      {...props}
    >
      {children}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
);

export const DropdownItem = ({ children, className = '', ...props }) => (
  <DropdownMenu.Item
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 ${className}`}
    {...props}
  >
    {children}
  </DropdownMenu.Item>
);

export const DropdownSeparator = () => (
  <DropdownMenu.Separator className="h-px my-1 bg-gray-200" />
);

export const DropdownLabel = ({ children, className = '', ...props }) => (
  <DropdownMenu.Label
    className={`px-2 py-2 text-xs text-gray-500 ${className}`}
    {...props}
  >
    {children}
  </DropdownMenu.Label>
);

// Usage example:
/*
import { 
  DropdownRoot, 
  DropdownTrigger, 
  DropdownContent, 
  DropdownItem,
  DropdownSeparator,
  DropdownLabel 
} from './Dropdown';

function MyComponent() {
  return (
    <DropdownRoot>
      <DropdownTrigger>Options</DropdownTrigger>
      <DropdownContent>
        <DropdownLabel>Actions</DropdownLabel>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-red-600">Delete</DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
}
*/ 