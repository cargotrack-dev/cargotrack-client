// src/contexts/invoice/hooks.ts
import { useContext } from 'react';
import { InvoiceContext } from './context';

export function useInvoice() {
  return useContext(InvoiceContext);
}