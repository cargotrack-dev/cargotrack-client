// src/types/document.ts
export interface Document {
    id: string;
    type: string;
    reference: string;
    shipmentId: string;
    fileUrl: string;
    createdAt: Date;
    createdBy: string;
    status: string;
  }