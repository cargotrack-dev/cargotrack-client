// src/features/Settings/components/CustomGrid.tsx
import React from 'react';
import { 
  Grid as MuiGrid,
  SxProps,
  Theme
} from '@mui/material';

// Create a properly typed wrapper for MUI Grid component to handle the 'item' prop correctly
interface CustomGridProps {
  item?: boolean;
  container?: boolean;
  spacing?: number;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  key?: React.Key;
}

/**
 * Custom Grid component that properly handles the MUI Grid props
 * This solves the TypeScript errors with the 'item' prop
 */
export const CustomGrid: React.FC<CustomGridProps> = (props) => {
  // Pass all props directly to MuiGrid
  return <MuiGrid {...props} />;
};

export default CustomGrid;