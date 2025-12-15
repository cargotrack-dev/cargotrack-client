"use client"

import React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "../../lib/utils"

const Label = React.forwardRef((
  props: React.ComponentProps<typeof LabelPrimitive.Root> & {
    className?: string
  },
  ref: React.ForwardedRef<HTMLLabelElement>
) => {
  const { className, ...rest } = props;
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...rest}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName

export { Label }