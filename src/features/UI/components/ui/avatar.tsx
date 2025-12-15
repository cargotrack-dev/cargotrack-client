"use client"

import React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "../../lib/utils"

const Avatar = React.forwardRef((props: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  className?: string
}, ref: React.Ref<HTMLDivElement>) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      props.className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef((props: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  className?: string,
}, ref: React.Ref<HTMLImageElement>) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", props.className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef((props: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  className?: string,
  children?: React.ReactNode
}, ref: React.Ref<HTMLDivElement>) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      props.className
    )}
    {...props}
  >
    {props.children}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }