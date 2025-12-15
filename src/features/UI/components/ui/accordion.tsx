"use client"

import React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef((props: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  className?: string 
}, ref: React.Ref<HTMLDivElement>) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", props.className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef((props: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  className?: string,
  children: React.ReactNode
}, ref: React.Ref<HTMLButtonElement>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        props.className
      )}
      {...props}
    >
      {props.children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef((props: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  className?: string,
  children: React.ReactNode
}, ref: React.Ref<HTMLDivElement>) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      props.className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{props.children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }