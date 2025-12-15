// src/features/Invoices/services/InvoicePdfGenerator.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { Invoice } from '../types/invoice';
import { InvoiceTemplate } from '../types/invoice-templates';
import InvoiceTemplateService from './InvoiceTemplateService';
import CompanyService from './CompanyService';

// Define any extensions to TypeScript types
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// AutoTable options interface
interface AutoTableOptions {
  head?: string[][];
  body: string[][];
  startY: number;
  margin?: { left: number };
  tableWidth?: number;
  styles?: {
    font?: string;
    fontSize?: number;
    textColor?: string | number[];
    lineColor?: string | number[];
    lineWidth?: number;
  };
  headStyles?: {
    fillColor?: string | number[];
    textColor?: string | number[];
    fontStyle?: string;
  };
  alternateRowStyles?: {
    fillColor?: string | number[];
  };
  columnStyles?: {
    [key: string]: {
      cellWidth?: string | number;
      halign?: string;
    };
  };
  theme?: string;
  didDrawPage?: () => void;
}

// Define your TaxItem interface if not already defined
interface TaxItem {
  name: string;
  rate: number;
  amount: number;
}

// Define your Payment interface if not already defined
interface Payment {
  date: string;
  method: string;
  reference: string;
  amount: number;
}

// Fixed ExtendedInvoice interface
interface ExtendedInvoice extends Omit<Invoice, 'taxes' | 'payments'> {
  templateId?: string;
  clientTaxId?: string;
  referenceNumber?: string;
  poNumber?: string;
  shipping?: number;
  paidAmount?: number;
  paymentTerms?: string;
  paymentReference?: string;
  taxes?: TaxItem[];
  payments?: Payment[];
  discountTotal: number;
}

// Additional properties for our InvoiceTemplate type
interface ExtendedInvoiceTemplate extends InvoiceTemplate {
  showPageNumbers?: boolean;
  paymentMethods?: string;
  thankYouMessage?: string;
}

/**
 * Service for generating PDF invoices based on templates with performance optimizations
 */
export class InvoicePdfGenerator {
  // Cache for loaded fonts to avoid repeated loading
  private static fontCache = new Map<string, boolean>();
  
  // Cache for converted logos to avoid repeated conversions
  private static logoCache = new Map<string, string>();

