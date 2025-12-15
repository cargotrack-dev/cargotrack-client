// src/features/UI/components/ui/toast/Toaster.tsx
import { useToast } from './useToast';
import { ToastItem } from './ToastItem';
import { Toast } from './types';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast: Toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}