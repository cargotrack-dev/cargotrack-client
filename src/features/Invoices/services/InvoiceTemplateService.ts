// src/features/Invoices/services/InvoiceTemplateService.ts
import { InvoiceTemplate, DEFAULT_TEMPLATES, createDefaultTemplate } from '../types/invoice-templates';

export class InvoiceTemplateService {
  private static instance: InvoiceTemplateService;
  private templates: InvoiceTemplate[] = [];
  private storageKey = 'cargotrack_invoice_templates';
  private apiEndpoint = '/api/invoice-templates'; // For future server integration

  private constructor() {
    this.loadTemplates();
  }

  public static getInstance(): InvoiceTemplateService {
    if (!InvoiceTemplateService.instance) {
      InvoiceTemplateService.instance = new InvoiceTemplateService();
    }
    return InvoiceTemplateService.instance;
  }

  private loadTemplates(): void {
    try {
      const storedTemplates = localStorage.getItem(this.storageKey);
      if (storedTemplates) {
        this.templates = JSON.parse(storedTemplates);
      } else {
        // Initialize with default templates if none exist
        this.templates = [...DEFAULT_TEMPLATES];
        this.saveTemplates();
      }
    } catch (error) {
      console.error('Error loading invoice templates:', error);
      this.templates = [...DEFAULT_TEMPLATES];
    }
  }

  private saveTemplates(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
    } catch (error) {
      console.error('Error saving invoice templates:', error);
    }
  }

  public getAllTemplates(): InvoiceTemplate[] {
    return [...this.templates];
  }

  public getTemplateById(id: string): InvoiceTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  public getDefaultTemplate(): InvoiceTemplate {
    const defaultTemplate = this.templates.find(template => template.isDefault);
    return defaultTemplate || this.templates[0];
  }

  public createTemplate(templateData: Partial<InvoiceTemplate>): InvoiceTemplate {
    const baseTemplate = createDefaultTemplate();
    const newTemplate: InvoiceTemplate = {
      ...baseTemplate,
      ...templateData,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If marked as default, update other templates
    if (newTemplate.isDefault) {
      this.templates = this.templates.map(t => ({
        ...t,
        isDefault: false
      }));
    }

    this.templates.push(newTemplate);
    this.saveTemplates();
    return newTemplate;
  }

  public updateTemplate(id: string, templateData: Partial<InvoiceTemplate>): InvoiceTemplate | undefined {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    // Handle default template logic
    if (templateData.isDefault) {
      this.templates = this.templates.map(t => ({
        ...t,
        isDefault: t.id === id
      }));
    }

    const updatedTemplate: InvoiceTemplate = {
      ...this.templates[index],
      ...templateData,
      updatedAt: new Date().toISOString()
    };

    this.templates[index] = updatedTemplate;
    this.saveTemplates();
    return updatedTemplate;
  }

  public deleteTemplate(id: string): boolean {
    const initialLength = this.templates.length;
    const template = this.getTemplateById(id);
    
    // Don't allow deleting if it's the only template
    if (this.templates.length <= 1) {
      return false;
    }

    // Check if it's the default template
    if (template?.isDefault) {
      // Find another template to set as default
      const newDefault = this.templates.find(t => t.id !== id);
      if (newDefault) {
        newDefault.isDefault = true;
      }
    }

    this.templates = this.templates.filter(t => t.id !== id);
    this.saveTemplates();
    return this.templates.length < initialLength;
  }

  public duplicateTemplate(id: string): InvoiceTemplate | undefined {
    const template = this.getTemplateById(id);
    if (!template) return undefined;

    const duplicate: InvoiceTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.push(duplicate);
    this.saveTemplates();
    return duplicate;
  }

  public resetToDefault(): void {
    this.templates = [...DEFAULT_TEMPLATES];
    this.saveTemplates();
  }

  // For future API integration
  public async syncWithServer(): Promise<void> {
    try {
      // In a real implementation, this would send templates to the server
      // and receive any server-side templates
      const response = await fetch(this.apiEndpoint);
      if (response.ok) {
        // Placeholder for future server integration
        // const serverTemplates = await response.json();
        // Implementation would merge local and server templates
      }
    } catch (error) {
      console.error('Error syncing templates with server:', error);
    }
  }
}

export default InvoiceTemplateService.getInstance();