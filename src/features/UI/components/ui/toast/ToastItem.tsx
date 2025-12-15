// src/components/ui/toast/ToastItem.tsx
import { Toast } from './types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const baseClasses = "p-4 rounded-lg shadow-lg border transition-all transform";
  const variantClasses = toast.variant === 'destructive'
    ? 'bg-red-50 border-red-200 text-red-900'
    : 'bg-white border-gray-200';

  return (
    <div
      className={`${baseClasses} ${variantClasses}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-sm">{toast.title}</h3>
          {toast.description && (
            <p className="text-sm mt-1 text-gray-500">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>
    </div>
  );
}