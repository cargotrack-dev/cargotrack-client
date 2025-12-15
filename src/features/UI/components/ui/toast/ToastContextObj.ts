// src/components/ui/toast/ToastContextObj.ts
import { createContext } from 'react';
import { Toast } from './types';

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);