  /**
   * Generate a PDF for an invoice with performance optimizations
   * @param invoice The invoice data
   * @param templateId Optional template ID to use
   * @returns PDF as a Blob
   */
  static async generatePdf(invoice: ExtendedInvoice, templateId?: string): Promise<Blob> {
    // Performance tracking
    const startTime = performance.now();
    
    try {
      // Get the template - use the invoice's template if specified, or default template
      const template = templateId
        ? InvoiceTemplateService.getTemplateById(templateId)
        : invoice.templateId
          ? InvoiceTemplateService.getTemplateById(invoice.templateId)
          : InvoiceTemplateService.getDefaultTemplate();

      if (!template) {
        throw new Error(`No template available for invoice generation`);
      }

      // Cast template to extended type
      const extTemplate = template as ExtendedInvoiceTemplate;

      // Initialize PDF document based on template settings
      const doc = new jsPDF({
        orientation: extTemplate.orientation || 'portrait',
        unit: 'mm',
        format: extTemplate.pageSize || 'a4'
      });

      // Preload and cache fonts for better performance
      await this.preloadFonts(doc, extTemplate);

      // Set margins from template
      const margins = {
        top: extTemplate.margins?.top || 10,
        right: extTemplate.margins?.right || 10,
        bottom: extTemplate.margins?.bottom || 10,
        left: extTemplate.margins?.left || 10
      };

      // Calculate available width
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentWidth = pageWidth - margins.left - margins.right;

      // Track the Y position as we add content
      let yPos = margins.top;

      // Apply custom stylesheet if provided
      if (extTemplate.customCss) {
        try {
          const customStyles = JSON.parse(extTemplate.customCss);
          this.applyCustomStyles(doc, customStyles);
        } catch (error) {
          console.warn('Invalid custom CSS in template:', error);
        }
      }

      // Render the sections in order
      const sortedSections = [...extTemplate.sections].sort((a, b) => a.position - b.position);

      for (const section of sortedSections) {
        if (!section.isVisible) continue;

        // Add spacing from previous section if needed
        if (section.style?.marginTop) {
          yPos += parseFloat(section.style.marginTop.replace('mm', ''));
        }

        switch (section.type) {
          case 'header':
            yPos = await this.renderHeader(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'companyInfo':
            yPos = this.renderCompanyInfo(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'clientInfo':
            yPos = this.renderClientInfo(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'invoiceInfo':
            yPos = this.renderInvoiceInfo(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'items':
            yPos = this.renderItems(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'summary':
            yPos = this.renderSummary(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'notes':
            yPos = this.renderNotes(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'signature':
            yPos = this.renderSignature(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
          case 'footer':
            this.renderFooter(doc, invoice, extTemplate, pageHeight, contentWidth, margins);
            break;
          case 'qrCode':
            yPos = this.renderQRCode(doc, invoice, extTemplate, yPos, contentWidth, margins.left);
            break;
        }

        // Add spacing after section if needed
        if (section.style?.marginBottom) {
          yPos += parseFloat(section.style.marginBottom.replace('mm', ''));
        }

        // Check if we need to add a new page
        if (yPos > pageHeight - margins.bottom - 20 &&
          section.type !== sortedSections[sortedSections.length - 1].type) {
          doc.addPage();
          yPos = margins.top;
        }
      }

      // Add page numbers if specified in template
      if (extTemplate.showPageNumbers) {
        // Use type assertion to access getNumberOfPages
        const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 5,
            { align: 'center' }
          );
        }
      }

      // Add metadata to PDF
      doc.setProperties({
        title: `Invoice - ${invoice.invoiceNumber}`,
        subject: `Invoice for ${invoice.clientName}`,
        author: extTemplate.companyName || CompanyService.getCompanyInfo().name,
        keywords: 'invoice, cargotrack',
        creator: 'CargoTrack Pro'
      });

      // Performance logging
      const endTime = performance.now();
      console.log(`PDF generation completed in ${(endTime - startTime).toFixed(2)}ms`);

      // Output the PDF as a blob
      const pdfBlob = doc.output('blob');
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Preload fonts for better performance
   */
  private static async preloadFonts(doc: jsPDF, template: ExtendedInvoiceTemplate): Promise<void> {
    const fontsToLoad = [
      template.fonts.headingFont.split(',')[0].replace(/'/g, '').trim(),
      template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim()
    ];

    for (const font of fontsToLoad) {
      if (!this.fontCache.has(font)) {
        try {
          // Set font to preload it
          doc.setFont(font);
          this.fontCache.set(font, true);
        } catch (error) {
          console.warn(`Failed to load font ${font}, using default`, error);
          this.fontCache.set(font, false);
        }
      }
    }
  }

  /**
   * Convert hex color to RGB with performance optimization
   */
  private static hexToRgb(hex: string): [number, number, number] {
    // Default to black if no color provided
    if (!hex) return [0, 0, 0];

    // Remove the # if it exists
    hex = hex.replace(/^#/, '');

    // Handle shorthand hex (e.g. #FFF)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Convert to RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
  }

  /**
   * Format currency with proper symbol and decimal places
   */
  private static formatCurrency(amount: number, currencyCode = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    });

    return formatter.format(amount);
  }

  /**
   * Apply custom styles defined in the template
   */
  private static applyCustomStyles(doc: jsPDF, styles: Record<string, Record<string, string>>): void {
    // jsPDF doesn't have a built-in way to apply CSS-like styles
    // This is a simplified implementation that applies limited styling
    if (styles.document?.fontFamily) {
      doc.setFont(styles.document.fontFamily);
    }
    if (styles.document?.fontSize) {
      doc.setFontSize(parseInt(styles.document.fontSize));
    }
    if (styles.document?.color) {
      const color = styles.document.color;
      if (color.startsWith('#')) {
        const hex = color.substring(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        doc.setTextColor(r, g, b);
      }
    }
  }

  /**
   * Render the header section of the invoice with logo caching
   */
  private static async renderHeader(
    doc: jsPDF,
    _invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    _width: number,
    left: number
  ): Promise<number> {
    // Set font for header
    doc.setFont(template.fonts.headingFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.setFontSize(parseInt(template.fonts.headingSize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.primary)[0],
      this.hexToRgb(template.colors.primary)[1],
      this.hexToRgb(template.colors.primary)[2]);

    // If there's a logo, add it with caching
    if (template.logoUrl) {
      try {
        let logoDataUrl: string | undefined = this.logoCache.get(template.logoUrl);
        
        if (!logoDataUrl) {
          // Convert logo to data URL and cache it
          const companyLogoDataUrl = await CompanyService.getCompanyLogoAsDataUrl();
          if (companyLogoDataUrl) {
            logoDataUrl = companyLogoDataUrl;
            this.logoCache.set(template.logoUrl, logoDataUrl);
          }
        }

        if (logoDataUrl) {
          // Add the logo image
          doc.addImage(
            logoDataUrl,
            'JPEG',
            left,
            yPos,
            40, // logo width
            20  // logo height
          );

          // Title to the right of logo
          doc.text(
            template.headerTitle || 'INVOICE',
            left + 45,
            yPos + 10
          );

          yPos += 25; // Move down after logo
        } else {
          // Fallback to text-only header
          doc.text(
            template.headerTitle || 'INVOICE',
            left,
            yPos + 10
          );
          yPos += 15;
        }
      } catch (error) {
        console.error('Error adding logo:', error);
        // Fallback to text-only header
        doc.text(
          template.headerTitle || 'INVOICE',
          left,
          yPos + 10
        );
        yPos += 15;
      }
    } else {
      // Text-only header
      doc.text(
        template.headerTitle || 'INVOICE',
        left,
        yPos + 10
      );
      yPos += 15;
    }

    // Add subtitle if present
    if (template.headerSubtitle) {
      doc.setFontSize(parseInt(template.fonts.headingSize.replace('px', '')) - 4);
      doc.text(template.headerSubtitle, left, yPos);
      yPos += 10;
    }

    return yPos;
  }

  /**
   * Render the company information section
   */
  private static renderCompanyInfo(
    doc: jsPDF,
    _invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    _width: number,
    left: number
  ): number {
    // Get company info from template or service
    const companyInfo = CompanyService.getCompanyInfo();

    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Company name
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.text(template.companyName || companyInfo.name, left, yPos);
    yPos += 5;

    // Company address - split by lines with proper typing
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    const addressLines = (template.companyAddress || companyInfo.address).split('\n');
    addressLines.forEach((line: string) => {  // Fixed: explicitly typed line parameter
      doc.text(line.trim(), left, yPos);
      yPos += 5;
    });

    // Add company contact info
    if (template.companyPhone || companyInfo.phone) {
      doc.text(`Phone: ${template.companyPhone || companyInfo.phone}`, left, yPos);
      yPos += 5;
    }

    if (template.companyEmail || companyInfo.email) {
      doc.text(`Email: ${template.companyEmail || companyInfo.email}`, left, yPos);
      yPos += 5;
    }

    if (template.companyWebsite || companyInfo.website) {
      doc.text(`Website: ${template.companyWebsite || companyInfo.website}`, left, yPos);
      yPos += 5;
    }

    // Add tax ID if available
    if (companyInfo.taxId) {
      doc.text(`Tax ID: ${companyInfo.taxId}`, left, yPos);
      yPos += 5;
    }

    // Add spacing after company info
    yPos += 5;

    return yPos;
  }

  /**
   * Render the client information section
   */
  private static renderClientInfo(
    doc: jsPDF,
    invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    _width: number,
    left: number
  ): number {
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Section title
    doc.text('Bill To:', left, yPos);
    yPos += 5;

    // Client name
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.text(invoice.clientName, left, yPos);
    yPos += 5;

    // Client address - split by lines with proper typing
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line: string) => {  // Fixed: explicitly typed line parameter
        doc.text(line.trim(), left, yPos);
        yPos += 5;
      });
    }

    // Client contact info
    if (invoice.clientContact) {
      doc.text(`Contact: ${invoice.clientContact}`, left, yPos);
      yPos += 5;
    }

    if (invoice.clientEmail) {
      doc.text(`Email: ${invoice.clientEmail}`, left, yPos);
      yPos += 5;
    }

    if (invoice.clientPhone) {
      doc.text(`Phone: ${invoice.clientPhone}`, left, yPos);
      yPos += 5;
    }

    // Add client tax ID if available
    if (invoice.clientTaxId) {
      doc.text(`Tax ID: ${invoice.clientTaxId}`, left, yPos);
      yPos += 5;
    }

    // Add spacing
    yPos += 5;

    return yPos;
  }

  /**
   * Render the invoice information section
   */
  private static renderInvoiceInfo(
    doc: jsPDF,
    invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    width: number,
    left: number
  ): number {
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Use the right side of the page for invoice details
    const rightColumnX = left + (width / 2);

    // Invoice number
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.text('Invoice Number:', rightColumnX, yPos);
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.text(invoice.invoiceNumber, rightColumnX + 40, yPos);
    yPos += 6;

    // Issue date
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.text('Issue Date:', rightColumnX, yPos);
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.text(format(new Date(invoice.issueDate), 'MMMM dd, yyyy'), rightColumnX + 40, yPos);
    yPos += 6;

    // Due date
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.text('Due Date:', rightColumnX, yPos);
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.text(format(new Date(invoice.dueDate), 'MMMM dd, yyyy'), rightColumnX + 40, yPos);
    yPos += 6;

    // Status (if available)
    if (invoice.status) {
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text('Status:', rightColumnX, yPos);

      // Color based on status
      let statusColor: [number, number, number];
      switch (invoice.status.toUpperCase()) {
        case 'PAID':
          statusColor = this.hexToRgb('#00A86B'); // Green
          break;
        case 'PENDING':
          statusColor = this.hexToRgb('#FFA500'); // Orange
          break;
        case 'OVERDUE':
          statusColor = this.hexToRgb('#FF0000'); // Red
          break;
        default:
          statusColor = this.hexToRgb(template.colors.text);
      }

      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text(invoice.status.toUpperCase(), rightColumnX + 40, yPos);
      doc.setTextColor(this.hexToRgb(template.colors.text)[0],
        this.hexToRgb(template.colors.text)[1],
        this.hexToRgb(template.colors.text)[2]); // Reset color
      yPos += 6;
    }

    // Reference number (if available)
    if (invoice.referenceNumber) {
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text('Reference:', rightColumnX, yPos);
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
      doc.text(invoice.referenceNumber, rightColumnX + 40, yPos);
      yPos += 6;
    }

    // Purchase order number (if available)
    if (invoice.poNumber) {
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text('PO Number:', rightColumnX, yPos);
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
      doc.text(invoice.poNumber, rightColumnX + 40, yPos);
      yPos += 6;
    }

    return yPos;
  }

  /**
   * Render the invoice items table
   */
  private static renderItems(
    doc: jsPDF,
    invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    width: number,
    left: number
  ): number {
    // Find the correct section style for items
    const itemsSection = template.sections.find(s => s.type === 'items');
    const striped = itemsSection?.style?.striped === 'true';
    const borderStyle = itemsSection?.style?.borderStyle || 'solid';

    // Determine which columns to display based on template settings
    const showItemCode = itemsSection?.style?.showItemCode === 'true';
    const showQuantity = itemsSection?.style?.showQuantity !== 'false'; // Default to true
    const showUnitPrice = itemsSection?.style?.showUnitPrice !== 'false'; // Default to true
    const showDiscount = itemsSection?.style?.showDiscount === 'true';
    const showTax = itemsSection?.style?.showTax === 'true';

    // Set up table headers
    const tableColumn: string[] = [];

    if (showItemCode) tableColumn.push('Item #');
    tableColumn.push('Description');
    if (showQuantity) tableColumn.push('Quantity');
    if (showUnitPrice) tableColumn.push('Unit Price');
    if (showDiscount) tableColumn.push('Discount');
    if (showTax) tableColumn.push('Tax');
    tableColumn.push('Amount');

    // Set up table data
    const tableRows = invoice.items.map(item => {
      const row: string[] = [];

      if (showItemCode) row.push(item.id || '');
      row.push(item.description);
      if (showQuantity) row.push(item.quantity.toString());
      if (showUnitPrice) row.push(this.formatCurrency(item.unitPrice, invoice.currency));

      // For discount and tax, use the properties if they exist on the item
      if (showDiscount) {
        const itemWithDiscount = item as { discount?: number };
        row.push(itemWithDiscount.discount ? `${itemWithDiscount.discount}%` : '0%');
      }
      if (showTax) {
        const itemWithTax = item as { taxRate?: number };
        row.push(itemWithTax.taxRate ? `${itemWithTax.taxRate}%` : '0%');
      }

      row.push(this.formatCurrency(item.amount, invoice.currency));

      return row;
    });

    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      margin: { left: left },
      tableWidth: width,
      styles: {
        font: template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(),
        fontSize: parseInt(template.fonts.bodySize.replace('px', '')),
        textColor: this.hexToRgb(template.colors.text),
        lineColor: this.hexToRgb(template.colors.secondary),
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: this.hexToRgb(template.colors.primary),
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: striped ? {
        fillColor: this.hexToRgb(template.colors.secondary) + '20' // 20% opacity
      } : {},
      columnStyles: this.generateColumnStyles(tableColumn),
      theme: borderStyle === 'none' ? 'plain' : 'grid',
      didDrawPage: () => {
        // If items span multiple pages, this will be called for each page
      }
    });

    // Get the final Y position after the table is rendered
    return doc.lastAutoTable.finalY + 5;
  }

  /**
   * Generate column styles for autotable
   */
  private static generateColumnStyles(columns: string[]): Record<string, Record<string, string | number>> {
    const styles: Record<string, Record<string, string | number>> = {};

    columns.forEach((col, index) => {
      switch (col) {
        case 'Item #':
          styles[index] = { cellWidth: 20 };
          break;
        case 'Description':
          styles[index] = { cellWidth: 'auto' };
          break;
        case 'Quantity':
          styles[index] = { cellWidth: 20, halign: 'right' };
          break;
        case 'Unit Price':
          styles[index] = { cellWidth: 30, halign: 'right' };
          break;
        case 'Discount':
          styles[index] = { cellWidth: 20, halign: 'right' };
          break;
        case 'Tax':
          styles[index] = { cellWidth: 20, halign: 'right' };
          break;
        case 'Amount':
          styles[index] = { cellWidth: 30, halign: 'right' };
          break;
        default:
          styles[index] = { cellWidth: 'auto' };
      }
    });

    return styles;
  }

  /**
   * Render the invoice summary section
   */
  private static renderSummary(
    doc: jsPDF,
    invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    width: number,
    left: number
  ): number {
    // Use the right side for summary
    const summaryX = left + width - 80;

    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Subtotal
    doc.text('Subtotal:', summaryX, yPos);
    doc.text(
      this.formatCurrency(invoice.subtotal, invoice.currency),
      left + width,
      yPos,
      { align: 'right' }
    );
    yPos += 6;

    // Find the summary section style
    const summarySection = template.sections.find(s => s.type === 'summary');
    const showDetailedTaxes = summarySection?.style?.detailedTaxes === 'true';

    // If detailed taxes enabled and we have tax breakdown
    if (showDetailedTaxes && invoice.taxes && invoice.taxes.length > 0) {
      // Show each tax line
      invoice.taxes.forEach(tax => {
        doc.text(`${tax.name} (${tax.rate}%):`, summaryX, yPos);
        doc.text(
          this.formatCurrency(tax.amount, invoice.currency),
          left + width,
          yPos,
          { align: 'right' }
        );
        yPos += 6;
      });
    } else if (invoice.taxTotal && invoice.taxTotal > 0) {
      // Just show total tax
      doc.text('Tax:', summaryX, yPos);
      doc.text(
        this.formatCurrency(invoice.taxTotal, invoice.currency),
        left + width,
        yPos,
        { align: 'right' }
      );
      yPos += 6;
    }

    // Discounts (if applicable)
    if (invoice.discountTotal && invoice.discountTotal > 0) {
      doc.text('Discount:', summaryX, yPos);
      doc.text(
        `-${this.formatCurrency(invoice.discountTotal, invoice.currency)}`,
        left + width,
        yPos,
        { align: 'right' }
      );
      yPos += 6;
    }

    // Shipping (if applicable)
    if (invoice.shipping && invoice.shipping > 0) {
      doc.text('Shipping:', summaryX, yPos);
      doc.text(
        this.formatCurrency(invoice.shipping, invoice.currency),
        left + width,
        yPos,
        { align: 'right' }
      );
      yPos += 6;
    }

    // Total
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.text('Total:', summaryX, yPos);
    doc.text(
      this.formatCurrency(invoice.total, invoice.currency),
      left + width,
      yPos,
      { align: 'right' }
    );
    yPos += 6;

    // Amount paid (if applicable)
    if (invoice.paidAmount && invoice.paidAmount > 0) {
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
      doc.text('Amount Paid:', summaryX, yPos);
      doc.text(
        this.formatCurrency(invoice.paidAmount, invoice.currency),
        left + width,
        yPos,
        { align: 'right' }
      );
      yPos += 6;
    }

    // Balance due
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    const accentColor = this.hexToRgb(template.colors.accent);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('Balance Due:', summaryX, yPos);
    doc.text(
      this.formatCurrency(invoice.balance, invoice.currency),
      left + width,
      yPos,
      { align: 'right' }
    );
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]); // Reset color

    yPos += 10;

    // Payment history if applicable and enabled
    const showPaymentHistory = summarySection?.style?.showPaymentHistory === 'true';
    if (showPaymentHistory && invoice.payments && invoice.payments.length > 0) {
      yPos += 5;
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text('Payment History', left, yPos);
      yPos += 5;

      // Create a payment history table
      const paymentHeaders = ['Date', 'Method', 'Reference', 'Amount'];
      const paymentRows = invoice.payments.map(payment => [
        format(new Date(payment.date), 'MMM dd, yyyy'),
        payment.method || '-',
        payment.reference || '-',
        this.formatCurrency(payment.amount, invoice.currency)
      ]);

      doc.autoTable({
        head: [paymentHeaders],
        body: paymentRows,
        startY: yPos,
        margin: { left: left },
        tableWidth: width,
        styles: {
          font: template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(),
          fontSize: parseInt(template.fonts.bodySize.replace('px', '')) - 1,
          textColor: this.hexToRgb(template.colors.text),
        },
        headStyles: {
          fillColor: this.hexToRgb(template.colors.secondary),
          textColor: this.hexToRgb(template.colors.text),
          fontStyle: 'bold'
        },
        theme: 'plain'
      });

      yPos = doc.lastAutoTable.finalY + 5;
    }

    // Show payment methods if enabled
    const showPaymentMethods = summarySection?.style?.showPaymentMethods === 'true';
    if (showPaymentMethods) {
      yPos += 5;
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text('Payment Methods', left, yPos);
      yPos += 5;

      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
      const paymentMethods = (template as ExtendedInvoiceTemplate).paymentMethods || 'Bank Transfer, Credit Card';

      // Split long payment method text into multiple lines if needed
      const textLines = doc.splitTextToSize(paymentMethods, width / 2);
      textLines.forEach((line: string) => {
        doc.text(line, left, yPos);
        yPos += 5;
      });

      yPos += 5;
    }

    return yPos;
  }

  /**
   * Render the notes section
   */
  private static renderNotes(
    doc: jsPDF,
    invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    width: number,
    left: number
  ): number {
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Notes header
    doc.text('Notes', left, yPos);
    yPos += 5;

    // Reset to normal font
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');

    // Draw a box for the notes with light background
    const notesColor = this.hexToRgb(template.colors.secondary);
    doc.setFillColor(notesColor[0], notesColor[1], notesColor[2], 0.1); // 10% opacity
    doc.rect(left, yPos, width, 20, 'F');

    // Add the notes text
    const notes = invoice.notes || template.defaultNotes;
    if (notes) {
      // Split notes into lines to avoid overflow
      const splitNotes = doc.splitTextToSize(notes, width - 10);
      doc.text(splitNotes, left + 5, yPos + 5);

      // Adjust yPos based on the number of lines
      yPos += Math.max(20, splitNotes.length * 6);
    } else {
      yPos += 20;
    }

    // Payment terms if available
    if (template.defaultPaymentTerms || invoice.paymentTerms) {
      yPos += 5;
      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
      doc.text('Payment Terms', left, yPos);
      yPos += 5;

      doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
      const terms = invoice.paymentTerms || template.defaultPaymentTerms;
      if (terms) {
        const splitTerms = doc.splitTextToSize(terms, width - 10);
        doc.text(splitTerms, left, yPos);

        yPos += splitTerms.length * 6;
      }
    }

    return yPos;
  }

  /**
   * Render the signature area
   */
  private static renderSignature(
    doc: jsPDF,
    _invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    width: number,
    left: number
  ): number {
    // Add some space before signature
    yPos += 15;

    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Draw signature line
    doc.line(left, yPos, left + 70, yPos);

    // Add signature label
    yPos += 5;
    doc.text(template.signatureLabel || 'Authorized Signature', left, yPos);

    // Add date line if enabled
    const signatureSection = template.sections.find(s => s.type === 'signature');
    const showDate = signatureSection?.style?.showDate === 'true';

    if (showDate) {
      // Draw date line
      doc.line(left + width - 70, yPos - 5, left + width, yPos - 5);

      // Add date label
      doc.text('Date', left + width - 70, yPos);
    }

    return yPos + 10;
  }

  /**
   * Render the footer of the document
   */
  private static renderFooter(
    doc: jsPDF,
    _invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    pageHeight: number,
    width: number,
    margins: { top: number; right: number; bottom: number; left: number }
  ): void {
    const footerY = pageHeight - margins.bottom;

    // Set footer styling
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'normal');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')) - 2);
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);

    // Optional footer background
    const footerSection = template.sections.find(s => s.type === 'footer');
    const footerBackground = footerSection?.style?.backgroundColor === 'true';

    if (footerBackground) {
      const bgColor = this.hexToRgb(template.colors.footerBackground || template.colors.secondary);
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2], 0.1); // 10% opacity
      doc.rect(0, footerY - 10, doc.internal.pageSize.width, 20, 'F');
    }

    // Add footer text centered
    if (template.footerText) {
      doc.text(
        template.footerText,
        margins.left + (width / 2),
        footerY,
        { align: 'center' }
      );
    }

    // Add thank you message if specified
    const extTemplate = template as ExtendedInvoiceTemplate;
    if (extTemplate.thankYouMessage) {
      doc.text(
        extTemplate.thankYouMessage,
        margins.left + (width / 2),
        footerY - 7,
        { align: 'center' }
      );
    }
  }

