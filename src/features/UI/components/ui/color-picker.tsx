// src/components/ui/color-picker.tsx
"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Check } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children?: React.ReactNode;
  className?: string;
  presetColors?: string[];
}

export function ColorPicker({
  color,
  onChange,
  children,
  className,
  presetColors = [
    "#000000", // Black
    "#ffffff", // White
    "#f44336", // Red
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#673ab7", // Deep Purple
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#03a9f4", // Light Blue
    "#00bcd4", // Cyan
    "#009688", // Teal
    "#4caf50", // Green
    "#8bc34a", // Light Green
    "#cddc39", // Lime
    "#ffeb3b", // Yellow
    "#ffc107", // Amber
    "#ff9800", // Orange
    "#ff5722", // Deep Orange
    "#795548", // Brown
    "#607d8b", // Blue Grey
  ],
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localColor, setLocalColor] = React.useState(color);
  
  // Update local color when the color prop changes
  React.useEffect(() => {
    setLocalColor(color);
  }, [color]);
  
  // Apply the color change
  const applyColor = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
    setIsOpen(false);
  };
  
  // Validate hex color
  const isValidHex = (color: string) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalColor(value);
    
    // If it's a valid hex color, update it
    if (isValidHex(value)) {
      onChange(value);
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className={cn("w-10 h-10 p-0", className)}
            style={{ backgroundColor: color }}
          >
            <span className="sr-only">Pick a color</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Color Picker</h4>
            <div 
              className="border border-gray-200 rounded w-8 h-8" 
              style={{ backgroundColor: localColor }}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2 mt-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  presetColor === "#ffffff" && "border border-gray-200"
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => applyColor(presetColor)}
              >
                {presetColor === localColor && (
                  <Check
                    className={cn(
                      "h-4 w-4",
                      // White check for dark colors, black check for light colors
                      parseInt(presetColor.slice(1), 16) > 0xffffff / 2
                        ? "text-black"
                        : "text-white"
                    )}
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex mt-4">
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="color"
                value={localColor}
                onChange={(e) => setLocalColor(e.target.value)}
                id="color-picker-native"
                className="w-8 h-8 rounded overflow-hidden border-0 bg-transparent p-0 cursor-pointer"
              />
              <label htmlFor="color-picker-native" className="sr-only">
                Pick a color
              </label>
              <input
                type="text"
                value={localColor}
                onChange={handleInputChange}
                className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
            <Button 
              className="ml-2 h-10 px-3" 
              onClick={() => applyColor(localColor)}
              variant="default"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Simple color picker without popover dependency
export function SimpleColorPicker({
  color,
  onChange,
  className,
  presetColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#00ffff", "#ff00ff", "#c0c0c0", "#808080"
  ],
}: Omit<ColorPickerProps, 'children'>) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <div 
          className="border rounded w-8 h-8" 
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 border rounded text-sm"
          placeholder="#000000"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8"
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: presetColor }}
            onClick={() => onChange(presetColor)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}