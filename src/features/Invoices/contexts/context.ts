// src/contexts/invoice/context.ts
import { createContext } from 'react';
import { InvoiceContextProps } from './types';

export const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);