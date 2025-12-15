"use client"
// src/components/ui/button.tsx
import React from 'react';
import { buttonVariants, ButtonVariantProps } from './buttonVariants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  Omit<ButtonVariantProps, 'className'> {}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'default',
  ...props 
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
};