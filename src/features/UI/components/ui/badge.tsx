// src/components/ui/badge.tsx
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "warning";
}

function Badge({ 
  className, 
  variant = "default", 
  ...props 
}: BadgeProps) {
  let variantStyles = "";
  
  switch (variant) {
    case "default":
      variantStyles = "bg-blue-500 text-white hover:bg-blue-600";
      break;
    case "secondary":
      variantStyles = "bg-gray-100 text-gray-900 hover:bg-gray-200";
      break;
    case "destructive":
      variantStyles = "bg-red-500 text-white hover:bg-red-600";
      break;
    case "outline":
      variantStyles = "text-gray-900 border border-gray-200 hover:bg-gray-100";
      break;
    case "warning":
      variantStyles = "bg-yellow-500 text-white hover:bg-yellow-600";
      break;
  }
  
  return (
    <div
      className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variantStyles} ${className || ""}`}
      {...props}
    />
  );
}

export { Badge };