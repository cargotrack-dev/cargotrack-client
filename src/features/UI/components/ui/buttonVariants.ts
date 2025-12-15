// src/components/ui/buttonVariants.ts
import { cn } from '@features/UI/lib/utils';

export interface ButtonVariantProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const buttonVariants = ({ 
  variant = 'default', 
  size = 'default',
  className = '',
}: ButtonVariantProps = {}) => {
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return cn(
    'font-medium rounded-md transition-colors',
    variantClasses[variant],
    sizeClasses[size],
    className
  );
};