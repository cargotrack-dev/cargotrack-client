// src/components/invoices/InvoiceTemplateEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Import proper types for the invoice template
import { InvoiceTemplate, TemplateSection, createDefaultTemplate } from '../types/invoice-templates';
import { Invoice } from '../types/invoice';
// UI components
import { Card, CardContent, CardHeader, CardTitle } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Textarea } from '@features/UI/components/ui/textarea';
import { Label } from '@features/UI/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@features/UI/components/ui/tabs';
import { Switch } from '@features/UI/components/ui/switch';
import { Alert, AlertDescription } from '@features/UI/components/ui/alert';
// Icons
import {
  Save,
  FileText,
  Trash2,
  Eye,
  Copy,
  Move,
  ArrowLeft,
  Layout,
  Download,
  Upload,
  Image,
  Palette
} from 'lucide-react';
// Services and utilities
import { useToast } from '@features/UI/components/ui/toast/useToast';
import InvoiceTemplateService from '../services/InvoiceTemplateService';

// Mock for PDF generator
const InvoicePdfGenerator = {
  generatePdf: async (invoice: Invoice, templateId: string): Promise<Blob> => {
    console.log(`Generating PDF for invoice with template ID: ${templateId}`);
    // Use the invoice parameter to avoid the unused warning
    console.log(`Invoice number: ${invoice.invoiceNumber}`);
    return new Blob(['PDF data'], { type: 'application/pdf' });
  }
};

// Type for form event handlers
type FormInputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

// Section item component props
interface SectionItemProps {
  section: TemplateSection;
  onToggleVisibility: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

// Color picker component props
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
}

