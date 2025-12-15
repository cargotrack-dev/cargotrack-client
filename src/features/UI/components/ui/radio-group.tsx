"use client"

import React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef((
  props: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
    className?: string
  }, 
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { className, ...rest } = props;
  
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...rest}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef((
  props: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    className?: string
  },
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { className, ...rest } = props;
  
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem }