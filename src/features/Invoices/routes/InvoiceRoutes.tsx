// src/routes/InvoiceRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { InvoiceProvider } from '../contexts/provider';
import { InvoiceDashboard } from '../components/InvoiceDashboard';
import { InvoiceDetail } from '../components/InvoiceDetail';
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoicePayment } from '../components/InvoicePayment';
import { GenerateFromWaybill } from '../components/GenerateFromWaybill';

export const InvoiceRoutes: React.FC = () => {
  return (
    <InvoiceProvider>
      <Routes>
        <Route path="/" element={<InvoiceDashboard />} />
        <Route path="/:id" element={<InvoiceDetail />} />
        <Route path="/new" element={<InvoiceForm />} />
        <Route path="/edit/:id" element={<InvoiceForm />} />
        <Route path="/:id/payment" element={<InvoicePayment />} />
        <Route path="/generate-from-waybill" element={<GenerateFromWaybill />} />
      </Routes>
    </InvoiceProvider>
  );
};