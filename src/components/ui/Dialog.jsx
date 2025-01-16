import * as Dialog from '@radix-ui/react-dialog';

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;

export const DialogContent = ({ children, ...props }) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fade-in" />
    <Dialog.Content
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg animate-slide-up"
      {...props}
    >
      {children}
      <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        ×
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
);

export const DialogTitle = ({ children, ...props }) => (
  <Dialog.Title
    className="text-lg font-semibold mb-2"
    {...props}
  >
    {children}
  </Dialog.Title>
);

export const DialogDescription = ({ children, ...props }) => (
  <Dialog.Description
    className="text-gray-600 mb-4"
    {...props}
  >
    {children}
  </Dialog.Description>
);

// Usage example:
/*
import { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './Dialog';

function MyComponent() {
  return (
    <DialogRoot>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogTitle>Welcome</DialogTitle>
        <DialogDescription>This is a dialog description</DialogDescription>
        <div>Your content here</div>
      </DialogContent>
    </DialogRoot>
  );
}
*/ 