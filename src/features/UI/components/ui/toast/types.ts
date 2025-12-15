// src/components/ui/toast/types.ts
export interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }