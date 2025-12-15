// src/features/Documents/types/document.ts

/**
 * Document types supported by the system
 */
export type DocumentType = 'WAYBILL' | 'INVOICE' | 'MANIFEST' | 'CUSTOMS' | 'OTHER';

/**
 * Document status in the workflow
 */
export type DocumentStatus = 'DRAFT' | 'UPLOADED' | 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Generic type for document metadata values
 */
export type MetadataValue = string | number | boolean | Date | null;

/**
 * Document interface for documents managed in the system
 */
export interface Document {
  /**
   * Unique identifier for the document
   */
  id: string;
  
  /**
   * Type of document
   */
  type: DocumentType;
  
  /**
   * Reference code for the document (e.g., WB-2023-001)
   */
  reference: string;
  
  /**
   * ID of the shipment this document is associated with
   */
  shipmentId: string;
  
  /**
   * URL to access the document file
   */
  fileUrl: string;
  
  /**
   * Date and time when the document was created
   */
  createdAt: Date;
  
  /**
   * Name of the user who created the document
   */
  createdBy: string;
  
  /**
   * Current status of the document in the workflow
   */
  status: DocumentStatus;
  
  /**
   * Optional metadata for the document (additional fields)
   */
  metadata?: Record<string, MetadataValue>;
}

/**
 * Interface for document template
 */
export interface DocumentTemplate {
  /**
   * Unique identifier for the template
   */
  id: string;
  
  /**
   * Name of the template
   */
  name: string;
  
  /**
   * Description of the template's purpose and content
   */
  description: string;
  
  /**
   * Type of document this template is for
   */
  type: DocumentType;
  
  /**
   * Optional template content or structure
   */
  content?: string;
  
  /**
   * Optional fields or placeholders used in the template
   */
  fields?: string[];
}