  /**
   * Render a QR code for payment
   */
  private static renderQRCode(
    doc: jsPDF,
    _invoice: ExtendedInvoice,
    template: ExtendedInvoiceTemplate,
    yPos: number,
    width: number,
    left: number
  ): number {
    // Find the QR code section style
    const qrSection = template.sections.find(s => s.type === 'qrCode');
    const qrTitle = qrSection?.style?.title || 'Scan to Pay';
    const qrSize = parseInt(qrSection?.style?.size || '30');

    // QR code positioning
    const qrX = left + width - qrSize - 10;

    // Add QR code title
    doc.setFont(template.fonts.bodyFont.split(',')[0].replace(/'/g, '').trim(), 'bold');
    doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')));
    doc.setTextColor(this.hexToRgb(template.colors.text)[0],
      this.hexToRgb(template.colors.text)[1],
      this.hexToRgb(template.colors.text)[2]);
    doc.text(qrTitle, qrX, yPos);
    yPos += 6;

    try {
      // For now, just draw a placeholder box
      doc.setDrawColor(this.hexToRgb(template.colors.text)[0],
        this.hexToRgb(template.colors.text)[1],
        this.hexToRgb(template.colors.text)[2]);
      doc.rect(qrX, yPos, qrSize, qrSize);

      // Draw a cross in the box to indicate a placeholder
      doc.line(qrX, yPos, qrX + qrSize, yPos + qrSize);
      doc.line(qrX, yPos + qrSize, qrX + qrSize, yPos);

      // Add small print instructions below QR code
      const qrInstructions = qrSection?.style?.instructions || 'Scan this code with your banking app to pay';
      doc.setFontSize(parseInt(template.fonts.bodySize.replace('px', '')) - 2);

      // Calculate text width to center under QR code
      const textWidth = doc.getTextWidth(qrInstructions);
      const centeredX = qrX + (qrSize / 2) - (textWidth / 2);

      doc.text(qrInstructions, centeredX, yPos + qrSize + 5);

      yPos += qrSize + 10;
    } catch (error) {
      console.error('Error generating QR code:', error);

      // Draw a placeholder box if QR generation fails
      doc.setDrawColor(this.hexToRgb(template.colors.text)[0],
        this.hexToRgb(template.colors.text)[1],
        this.hexToRgb(template.colors.text)[2]);
      doc.rect(qrX, yPos, qrSize, qrSize);

      // Draw a cross in the box to indicate a placeholder
      doc.line(qrX, yPos, qrX + qrSize, yPos + qrSize);
      doc.line(qrX, yPos + qrSize, qrX + qrSize, yPos);

      yPos += qrSize + 10;
    }

    return yPos;
  }

  /**
   * Clear caches to free memory
   */
  static clearCaches(): void {
    this.fontCache.clear();
    this.logoCache.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  static getCacheStats(): { 
    fontCacheSize: number; 
    logoCacheSize: number; 
  } {
    return {
      fontCacheSize: this.fontCache.size,
      logoCacheSize: this.logoCache.size
    };
  }
}