// Color picker component
const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Common colors for quick selection
  const commonColors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#6b7280', // gray
    '#000000', // black
  ];

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-2 bg-white border rounded shadow-lg">
          <div className="grid grid-cols-4 gap-1 mb-2">
            {commonColors.map((c) => (
              <div
                key={c}
                className="w-6 h-6 rounded cursor-pointer border"
                style={{ backgroundColor: c }}
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 border px-2 py-1 text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Section item component for arrangement
const SectionItem: React.FC<SectionItemProps> = ({
  section,
  onToggleVisibility,
  onMoveUp,
  onMoveDown
}) => {
  const getSectionLabel = (type: string) => {
    switch (type) {
      case 'header': return 'Logo & Header';
      case 'companyInfo': return 'Company Information';
      case 'clientInfo': return 'Client Information';
      case 'invoiceInfo': return 'Invoice Details';
      case 'items': return 'Invoice Items';
      case 'summary': return 'Summary & Totals';
      case 'notes': return 'Notes & Terms';
      case 'footer': return 'Footer';
      case 'signature': return 'Signature Area';
      case 'qrCode': return 'Payment QR Code';
      default: return type;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded mb-2 bg-white">
      <div className="flex items-center">
        <Move className="h-4 w-4 text-gray-400 mr-2" />
        <span>{getSectionLabel(section.type)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={section.isVisible}
          onCheckedChange={() => onToggleVisibility(section.id)}
        />
        <Button variant="outline" size="sm" onClick={() => onMoveUp(section.id)}>↑</Button>
        <Button variant="outline" size="sm" onClick={() => onMoveDown(section.id)}>↓</Button>
      </div>
    </div>
  );
};

// Main component
export const InvoiceTemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [template, setTemplate] = useState<InvoiceTemplate>(createDefaultTemplate());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load template data when component mounts or ID changes
  const loadTemplate = useCallback(() => {
    setIsLoading(true);
    try {
      let loadedTemplate: InvoiceTemplate | undefined;

      if (id && id !== 'new') {
        loadedTemplate = InvoiceTemplateService.getTemplateById(id);
        if (!loadedTemplate) {
          addToast({
            title: 'Error',
            description: 'Template not found',
            variant: 'destructive'
          });
          navigate('/invoices/templates');
          return;
        }
      } else {
        // Create new template based on default
        loadedTemplate = createDefaultTemplate();
      }

      setTemplate(loadedTemplate);
    } catch (error) {
      console.error('Error loading template:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load template',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, addToast]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  // In the addToast calls, use the type directly:
  addToast({
    title: 'Error',
    description: 'Template not found',
    variant: 'destructive'
  } as const);

  // Handle basic form input changes
  const handleChange = (e: FormInputEvent) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle toggle/switch changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setTemplate(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle section style changes with proper type handling
  const handleSectionStyleChange = (sectionId: string, styleProp: string, value: string | number | boolean) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          // Convert non-string values to strings to satisfy the type constraint
          return {
            ...section,
            style: {
              ...section.style,
              [styleProp]: String(value) // Convert to string to match Record<string, string>
            }
          };
        }
        return section;
      })
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (object: string, property: string, value: string | number | boolean) => {
    // For sections, use the dedicated handler to avoid type errors
    if (object === 'sections') {
      const parts = property.split('.');
      if (parts.length >= 3) {
        const sectionId = parts[0];
        const styleProp = parts[2];
        handleSectionStyleChange(sectionId, styleProp, value);
        return;
      }
    }

    // Handle each known nested object type explicitly
    setTemplate(prev => {
      if (object === 'margins') {
        return {
          ...prev,
          margins: {
            ...prev.margins,
            [property]: value
          }
        };
      }

      if (object === 'fonts') {
        return {
          ...prev,
          fonts: {
            ...prev.fonts,
            [property]: value
          }
        };
      }

      if (object === 'colors') {
        return {
          ...prev,
          colors: {
            ...prev.colors,
            [property]: value
          }
        };
      }

      // For simple top-level properties
      if (!property.includes('.')) {
        return {
          ...prev,
          [object]: value
        };
      }

      // For other nested properties, use a type-safe approach
      try {
        // Create a deep copy of the previous state
        const updatedTemplate = JSON.parse(JSON.stringify(prev)) as InvoiceTemplate;

        // Create a safe reference to navigate nested object
        type NestedRecord = Record<string, unknown>;
        let targetObj = updatedTemplate as unknown as NestedRecord;

        // If object is a top-level property, navigate to it
        if (object) {
          if (!targetObj[object]) {
            targetObj[object] = {} as NestedRecord;
          }
          targetObj = targetObj[object] as NestedRecord;
        }

        // Handle nested property path
        const propertyPath = property.split('.');

        // Navigate to the parent object of the target property
        for (let i = 0; i < propertyPath.length - 1; i++) {
          const key = propertyPath[i];
          if (!targetObj[key]) {
            targetObj[key] = {} as NestedRecord;
          }
          targetObj = targetObj[key] as NestedRecord;
        }

        // Set the value on the target property
        const targetKey = propertyPath[propertyPath.length - 1];
        targetObj[targetKey] = value;

        return updatedTemplate;
      } catch (error) {
        console.error('Error updating nested property:', error);
        // Return unchanged state if there was an error
        return prev;
      }
    });
  };

  // Handle color changes specifically
  const handleColorChange = (colorKey: string, color: string) => {
    setTemplate(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: color
      }
    }));
  };

  // Handle font changes specifically
  const handleFontChange = (fontKey: string, value: string) => {
    setTemplate(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value
      }
    }));
  };

  // Handle section visibility toggle
  const handleToggleSectionVisibility = (sectionId: string) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section
      )
    }));
  };

  // Handle moving sections up in the order
  const handleMoveSectionUp = (sectionId: string) => {
    const sections = [...template.sections];
    const index = sections.findIndex(s => s.id === sectionId);

    if (index <= 0) return;

    // Swap positions with previous section
    const currentSection = sections[index];
    const prevSection = sections[index - 1];

    sections[index - 1] = { ...currentSection, position: prevSection.position };
    sections[index] = { ...prevSection, position: currentSection.position };

    // Sort by position
    const sortedSections = sections.sort((a, b) => a.position - b.position);

    setTemplate(prev => ({
      ...prev,
      sections: sortedSections
    }));
  };

  // Handle moving sections down in the order
  const handleMoveSectionDown = (sectionId: string) => {
    const sections = [...template.sections];
    const index = sections.findIndex(s => s.id === sectionId);

    if (index === -1 || index >= sections.length - 1) return;

    // Swap positions with next section
    const currentSection = sections[index];
    const nextSection = sections[index + 1];

    sections[index + 1] = { ...currentSection, position: nextSection.position };
    sections[index] = { ...nextSection, position: currentSection.position };

    // Sort by position
    const sortedSections = sections.sort((a, b) => a.position - b.position);

    setTemplate(prev => ({
      ...prev,
      sections: sortedSections
    }));
  };

  // Handle company logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setTemplate(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle saving the template
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsSaving(true);

    try {
      let savedTemplate;

      if (id && id !== 'new') {
        // Update existing template
        savedTemplate = InvoiceTemplateService.updateTemplate(id, template);
        if (!savedTemplate) {
          throw new Error('Failed to update template');
        }

        addToast({
          title: 'Success',
          description: 'Template updated successfully',
          variant: 'default'
        });
      } else {
        // Create new template
        savedTemplate = InvoiceTemplateService.createTemplate(template);

        addToast({
          title: 'Success',
          description: 'Template created successfully',
          variant: 'default'
        });

        // Navigate to the newly created template
        navigate(`/invoices/templates/${savedTemplate.id}`);
      }

      setTemplate(savedTemplate);
    } catch (error) {
      console.error('Error saving template:', error);
      addToast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle template duplication
  const handleDuplicateTemplate = () => {
    if (!id || id === 'new') return;

    try {
      const duplicatedTemplate = InvoiceTemplateService.duplicateTemplate(id);

      if (duplicatedTemplate) {
        addToast({
          title: 'Success',
          description: 'Template duplicated successfully',
          variant: 'default'
        });

        navigate(`/invoices/templates/${duplicatedTemplate.id}`);
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      addToast({
        title: 'Error',
        description: 'Failed to duplicate template',
        variant: 'destructive'
      });
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = () => {
    if (!id || id === 'new') return;

    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const deleted = InvoiceTemplateService.deleteTemplate(id);

        if (deleted) {
          addToast({
            title: 'Success',
            description: 'Template deleted successfully',
            variant: 'default'
          });

          navigate('/invoices/templates');
        } else {
          addToast({
            title: 'Error',
            description: 'Cannot delete the only template',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        addToast({
          title: 'Error',
          description: 'Failed to delete template',
          variant: 'destructive'
        });
      }
    }
  };

  // Handle setting template as default
  const handleSetAsDefault = () => {
    if (!id || id === 'new') return;

    try {
      const updatedTemplate = InvoiceTemplateService.updateTemplate(id, {
        ...template,
        isDefault: true
      });

      if (updatedTemplate) {
        setTemplate(updatedTemplate);
        addToast({
          title: 'Success',
          description: 'Template set as default',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error setting default template:', error);
      addToast({
        title: 'Error',
        description: 'Failed to set template as default',
        variant: 'destructive'
      });
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(prev => !prev);

    // If entering preview mode, generate a PDF preview
    if (!previewMode) {
      generatePdfPreview();
    }
  };

  // Generate PDF preview for the template
  const generatePdfPreview = async () => {
    try {
      // Create a sample invoice for preview
      const sampleInvoice: Partial<Invoice> = {
        id: 'preview',
        invoiceNumber: 'INV-2025-0001',
        clientName: 'Sample Client',
        clientAddress: '123 Client St, Client City, CC 12345',
        clientEmail: 'client@example.com',
        clientPhone: '(555) 123-4567',
        clientContact: 'Contact Person',
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING' as Invoice['status'], // Type assertion
        items: [
          {
            id: '1',
            description: 'Sample Item 1',
            quantity: 1,
            unitPrice: 100,
            amount: 100,
            taxable: true
          },
          {
            id: '2',
            description: 'Sample Item 2',
            quantity: 2,
            unitPrice: 75,
            amount: 150,
            taxable: true
          }
        ],
        subtotal: 250,
        taxTotal: 20,
        total: 270,
        balance: 270,
        notes: template.defaultNotes,
        terms: template.defaultPaymentTerms,
        currency: 'USD'
      };

      // Generate the PDF blob
      const pdfBlob = await InvoicePdfGenerator.generatePdf(sampleInvoice as Invoice, template.id);

      // Create a URL for the blob
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);

      // Clean up the URL when component unmounts or preview changes
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      addToast({
        title: 'Error',
        description: 'Failed to generate preview',
        variant: 'destructive'
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return <div className="p-6 text-center">Loading template...</div>;
  }

  // Handle preview rendering
  if (previewMode && previewUrl) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Template Preview</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={togglePreview}
            >
              <Layout className="h-4 w-4 mr-2" />
              Edit Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="w-full aspect-[1/1.414] border rounded">
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title="Invoice Template Preview"
          />
        </div>
      </div>
    );
  }

  // Main editor UI
  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate('/invoices/templates')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <h1 className="text-2xl font-bold">
              {id === 'new' ? 'Create New Template' : `Edit Template: ${template.name}`}
            </h1>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={togglePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            {id && id !== 'new' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleDuplicateTemplate}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>

                {!template.isDefault && (
                  <Button
                    variant="outline"
                    onClick={handleSetAsDefault}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Set as Default
                  </Button>
                )}
              </>
            )}

            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={template.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="layout">Layout Style</Label>
                      <select
                        id="layout"
                        name="layout"
                        value={template.layout}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="standard">Standard</option>
                        <option value="modern">Modern</option>
                        <option value="compact">Compact</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={template.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageSize">Page Size</Label>
                      <select
                        id="pageSize"
                        name="pageSize"
                        value={template.pageSize}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orientation">Orientation</Label>
                      <select
                        id="orientation"
                        name="orientation"
                        value={template.orientation}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="headerTitle">Header Title</Label>
                      <Input
                        id="headerTitle"
                        name="headerTitle"
                        value={template.headerTitle}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headerSubtitle">Header Subtitle</Label>
                      <Input
                        id="headerSubtitle"
                        name="headerSubtitle"
                        value={template.headerSubtitle}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Margins (mm)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="marginTop" className="text-xs">Top</Label>
                        <Input
                          id="marginTop"
                          type="number"
                          min="0"
                          value={template.margins.top}
                          onChange={(e) => handleNestedChange('margins', 'top', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="marginRight" className="text-xs">Right</Label>
                        <Input
                          id="marginRight"
                          type="number"
                          min="0"
                          value={template.margins.right}
                          onChange={(e) => handleNestedChange('margins', 'right', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="marginBottom" className="text-xs">Bottom</Label>
                        <Input
                          id="marginBottom"
                          type="number"
                          min="0"
                          value={template.margins.bottom}
                          onChange={(e) => handleNestedChange('margins', 'bottom', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="marginLeft" className="text-xs">Left</Label>
                        <Input
                          id="marginLeft"
                          type="number"
                          min="0"
                          value={template.margins.left}
                          onChange={(e) => handleNestedChange('margins', 'left', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Section Arrangement</h3>
                    <p className="text-sm text-gray-500">Arrange sections in your invoice by changing their order or toggling visibility.</p>

                    <div className="space-y-2">
                      {template.sections.sort((a, b) => a.position - b.position).map((section) => (
                        <SectionItem
                          key={section.id}
                          section={section}
                          onToggleVisibility={handleToggleSectionVisibility}
                          onMoveUp={handleMoveSectionUp}
                          onMoveDown={handleMoveSectionDown}
                        />
                      ))}
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200 mt-4">
                    <div className="flex items-center">
                      <div className="text-blue-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                      </div>
                      <AlertDescription>
                        Changes to layout will affect how your invoice is displayed in the PDF. Make sure important sections like invoice items and summary remain visible.
                      </AlertDescription>
                    </div>
                  </Alert>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Section Spacing</h3>
                    <p className="text-sm text-gray-500">Adjust spacing between sections for better layout.</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="headerSpacing">Header Spacing</Label>
                        <div className="flex items-center">
                          <Input
                            id="headerSpacing"
                            type="range"
                            min="0"
                            max="30"
                            className="flex-1"
                            value={
                              template.sections.find(s => s.id === 'header')?.style?.marginBottom?.replace('mm', '') || '10'
                            }
                            onChange={(e) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'header');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  style: {
                                    ...sections[index].style,
                                    marginBottom: `${e.target.value}mm`
                                  }
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <span className="ml-2 w-10 text-center">
                            {template.sections.find(s => s.id === 'header')?.style?.marginBottom?.replace('mm', '') || '10'}mm
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="itemsSpacing">Items Spacing</Label>
                        <div className="flex items-center">
                          <Input
                            id="itemsSpacing"
                            type="range"
                            min="0"
                            max="20"
                            className="flex-1"
                            value={
                              template.sections.find(s => s.id === 'items')?.style?.cellPadding?.replace('mm', '') || '5'
                            }
                            onChange={(e) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'items');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  style: {
                                    ...sections[index].style,
                                    cellPadding: `${e.target.value}mm`
                                  }
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <span className="ml-2 w-10 text-center">
                            {template.sections.find(s => s.id === 'items')?.style?.cellPadding?.replace('mm', '') || '5'}mm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Section Visibility Quick Options</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="compactMode"
                            checked={!template.sections.find(s => s.id === 'notes')?.isVisible}
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'notes');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  isVisible: !checked
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="compactMode">Compact Mode (Hide Notes)</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showSignature"
                            checked={template.sections.find(s => s.id === 'signature')?.isVisible}
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'signature');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  isVisible: checked
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="showSignature">Show Signature Area</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showQRCode"
                            checked={template.sections.find(s => s.id === 'qrCode')?.isVisible}
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'qrCode');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  isVisible: checked
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="showQRCode">Show Payment QR Code</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showFooter"
                            checked={template.sections.find(s => s.id === 'footer')?.isVisible}
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'footer');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  isVisible: checked
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="showFooter">Show Footer</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Company Info Tab */}
                <TabsContent value="company" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company Branding</h3>
                    <p className="text-sm text-gray-500">Customize your company information to display on invoices.</p>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={template.companyName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label>Company Logo</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 flex justify-center items-center flex-col">
                          {template.logoUrl ? (
                            <div className="space-y-4 w-full">
                              <div className="flex justify-center">
                                <img
                                  src={template.logoUrl}
                                  alt="Company Logo"
                                  className="max-h-32 max-w-xs object-contain"
                                />
                              </div>
                              <div className="flex justify-center space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setTemplate(prev => ({ ...prev, logoUrl: '' }))}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Logo
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Image className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500 mb-2">Upload your company logo</p>
                              <div className="flex justify-center">
                                <label className="cursor-pointer">
                                  <Button type="button" variant="outline" size="sm">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Image
                                  </Button>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                  />
                                </label>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Company Address</Label>
                      <Textarea
                        id="companyAddress"
                        name="companyAddress"
                        value={template.companyAddress}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyPhone">Company Phone</Label>
                        <Input
                          id="companyPhone"
                          name="companyPhone"
                          value={template.companyPhone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Company Email</Label>
                        <Input
                          id="companyEmail"
                          name="companyEmail"
                          value={template.companyEmail}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <Input
                        id="companyWebsite"
                        name="companyWebsite"
                        value={template.companyWebsite}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-400 mr-2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <div>
                        <p className="text-sm text-yellow-700">
                          These details will appear on all invoices using this template. You can override specific company information in your company settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Design Tab */}
                <TabsContent value="design" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Colors</h3>
                    <p className="text-sm text-gray-500">Customize the colors used in your invoice template.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.colors.primary }}
                          />
                          <Input
                            id="primaryColor"
                            type="text"
                            value={template.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                          />
                          <ColorPicker
                            color={template.colors.primary}
                            onChange={(color) => handleColorChange('primary', color)}
                          >
                            <Button type="button" size="sm" variant="outline">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </ColorPicker>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.colors.secondary }}
                          />
                          <Input
                            id="secondaryColor"
                            type="text"
                            value={template.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                          />
                          <ColorPicker
                            color={template.colors.secondary}
                            onChange={(color) => handleColorChange('secondary', color)}
                          >
                            <Button type="button" size="sm" variant="outline">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </ColorPicker>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.colors.accent }}
                          />
                          <Input
                            id="accentColor"
                            type="text"
                            value={template.colors.accent}
                            onChange={(e) => handleColorChange('accent', e.target.value)}
                          />
                          <ColorPicker
                            color={template.colors.accent}
                            onChange={(color) => handleColorChange('accent', color)}
                          >
                            <Button type="button" size="sm" variant="outline">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </ColorPicker>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.colors.text }}
                          />
                          <Input
                            id="textColor"
                            type="text"
                            value={template.colors.text}
                            onChange={(e) => handleColorChange('text', e.target.value)}
                          />
                          <ColorPicker
                            color={template.colors.text}
                            onChange={(color) => handleColorChange('text', color)}
                          >
                            <Button type="button" size="sm" variant="outline">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </ColorPicker>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="headerBgColor">Header Background</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.colors.headerBackground }}
                          />
                          <Input
                            id="headerBgColor"
                            type="text"
                            value={template.colors.headerBackground}
                            onChange={(e) => handleColorChange('headerBackground', e.target.value)}
                          />
                          <ColorPicker
                            color={template.colors.headerBackground}
                            onChange={(color) => handleColorChange('headerBackground', color)}
                          >
                            <Button type="button" size="sm" variant="outline">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </ColorPicker>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="footerBgColor">Footer Background</Label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: template.colors.footerBackground }}
                          />
                          <Input
                            id="footerBgColor"
                            type="text"
                            value={template.colors.footerBackground}
                            onChange={(e) => handleColorChange('footerBackground', e.target.value)}
                          />
                          <ColorPicker
                            color={template.colors.footerBackground}
                            onChange={(color) => handleColorChange('footerBackground', color)}
                          >
                            <Button type="button" size="sm" variant="outline">
                              <Palette className="h-4 w-4" />
                            </Button>
                          </ColorPicker>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Typography</h3>
                    <p className="text-sm text-gray-500">Select fonts and sizes for your invoice template.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="headingFont">Heading Font</Label>
                        <select
                          id="headingFont"
                          className="w-full p-2 border rounded"
                          value={template.fonts.headingFont}
                          onChange={(e) => handleFontChange('headingFont', e.target.value)}
                        >
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Helvetica, sans-serif">Helvetica</option>
                          <option value="'Times New Roman', serif">Times New Roman</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                          <option value="'Courier New', monospace">Courier New</option>
                          <option value="Tahoma, sans-serif">Tahoma</option>
                          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                          <option value="Impact, sans-serif">Impact</option>
                          <option value="'Roboto', sans-serif">Roboto</option>
                          <option value="'Open Sans', sans-serif">Open Sans</option>
                          <option value="'Inter', sans-serif">Inter</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bodyFont">Body Font</Label>
                        <select
                          id="bodyFont"
                          className="w-full p-2 border rounded"
                          value={template.fonts.bodyFont}
                          onChange={(e) => handleFontChange('bodyFont', e.target.value)}
                        >
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Helvetica, sans-serif">Helvetica</option>
                          <option value="'Times New Roman', serif">Times New Roman</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                          <option value="'Courier New', monospace">Courier New</option>
                          <option value="Tahoma, sans-serif">Tahoma</option>
                          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                          <option value="'Roboto', sans-serif">Roboto</option>
                          <option value="'Open Sans', sans-serif">Open Sans</option>
                          <option value="'Inter', sans-serif">Inter</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="headingSize">Heading Size</Label>
                        <select
                          id="headingSize"
                          className="w-full p-2 border rounded"
                          value={template.fonts.headingSize}
                          onChange={(e) => handleFontChange('headingSize', e.target.value)}
                        >
                          <option value="14px">Small (14px)</option>
                          <option value="16px">Medium (16px)</option>
                          <option value="18px">Large (18px)</option>
                          <option value="20px">Extra Large (20px)</option>
                          <option value="24px">XX Large (24px)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bodySize">Body Size</Label>
                        <select
                          id="bodySize"
                          className="w-full p-2 border rounded"
                          value={template.fonts.bodySize}
                          onChange={(e) => handleFontChange('bodySize', e.target.value)}
                        >
                          <option value="10px">Small (10px)</option>
                          <option value="11px">Medium (11px)</option>
                          <option value="12px">Large (12px)</option>
                          <option value="14px">Extra Large (14px)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 border rounded mt-4">
                      <h4 className="font-medium mb-2" style={{
                        fontFamily: template.fonts.headingFont,
                        fontSize: template.fonts.headingSize,
                        color: template.colors.primary
                      }}>
                        Heading Preview
                      </h4>
                      <p style={{
                        fontFamily: template.fonts.bodyFont,
                        fontSize: template.fonts.bodySize,
                        color: template.colors.text
                      }}>
                        This is how the body text will appear on your invoice template. The font family and size can be adjusted to match your branding requirements.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Design Presets</h3>
                    <p className="text-sm text-gray-500">Apply quick design presets to your template.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto py-4 flex flex-col"
                        onClick={() => {
                          setTemplate(prev => ({
                            ...prev,
                            colors: {
                              primary: '#1a56db',
                              secondary: '#e2e8f0',
                              accent: '#f59e0b',
                              text: '#1f2937',
                              background: '#ffffff',
                              headerBackground: '#f8fafc',
                              footerBackground: '#f8fafc'
                            }
                          }));
                        }}
                      >
                        <div className="w-full h-8 mb-2 rounded overflow-hidden flex">
                          <div className="w-1/2 h-full bg-blue-700"></div>
                          <div className="w-1/2 h-full bg-gray-200"></div>
                        </div>
                        <span>Classic Blue</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto py-4 flex flex-col"
                        onClick={() => {
                          setTemplate(prev => ({
                            ...prev,
                            colors: {
                              primary: '#047857',
                              secondary: '#ecfdf5',
                              accent: '#f59e0b',
                              text: '#1f2937',
                              background: '#ffffff',
                              headerBackground: '#ecfdf5',
                              footerBackground: '#ecfdf5'
                            }
                          }));
                        }}
                      >
                        <div className="w-full h-8 mb-2 rounded overflow-hidden flex">
                          <div className="w-1/2 h-full bg-green-700"></div>
                          <div className="w-1/2 h-full bg-green-50"></div>
                        </div>
                        <span>Emerald Green</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto py-4 flex flex-col"
                        onClick={() => {
                          setTemplate(prev => ({
                            ...prev,
                            colors: {
                              primary: '#7c3aed',
                              secondary: '#f5f3ff',
                              accent: '#ec4899',
                              text: '#1f2937',
                              background: '#ffffff',
                              headerBackground: '#f5f3ff',
                              footerBackground: '#f5f3ff'
                            }
                          }));
                        }}
                      >
                        <div className="w-full h-8 mb-2 rounded overflow-hidden flex">
                          <div className="w-1/2 h-full bg-purple-600"></div>
                          <div className="w-1/2 h-full bg-purple-50"></div>
                        </div>
                        <span>Vibrant Purple</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto py-4 flex flex-col"
                        onClick={() => {
                          setTemplate(prev => ({
                            ...prev,
                            colors: {
                              primary: '#000000',
                              secondary: '#f3f4f6',
                              accent: '#ffffff',
                              text: '#333333',
                              background: '#ffffff',
                              headerBackground: '#ffffff',
                              footerBackground: '#f3f4f6'
                            }
                          }));
                        }}
                      >
                        <div className="w-full h-8 mb-2 rounded overflow-hidden flex">
                          <div className="w-1/2 h-full bg-black"></div>
                          <div className="w-1/2 h-full bg-gray-100"></div>
                        </div>
                        <span>Minimal Black</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Table Style</h3>
                    <p className="text-sm text-gray-500">Customize how the invoice items table appears.</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tableBorderStyle">Table Border Style</Label>
                        <select
                          id="tableBorderStyle"
                          className="w-full p-2 border rounded"
                          value={
                            template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid'
                          }
                          onChange={(e) => {
                            const sections = [...template.sections];
                            const index = sections.findIndex(s => s.id === 'items');
                            if (index !== -1) {
                              sections[index] = {
                                ...sections[index],
                                style: {
                                  ...sections[index].style,
                                  borderStyle: e.target.value
                                }
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections
                              }));
                            }
                          }}
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                          <option value="none">None</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tableStriped">Striped Rows</Label>
                        <div className="flex items-center space-x-2 h-10">
                          <Switch
                            id="tableStriped"
                            checked={
                              template.sections.find(s => s.id === 'items')?.style?.striped === 'true'
                            }
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'items');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  style: {
                                    ...sections[index].style,
                                    striped: checked ? 'true' : 'false'
                                  }
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="tableStriped">Enable alternating row colors</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-full max-w-md mt-4 overflow-hidden border rounded">
                        <table className="min-w-full" style={{
                          borderCollapse: 'collapse',
                          borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid',
                          borderWidth: '1px',
                          borderColor: template.colors.secondary
                        }}>
                          <thead>
                            <tr style={{ backgroundColor: template.colors.primary, color: '#ffffff' }}>
                              <th style={{ padding: '8px', textAlign: 'left', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>Item</th>
                              <th style={{ padding: '8px', textAlign: 'right', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>Qty</th>
                              <th style={{ padding: '8px', textAlign: 'right', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{
                              backgroundColor: template.sections.find(s => s.id === 'items')?.style?.striped === 'true' ? '#ffffff' : template.colors.background
                            }}>
                              <td style={{ padding: '8px', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>Item 1</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>1</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>$100.00</td>
                            </tr>
                            <tr style={{
                              backgroundColor: template.sections.find(s => s.id === 'items')?.style?.striped === 'true' ? template.colors.secondary + '40' : template.colors.background
                            }}>
                              <td style={{ padding: '8px', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>Item 2</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>2</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderWidth: '1px', borderStyle: template.sections.find(s => s.id === 'items')?.style?.borderStyle || 'solid', borderColor: template.colors.secondary }}>$150.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Default Content</h3>
                    <p className="text-sm text-gray-500">Customize the default text that appears on your invoices.</p>

                    <div className="space-y-4 mb-6">
                      <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                      <Textarea
                        id="defaultPaymentTerms"
                        name="defaultPaymentTerms"
                        value={template.defaultPaymentTerms}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g., Payment due within 30 days of receipt"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showPaymentTerms"
                          checked={template.sections.find(s => s.id === 'notes')?.isVisible || false}
                          onCheckedChange={(checked) => {
                            const sections = [...template.sections];
                            const index = sections.findIndex(s => s.id === 'notes');
                            if (index !== -1) {
                              sections[index] = {
                                ...sections[index],
                                isVisible: checked
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections
                              }));
                            }
                          }}
                        />
                        <Label htmlFor="showPaymentTerms">Show Payment Terms Section</Label>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <Label htmlFor="defaultNotes">Default Notes</Label>
                      <Textarea
                        id="defaultNotes"
                        name="defaultNotes"
                        value={template.defaultNotes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g., Thank you for your business!"
                      />
                    </div>

                    <div className="space-y-4 mb-6">
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input
                        id="footerText"
                        name="footerText"
                        value={template.footerText}
                        onChange={handleChange}
                        placeholder="e.g., © 2025 Your Company. All rights reserved."
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showFooter"
                          checked={template.sections.find(s => s.id === 'footer')?.isVisible || false}
                          onCheckedChange={(checked) => {
                            const sections = [...template.sections];
                            const index = sections.findIndex(s => s.id === 'footer');
                            if (index !== -1) {
                              sections[index] = {
                                ...sections[index],
                                isVisible: checked
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections
                              }));
                            }
                          }}
                        />
                        <Label htmlFor="showFooter">Show Footer</Label>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <Label htmlFor="signatureLabel">Signature Label</Label>
                      <Input
                        id="signatureLabel"
                        name="signatureLabel"
                        value={template.signatureLabel}
                        onChange={handleChange}
                        placeholder="e.g., Authorized Signature"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showSignature"
                          checked={template.sections.find(s => s.id === 'signature')?.isVisible || false}
                          onCheckedChange={(checked) => {
                            const sections = [...template.sections];
                            const index = sections.findIndex(s => s.id === 'signature');
                            if (index !== -1) {
                              sections[index] = {
                                ...sections[index],
                                isVisible: checked
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections
                              }));
                            }
                          }}
                        />
                        <Label htmlFor="showSignature">Show Signature Area</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Additional Features</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showQRCode"
                            checked={template.sections.find(s => s.id === 'qrCode')?.isVisible || false}
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'qrCode');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  isVisible: checked
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <div>
                            <Label htmlFor="showQRCode">Show Payment QR Code</Label>
                            <p className="text-xs text-gray-500">Displays a QR code for easier digital payments</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showDetailedTaxes"
                            checked={
                              template.sections.find(s => s.id === 'summary')?.style?.detailedTaxes === 'true'
                            }
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'summary');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  style: {
                                    ...sections[index].style,
                                    detailedTaxes: checked ? 'true' : 'false'
                                  }
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <div>
                            <Label htmlFor="showDetailedTaxes">Show Detailed Tax Breakdown</Label>
                            <p className="text-xs text-gray-500">Displays each tax item separately in the summary</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showPaymentMethods"
                            checked={
                              template.sections.find(s => s.id === 'summary')?.style?.showPaymentMethods === 'true'
                            }
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'summary');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  style: {
                                    ...sections[index].style,
                                    showPaymentMethods: checked ? 'true' : 'false'
                                  }
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <div>
                            <Label htmlFor="showPaymentMethods">Show Payment Methods</Label>
                            <p className="text-xs text-gray-500">Displays accepted payment methods on the invoice</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="showPaymentHistory"
                            checked={
                              template.sections.find(s => s.id === 'summary')?.style?.showPaymentHistory === 'true'
                            }
                            onCheckedChange={(checked) => {
                              const sections = [...template.sections];
                              const index = sections.findIndex(s => s.id === 'summary');
                              if (index !== -1) {
                                sections[index] = {
                                  ...sections[index],
                                  style: {
                                    ...sections[index].style,
                                    showPaymentHistory: checked ? 'true' : 'false'
                                  }
                                };
                                setTemplate(prev => ({
                                  ...prev,
                                  sections
                                }));
                              }
                            }}
                          />
                          <div>
                            <Label htmlFor="showPaymentHistory">Show Payment History</Label>
                            <p className="text-xs text-gray-500">Lists all payments received for the invoice</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Invoice Numbering Format</h3>
                    <p className="text-sm text-gray-500">Set the default invoice number format. Use # for numbers, YYYY for year, MM for month, etc.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                        <Input
                          id="invoicePrefix"
                          name="invoicePrefix"
                          placeholder="e.g., INV-YYYY-"
                          value={template.sections.find(s => s.id === 'invoiceInfo')?.style?.numberFormat?.split('#')[0] || 'INV-'}
                          onChange={(e) => {
                            const sections = [...template.sections];
                            const index = sections.findIndex(s => s.id === 'invoiceInfo');
                            if (index !== -1) {
                              const currentFormat = sections[index]?.style?.numberFormat || 'INV-####';
                              const numberPart = currentFormat.split('#').pop() || '';
                              sections[index] = {
                                ...sections[index],
                                style: {
                                  ...sections[index].style,
                                  numberFormat: `${e.target.value}####${numberPart}`
                                }
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections
                              }));
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="invoiceDigits">Number of Digits</Label>
                        <select
                          id="invoiceDigits"
                          className="w-full p-2 border rounded"
                          value={
                            (template.sections.find(s => s.id === 'invoiceInfo')?.style?.numberFormat?.match(/#/g) || []).length
                          }
                          onChange={(e) => {
                            const sections = [...template.sections];
                            const index = sections.findIndex(s => s.id === 'invoiceInfo');
                            if (index !== -1) {
                              const prefix = sections[index]?.style?.numberFormat?.split('#')[0] || 'INV-';
                              const digits = parseInt(e.target.value);
                              const hashes = Array(digits).fill('#').join('');
                              sections[index] = {
                                ...sections[index],
                                style: {
                                  ...sections[index].style,
                                  numberFormat: `${prefix}${hashes}`
                                }
                              };
                              setTemplate(prev => ({
                                ...prev,
                                sections
                              }));
                            }
                          }}
                        >
                          <option value="3">3 digits (e.g., 001)</option>
                          <option value="4">4 digits (e.g., 0001)</option>
                          <option value="5">5 digits (e.g., 00001)</option>
                          <option value="6">6 digits (e.g., 000001)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-2 p-3 bg-gray-50 border rounded-md">
                      <p className="text-sm text-gray-600">
                        Preview: {
                          `${template.sections.find(s => s.id === 'invoiceInfo')?.style?.numberFormat?.split('#')[0] || 'INV-'}${Array(
                            (template.sections.find(s => s.id === 'invoiceInfo')?.style?.numberFormat?.match(/#/g) || []).length
                          ).fill('0').join('').slice(-((template.sections.find(s => s.id === 'invoiceInfo')?.style?.numberFormat?.match(/#/g) || []).length - 1)) + '1'
                          }`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500 mr-2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-700">
                          The content settings affect the default text displayed on invoices. You can still customize individual invoices during creation.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Custom CSS</h3>
                    <p className="text-sm text-gray-500">
                      Advanced users can add custom CSS rules to further customize the PDF output.
                      Enter valid JSON with CSS properties for specific elements.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="customCss">Custom CSS (JSON format)</Label>
                      <Textarea
                        id="customCss"
                        name="customCss"
                        value={template.customCss}
                        onChange={handleChange}
                        rows={8}
                        placeholder='{
  "invoiceTable": { "borderColor": "#e5e7eb" },
  "header": { "marginBottom": "2rem" },
  "summary": { "fontWeight": "bold" }
}'
                      />
                      <p className="text-xs text-gray-500">
                        Custom CSS should be entered as a valid JSON object with CSS properties.
                        This is for advanced users familiar with CSS styling.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Default Status</h3>
                    <p className="text-sm text-gray-500">
                      Set the default status for new invoices created with this template.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="defaultStatus">Default Invoice Status</Label>
                      <select
                        id="defaultStatus"
                        className="w-full p-2 border rounded"
                        value={template.sections.find(s => s.id === 'invoiceInfo')?.style?.defaultStatus || 'DRAFT'}
                        onChange={(e) => {
                          const sections = [...template.sections];
                          const index = sections.findIndex(s => s.id === 'invoiceInfo');
                          if (index !== -1) {
                            sections[index] = {
                              ...sections[index],
                              style: {
                                ...sections[index].style,
                                defaultStatus: e.target.value
                              }
                            };
                            setTemplate(prev => ({
                              ...prev,
                              sections
                            }));
                          }
                        }}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PENDING">Pending</option>
                        <option value="SENT">Sent</option>
                        <option value="PAID">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Template Settings</h3>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isDefault"
                        checked={template.isDefault}
                        onCheckedChange={(checked) => handleToggleChange('isDefault', checked)}
                      />
                      <div>
                        <Label htmlFor="isDefault">Set as default template</Label>
                        <p className="text-xs text-gray-500">
                          This template will be used as the default for all new invoices.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Export/Import</h3>
                    <p className="text-sm text-gray-500">
                      Export this template configuration or import from a file.
                    </p>

                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Create a blob from the template JSON
                          const templateBlob = new Blob(
                            [JSON.stringify(template, null, 2)],
                            { type: 'application/json' }
                          );

                          // Create a download link and trigger the download
                          const url = URL.createObjectURL(templateBlob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
                          document.body.appendChild(a);
                          a.click();

                          // Clean up
                          setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }, 100);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Template
                      </Button>

                      <label className="cursor-pointer">
                        <Button type="button" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Import Template
                        </Button>
                        <input
                          type="file"
                          accept="application/json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const importedTemplate = JSON.parse(event.target?.result as string);

                                // Validate the template has the necessary properties
                                if (
                                  importedTemplate &&
                                  importedTemplate.name &&
                                  importedTemplate.sections &&
                                  importedTemplate.colors &&
                                  importedTemplate.fonts
                                ) {
                                  // Reset ID and created date if importing as a new template
                                  if (id === 'new') {
                                    importedTemplate.id = '';
                                    importedTemplate.createdAt = new Date().toISOString();
                                  }

                                  importedTemplate.updatedAt = new Date().toISOString();
                                  setTemplate(importedTemplate);

                                  addToast({
                                    title: 'Success',
                                    description: 'Template imported successfully',
                                    variant: 'default'
                                  });
                                } else {
                                  throw new Error('Invalid template format');
                                }
                              } catch (error) {
                                console.error('Error importing template:', error);
                                addToast({
                                  title: 'Error',
                                  description: 'Failed to import template. Invalid format.',
                                  variant: 'destructive'
                                });
                              }
                            };

                            reader.readAsText(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-500 mr-2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <div>
                        <p className="text-sm text-yellow-700">
                          The advanced settings are for experienced users. Incorrect settings may affect the PDF output quality.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteTemplate}
                  disabled={!id || id === 'new'}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Template
                </Button>

                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/invoices/templates')}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Template'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceTemplateEditor;