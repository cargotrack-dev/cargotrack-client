// src/components/ui/date-range-picker.tsx
// ✅ FIXED: Removed missing formatDate import
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onFromChange: (date: Date) => void;
  onToChange: (date: Date) => void;
  className?: string;
}

// ✅ ADDED: Built-in date formatting function
const formatDate = (date: Date, format: 'display' | 'input' = 'display'): string => {
  if (!date || isNaN(date.getTime())) {
    return '';
  }

  if (format === 'input') {
    // Format for HTML date input (yyyy-mm-dd)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format for display (MMM dd, yyyy)
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  from,
  to,
  onFromChange,
  onToChange,
  className
}) => {
  // Format dates for display
  const fromFormatted = formatDate(from, 'display');
  const toFormatted = formatDate(to, 'display');

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {fromFormatted}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-2">
            <h4 className="font-medium">Select start date</h4>
            <input 
              type="date" 
              className="w-full border border-gray-200 rounded-md p-2"
              value={formatDate(from, 'input')}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                // Ensure date is valid and not after the end date
                if (!isNaN(newDate.getTime()) && newDate <= to) {
                  onFromChange(newDate);
                }
              }}
              max={formatDate(to, 'input')}
            />
          </div>
        </PopoverContent>
      </Popover>
      
      <span className="text-sm text-muted-foreground">to</span>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {toFormatted}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-2">
            <h4 className="font-medium">Select end date</h4>
            <input 
              type="date" 
              className="w-full border border-gray-200 rounded-md p-2"
              value={formatDate(to, 'input')}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                // Ensure date is valid and not before the start date
                if (!isNaN(newDate.getTime()) && newDate >= from) {
                  onToChange(newDate);
                }
              }}
              min={formatDate(from, 'input')}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};