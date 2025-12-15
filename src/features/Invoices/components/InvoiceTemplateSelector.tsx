// src/components/invoices/InvoiceTemplateSelector.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@features/UI/components/ui/radio-group';
import { Label } from '@features/UI/components/ui/label';
import { Eye, Plus, Check } from 'lucide-react';
import { useToast } from '@features/UI/components/ui/toast/useToast';
import { InvoiceTemplate } from '../types/invoice-templates';

interface InvoiceTemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export const InvoiceTemplateSelector: React.FC<InvoiceTemplateSelectorProps> = ({
  selectedTemplateId,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // For now, simulate API call
        const response = await fetch('/api/invoice-templates');
        if (!response.ok) {
          throw new Error('Failed to load templates');
        }
        const data = await response.json();
        setTemplates(data);
        
        // If no template is selected yet, select the default
        if (!selectedTemplateId && data.length > 0) {
          const defaultTemplate = data.find((t: InvoiceTemplate) => t.isDefault) || data[0];
          onSelect(defaultTemplate.id);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        addToast({
          title: 'Error',
          description: 'Failed to load invoice templates',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [selectedTemplateId, onSelect, addToast]);
  
  // Create a new template
  const handleCreateTemplate = () => {
    navigate('/invoices/templates/new');
  };
  
  // Preview a template
  const handlePreviewTemplate = (templateId: string) => {
    navigate(`/invoices/templates/${templateId}`);
  };
  
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading templates...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoice Template</h3>
        <Button variant="outline" onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Template
        </Button>
      </div>
      
      {templates.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-gray-500 mb-4">No templates available.</p>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      ) : (
        <RadioGroup value={selectedTemplateId} onValueChange={onSelect} className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="flex items-start space-x-2">
              <RadioGroupItem
                value={template.id}
                id={`template-${template.id}`}
                className="mt-1"
              />
              <div className="flex-1">
                <Card className={`overflow-hidden ${selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label
                          htmlFor={`template-${template.id}`}
                          className="font-bold text-lg cursor-pointer"
                        >
                          {template.name}
                        </Label>
                        {template.isDefault && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Layout:</span>{' '}
                          {template.layout.charAt(0).toUpperCase() + template.layout.slice(1)}
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span>{' '}
                          {new Date(template.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-24 bg-gray-100 p-2 overflow-hidden relative">
                      {/* Mini preview */}
                      <div className="transform scale-[0.15] origin-top-left absolute top-0 left-0 w-[600px]">
                        <div 
                          className="p-4 border" 
                          style={{ 
                            backgroundColor: template.colors.secondary,
                            fontFamily: template.fonts.bodyFont
                          }}
                        >
                          <div className="flex justify-between">
                            <div>
                              <h1 style={{ color: template.colors.primary }} className="text-lg font-bold">
                                {template.companyName}
                              </h1>
                            </div>
                            <div>
                              <h1 style={{ color: template.colors.primary }} className="text-lg font-bold">
                                {template.headerTitle}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePreviewTemplate(template.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default InvoiceTemplateSelector;