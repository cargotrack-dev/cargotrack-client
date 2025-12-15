// src/components/ui/date-picker.tsx
"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@features/UI/components/ui/popover";
import { Button } from "@features/UI/components/ui/button";
import { Calendar } from "@features/UI/components/ui/calendar";
import { cn } from "@features/UI/lib/utils";

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => date && onChange(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// For simplified implementation if you don't have all the dependent components
export function SimpleDatePicker({
  value,
  onChange,
  disabled = false,
  className,
}: DatePickerProps) {
  return (
    <input
      type="date"
      value={value ? format(value, "yyyy-MM-dd") : ""}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : new Date();
        onChange(date);
      }}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  );
}