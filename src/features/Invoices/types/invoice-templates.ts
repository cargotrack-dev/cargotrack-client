// src/types/invoice-templates.ts

// Template section definition - determines what sections appear on the invoice and their order
export interface TemplateSection {
    id: string;
    type: 'header' | 'companyInfo' | 'clientInfo' | 'invoiceInfo' | 'items' | 'summary' | 'notes' | 'footer' | 'signature' | 'qrCode';
    position: number;
    isVisible: boolean;
    style?: Record<string, string>;
  }
  
  // Color scheme for the template
  export interface TemplateColor {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    headerBackground: string;
    footerBackground: string;
  }
  
  // Typography settings for the template
  export interface TemplateFont {
    headingFont: string;
    bodyFont: string;
    headingSize: string;
    bodySize: string;
  }
  
  // Main template interface that combines both approaches
  export interface InvoiceTemplate {
    // Core properties
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    isDefault: boolean;
    
    // Structural organization
    sections: TemplateSection[];
    colors: TemplateColor;
    fonts: TemplateFont;
    pageSize: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    
    // Company branding elements
    logoUrl: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;
    
    // Header customization
    headerTitle: string;
    headerSubtitle: string;
    
    // Layout style
    layout: 'standard' | 'modern' | 'compact';
    
    // Content options
    defaultPaymentTerms: string;
    defaultNotes: string;
    
    // Footer text
    footerText: string;
    
    // Signature area
    signatureLabel: string;
    
    // Custom styling
    customCss: string;
  }
  
  // Create a default template with sensible defaults
  export const createDefaultTemplate = (): InvoiceTemplate => ({
    id: '',
    name: 'New Template',
    description: 'A customizable invoice template',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    
    // Default sections configuration
    sections: [
      { id: 'header', type: 'header', position: 1, isVisible: true },
      { id: 'companyInfo', type: 'companyInfo', position: 2, isVisible: true },
      { id: 'clientInfo', type: 'clientInfo', position: 3, isVisible: true },
      { id: 'invoiceInfo', type: 'invoiceInfo', position: 4, isVisible: true },
      { id: 'items', type: 'items', position: 5, isVisible: true },
      { id: 'summary', type: 'summary', position: 6, isVisible: true },
      { id: 'notes', type: 'notes', position: 7, isVisible: true },
      { id: 'signature', type: 'signature', position: 8, isVisible: true },
      { id: 'qrCode', type: 'qrCode', position: 9, isVisible: false },
      { id: 'footer', type: 'footer', position: 10, isVisible: true }
    ],
    
    // Default colors
    colors: {
      primary: '#3b82f6',  // Blue
      secondary: '#f3f4f6', // Light gray
      accent: '#f59e0b',    // Amber
      text: '#1f2937',      // Dark gray
      background: '#ffffff', // White
      headerBackground: '#ffffff',
      footerBackground: '#f8fafc'
    },
    
    // Default fonts
    fonts: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingSize: '18px',
      bodySize: '12px'
    },
    
    // Default page settings
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    },
    
    // Company info placeholders
    logoUrl: '',
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street, City, Country',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'billing@yourcompany.com',
    companyWebsite: 'www.yourcompany.com',
    
    // Header text
    headerTitle: 'INVOICE',
    headerSubtitle: 'For services rendered',
    
    // Layout style
    layout: 'standard',
    
    // Default content
    defaultPaymentTerms: 'Payment due within 30 days of receipt. Late payments subject to a 2% monthly fee.',
    defaultNotes: 'Thank you for your business!',
    
    // Footer text
    footerText: '© 2025 Your Company Name. All rights reserved.',
    
    // Signature label
    signatureLabel: 'Authorized Signature',
    
    // No custom CSS by default
    customCss: '{}'
  });
  
  // Predefined template collection with different styles
  export const DEFAULT_TEMPLATES: InvoiceTemplate[] = [
    {
      ...createDefaultTemplate(),
      id: 'classic',
      name: 'Classic',
      description: 'A professional, clean design with minimal styling',
      isDefault: true,
      colors: {
        primary: '#1a56db',
        secondary: '#e2e8f0',
        accent: '#f59e0b',
        text: '#1f2937',
        background: '#ffffff',
        headerBackground: '#f8fafc',
        footerBackground: '#f8fafc'
      },
      fonts: {
        headingFont: 'Arial, sans-serif',
        bodyFont: 'Arial, sans-serif',
        headingSize: '18px',
        bodySize: '12px'
      },
      layout: 'standard'
    },
    {
      ...createDefaultTemplate(),
      id: 'modern',
      name: 'Modern',
      description: 'A sleek, modern design with bold colors',
      isDefault: false,
      colors: {
        primary: '#6366f1',
        secondary: '#c7d2fe',
        accent: '#ef4444',
        text: '#111827',
        background: '#ffffff',
        headerBackground: '#6366f1',
        footerBackground: '#c7d2fe'
      },
      fonts: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: '20px',
        bodySize: '12px'
      },
      layout: 'modern'
    },
    {
      ...createDefaultTemplate(),
      id: 'minimal',
      name: 'Minimal',
      description: 'A minimalist design focusing on essential information',
      isDefault: false,
      colors: {
        primary: '#000000',
        secondary: '#f3f4f6',
        accent: '#ffffff',
        text: '#333333',
        background: '#ffffff',
        headerBackground: '#ffffff',
        footerBackground: '#f3f4f6'
      },
      fonts: {
        headingFont: 'Roboto, sans-serif',
        bodyFont: 'Roboto, sans-serif',
        headingSize: '18px',
        bodySize: '11px'
      },
      sections: [
        { id: 'header', type: 'header', position: 1, isVisible: true },
        { id: 'companyInfo', type: 'companyInfo', position: 2, isVisible: true },
        { id: 'clientInfo', type: 'clientInfo', position: 3, isVisible: true },
        { id: 'invoiceInfo', type: 'invoiceInfo', position: 4, isVisible: true },
        { id: 'items', type: 'items', position: 5, isVisible: true },
        { id: 'summary', type: 'summary', position: 6, isVisible: true },
        { id: 'notes', type: 'notes', position: 7, isVisible: false },
        { id: 'signature', type: 'signature', position: 8, isVisible: false },
        { id: 'qrCode', type: 'qrCode', position: 9, isVisible: false },
        { id: 'footer', type: 'footer', position: 10, isVisible: true }
      ],
      layout: 'compact'
    }
  ];