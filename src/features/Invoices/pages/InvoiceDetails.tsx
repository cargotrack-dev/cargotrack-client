// src/pages/invoice/InvoiceDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <h1>Invoice Details</h1>
      <p>Viewing invoice ID: {id}</p>
      {/* Add actual invoice details display */}
    </div>
  );
};