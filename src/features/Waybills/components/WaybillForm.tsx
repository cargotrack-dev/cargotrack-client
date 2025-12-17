// src/components/waybills/WaybillForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Truck,
  Loader2,
  DollarSign,
  Plus,
  X,
} from 'lucide-react';

// UI Components
import { Input } from '../../UI/components/ui/input';
import { Label } from '../../UI/components/ui/label';
import { Textarea } from '../../UI/components/ui/textarea';
import { Checkbox } from '../../UI/components/ui/checkbox';
import { Button } from '../../UI/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../UI/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';

// Types & Schema
import { WaybillFormData, WaybillFormProps } from '../../Waybills/types/types';
import { Save, Copy } from 'lucide-react';
import { useToast } from '../../UI/components/ui/toast/useToast';
import { Toaster } from '../../UI/components/ui/toast/Toaster';
import { useHotkeys } from 'react-hotkeys-hook';

type NestedRecord = Record<string, unknown | Record<string, unknown>>;

// Constants
const defaultFormData: WaybillFormData = {
  truckId: '',
  clientId: '',
  client: {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
  },
  shipper: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  consignee: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  origin: '',
  destination: '',
  cargo: {
    description: '',
    type: '',
    weight: 0,
    units: 1,
    value: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    hazardous: false,
    hazardClass: '',
    specialInstructions: '',
  },
  pricing: {
    baseRate: 0,
    additionalCharges: [],
    tax: 0,
    total: 0,
    currency: 'USD',
  },
  pickupDate: '',
  estimatedDeliveryDate: '',
  notes: '',
};

// Add a type for form validation errors
interface FormErrors {
  general?: string[];
  truckId?: string;
  clientId?: string;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  estimatedDeliveryDate?: string;
  client?: {
    name?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  shipper?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  consignee?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  cargo?: {
    description?: string;
    type?: string;
    weight?: string;
    units?: string;
    value?: string;
    dimensions?: {
      length?: string;
      width?: string;
      height?: string;
    };
    hazardClass?: string;
  };
  pricing?: {
    baseRate?: string;
    tax?: string;
    currency?: string;
  };
  notes?: string;
}

const WaybillForm: React.FC<WaybillFormProps> = ({
  onSubmit,
  trucks = [],
  clients = [],
  initialData = {} as Partial<WaybillFormData>
}) => {

  const { addToast } = useToast();

  // State management
  const [formData, setFormData] = useState<WaybillFormData>(() => {
    // Create deep copy of default form data
    const initialFormData = { ...defaultFormData };

    // Type-safe merge of initial data
    const mergeTypedData = (
      target: WaybillFormData,
      source: Partial<WaybillFormData>
    ): WaybillFormData => {
      const result = { ...target };

      // Safely merge each section
      if (source.client) {
        result.client = { ...result.client, ...source.client };
      }
      if (source.shipper) {
        result.shipper = { ...result.shipper, ...source.shipper };
      }
      if (source.consignee) {
        result.consignee = { ...result.consignee, ...source.consignee };
      }
      if (source.cargo) {
        result.cargo = {
          ...result.cargo,
          ...source.cargo,
          dimensions: source.cargo.dimensions
            ? { ...result.cargo.dimensions, ...source.cargo.dimensions }
            : result.cargo.dimensions
        };
      }
      if (source.pricing) {
        result.pricing = {
          ...result.pricing,
          ...source.pricing,
          additionalCharges: source.pricing.additionalCharges || []
        };
      }

      // Merge top-level primitive fields
      if (source.truckId !== undefined) result.truckId = source.truckId;
      if (source.clientId !== undefined) result.clientId = source.clientId;
      if (source.origin !== undefined) result.origin = source.origin;
      if (source.destination !== undefined) result.destination = source.destination;
      if (source.pickupDate !== undefined) result.pickupDate = source.pickupDate;
      if (source.estimatedDeliveryDate !== undefined) {
        result.estimatedDeliveryDate = source.estimatedDeliveryDate;
      }
      if (source.notes !== undefined) result.notes = source.notes;

      return result;
    };

    return mergeTypedData(initialFormData, initialData);
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalCharge, setAdditionalCharge] = useState({
    description: '',
    amount: 0
  });
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [validateOnChange, setValidateOnChange] = useState(false);

  // Add the ErrorMessage component
  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-600 text-sm mt-1">{message}</p>
  );

  // Keyboard shortcuts
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handleSaveAsDraft();
    addToast({
      title: "Shortcut Used",
      description: "Waybill saved as draft (Ctrl+S)",
      variant: "default"
    });
  }, [formData]);

  useHotkeys('ctrl+d', (e) => {
    e.preventDefault();
    handleDuplicate();
    addToast({
      title: "Shortcut Used",
      description: "Waybill duplicated (Ctrl+D)",
      variant: "default"
    });
  }, [formData]);

  useHotkeys('ctrl+p', (e) => {
    e.preventDefault();
    setShowPdfPreview(true);
    addToast({
      title: "Shortcut Used",
      description: "PDF preview opened (Ctrl+P)",
      variant: "default"
    });
  }, []);

  useHotkeys('ctrl+alt+t', (e) => {
    e.preventDefault();
    // Jump to next tab
    const tabs = ['general', 'parties', 'cargo', 'pricing', 'additional'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  }, [activeTab]);

  // Add a validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    // General tab validation
    if (!formData.truckId) {
      newErrors.truckId = 'Please select a truck';
      hasErrors = true;
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
      hasErrors = true;
    }

    if (!formData.origin) {
      newErrors.origin = 'Origin is required';
      hasErrors = true;
    }

    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
      hasErrors = true;
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
      hasErrors = true;
    }

    if (!formData.estimatedDeliveryDate) {
      newErrors.estimatedDeliveryDate = 'Estimated delivery date is required';
      hasErrors = true;
    }

    // Validate that delivery date is after pickup date
    if (formData.pickupDate && formData.estimatedDeliveryDate) {
      const pickupDate = new Date(formData.pickupDate);
      const deliveryDate = new Date(formData.estimatedDeliveryDate);

      if (deliveryDate < pickupDate) {
        newErrors.estimatedDeliveryDate = 'Delivery date must be after pickup date';
        hasErrors = true;
      }
    }

    // Parties tab validation
    // Client validation
    if (!formData.client.name) {
      newErrors.client = { ...(newErrors.client || {}), name: 'Client name is required' };
      hasErrors = true;
    }

    if (formData.client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client.email)) {
      newErrors.client = { ...(newErrors.client || {}), email: 'Invalid email format' };
      hasErrors = true;
    }

    if (formData.client.phone && !/^[\d\s+()-]{10,15}$/.test(formData.client.phone)) {
      newErrors.client = { ...(newErrors.client || {}), phone: 'Invalid phone number' };
      hasErrors = true;
    }

    // Shipper validation
    if (!formData.shipper.name) {
      newErrors.shipper = { ...(newErrors.shipper || {}), name: 'Shipper name is required' };
      hasErrors = true;
    }

    if (!formData.shipper.address) {
      newErrors.shipper = { ...(newErrors.shipper || {}), address: 'Shipper address is required' };
      hasErrors = true;
    }

    if (formData.shipper.phone && !/^[\d\s+()-]{10,15}$/.test(formData.shipper.phone)) {
      newErrors.shipper = { ...(newErrors.shipper || {}), phone: 'Invalid phone number' };
      hasErrors = true;
    }

    if (formData.shipper.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.shipper.email)) {
      newErrors.shipper = { ...(newErrors.shipper || {}), email: 'Invalid email format' };
      hasErrors = true;
    }

    // Consignee validation
    if (!formData.consignee.name) {
      newErrors.consignee = { ...(newErrors.consignee || {}), name: 'Consignee name is required' };
      hasErrors = true;
    }

    if (!formData.consignee.address) {
      newErrors.consignee = { ...(newErrors.consignee || {}), address: 'Consignee address is required' };
      hasErrors = true;
    }

    if (formData.consignee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.consignee.email)) {
      newErrors.consignee = { ...(newErrors.consignee || {}), email: 'Invalid email format' };
      hasErrors = true;
    }

    if (formData.consignee.phone && !/^[\d\s+()-]{10,15}$/.test(formData.consignee.phone)) {
      newErrors.consignee = { ...(newErrors.consignee || {}), phone: 'Invalid phone number' };
      hasErrors = true;
    }

    // Cargo tab validation
    if (!formData.cargo.description) {
      newErrors.cargo = { ...(newErrors.cargo || {}), description: 'Cargo description is required' };
      hasErrors = true;
    }

    if (formData.cargo.weight <= 0) {
      newErrors.cargo = { ...(newErrors.cargo || {}), weight: 'Weight must be greater than 0' };
      hasErrors = true;
    }

    if (formData.cargo.units <= 0) {
      newErrors.cargo = { ...(newErrors.cargo || {}), units: 'Units must be greater than 0' };
      hasErrors = true;
    }

    // Validate dimensions if any dimension is provided
    const { length, width, height } = formData.cargo.dimensions;
    if (length > 0 || width > 0 || height > 0) {
      if (length <= 0) {
        newErrors.cargo = {
          ...(newErrors.cargo || {}),
          dimensions: { ...(newErrors.cargo?.dimensions || {}), length: 'Length must be greater than 0' }
        };
        hasErrors = true;
      }

      if (width <= 0) {
        newErrors.cargo = {
          ...(newErrors.cargo || {}),
          dimensions: { ...(newErrors.cargo?.dimensions || {}), width: 'Width must be greater than 0' }
        };
        hasErrors = true;
      }

      if (height <= 0) {
        newErrors.cargo = {
          ...(newErrors.cargo || {}),
          dimensions: { ...(newErrors.cargo?.dimensions || {}), height: 'Height must be greater than 0' }
        };
        hasErrors = true;
      }
    }

    // Validate hazard class if hazardous is checked
    if (formData.cargo.hazardous && !formData.cargo.hazardClass) {
      newErrors.cargo = { ...(newErrors.cargo || {}), hazardClass: 'Hazard class is required for hazardous materials' };
      hasErrors = true;
    }

    // Pricing tab validation
    if (formData.pricing.baseRate <= 0) {
      newErrors.pricing = { ...(newErrors.pricing || {}), baseRate: 'Base rate must be greater than 0' };
      hasErrors = true;
    }

    if (formData.pricing.tax < 0 || formData.pricing.tax > 100) {
      newErrors.pricing = { ...(newErrors.pricing || {}), tax: 'Tax rate must be between 0 and 100' };
      hasErrors = true;
    }

    if (!formData.pricing.currency) {
      newErrors.pricing = { ...(newErrors.pricing || {}), currency: 'Currency is required' };
      hasErrors = true;
    }

    // Set the errors
    setErrors(newErrors);

    // Return true if no errors, false otherwise
    return !hasErrors;
  };

  // Add progress tracking function
  const calculateProgress = useCallback(() => {
    const filledFields = [
      formData.truckId,
      formData.clientId,
      formData.origin,
      formData.destination,
      formData.pickupDate,
      formData.estimatedDeliveryDate,
      formData.client.name,
      formData.shipper.name,
      formData.consignee.name,
      formData.cargo.description,
      formData.pricing.baseRate
    ].filter(Boolean).length;

    const totalFields = 11;
    const progress = (filledFields / totalFields) * 100;
    setFormProgress(Math.min(progress, 100));
  }, [formData]);

  // Add effect for progress tracking
  useEffect(() => {
    calculateProgress();
  }, [formData, calculateProgress]);

  // Effect for calculating total price
  useEffect(() => {
    const additionalChargesTotal = formData.pricing.additionalCharges.reduce(
      (total, charge) => total + charge.amount, 0
    );

    const subtotal = formData.pricing.baseRate + additionalChargesTotal;
    const taxAmount = subtotal * (formData.pricing.tax / 100);
    const total = subtotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        total: parseFloat(total.toFixed(2))
      }
    }));
  }, [formData.pricing.baseRate, formData.pricing.additionalCharges, formData.pricing.tax]);

  useEffect(() => {
    const { length, width, height } = formData.cargo.dimensions;
    if (length && width && height) {
      const volume = length * width * height;
      setFormData(prev => ({
        ...prev,
        cargo: {
          ...prev.cargo,
          volume: parseFloat(volume.toFixed(2))
        }
      }));
    }
  }, [formData.cargo.dimensions]);

  // Event Handlers
  // First, let's add proper type safety to the handlers:
  // Simplify our form state handlers
  type FormSection = keyof WaybillFormData;
  type FormDataPath = (string | number)[];

  // Type-safe helper function for nested updates
  const updateFormData = (
    formData: WaybillFormData,
    path: FormDataPath,
    value: unknown
  ): WaybillFormData => {
    const result = { ...formData };
    let current = result as NestedRecord;

    for (let i = 0; i < path.length - 1; i++) {
      const currentPath = path[i];
      current[currentPath] = {
        ...(current[currentPath] as NestedRecord)
      };
      current = current[currentPath] as NestedRecord;
    }

    current[path[path.length - 1]] = value;
    return result;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const parts = match.slice(1).filter(Boolean);
      if (parts.length === 0) return '';
      if (parts.length === 1) return `(${parts[0]}`;
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
    return value;
  };

  // Add autosave handler function
  const handleAutosave = useCallback(() => {
    try {
      // Only autosave if there are actual changes
      const draftData = {
        ...formData,
        isDraft: true,
        savedAt: new Date().toISOString()
      };
      
      // Compare with previous saved version to prevent unnecessary saves
      const previousSave = localStorage.getItem('waybillDraft');
      if (previousSave) {
        const previousData = JSON.parse(previousSave);
        
        // Create new objects without the savedAt property using a function
        // with proper TypeScript type annotations
        function removeProperty<T extends Record<string, unknown>>(obj: T, prop: string): Omit<T, keyof T> {
          const newObj = { ...obj };
          if (prop in newObj) {
            delete newObj[prop];
          }
          return newObj as Omit<T, keyof T>;
        }
        
        const prevDataWithoutTimestamp = removeProperty(previousData, 'savedAt');
        const currentDataWithoutTimestamp = removeProperty(draftData, 'savedAt');
        
        if (JSON.stringify(prevDataWithoutTimestamp) === JSON.stringify(currentDataWithoutTimestamp)) {
          // No changes, skip save
          return;
        }
      }
      
      localStorage.setItem('waybillDraft', JSON.stringify(draftData));
      setLastSaved(new Date());
      
      // Optional subtle notification for autosave
      addToast({
        title: "Autosaved",
        description: "Your progress has been automatically saved",
        variant: "default"
      });
    } catch (err) {
      console.error('Autosave failed:', err);
      // Optionally notify user of autosave failure
    }
  }, [formData, addToast]);

  // Add this useEffect for autosave functionality
  useEffect(() => {
    if (!autosaveEnabled) return;

    // Create autosave timer
    const autosaveTimer = setTimeout(() => {
      handleAutosave();
    }, 30000); // Autosave every 30 seconds

    // Clear timer on cleanup
    return () => clearTimeout(autosaveTimer);
  }, [formData, autosaveEnabled, handleAutosave]); // Add handleAutosave to dependencies

  // Event handlers with proper typing
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: FormSection,
    subsection?: string
  ) => {
    const { name, value } = e.target;
    const path = section ? (subsection ? [section, subsection, name] : [section, name]) : [name];

    // Apply phone formatting if this is a phone field
    if (name === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => updateFormData(prev, path, formattedValue));
    } else {
      setFormData(prev => updateFormData(prev, path, value));
    }

    // Validation logic...
    if (validateOnChange) {
      setTimeout(() => validateForm(), 100);
    }
  };

  const handleSaveAsDraft = () => {
    try {
      const draftData = {
        ...formData,
        isDraft: true,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('waybillDraft', JSON.stringify(draftData));

      addToast({
        title: "Draft Saved",
        description: "Your waybill has been saved as a draft",
        variant: "default"
      });
    } catch (err) { // Change error to err
      console.error('Failed to save draft:', err);
      addToast({
        title: "Save Failed",
        description: "Could not save the draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = () => {
    const duplicateData = {
      ...formData,
      id: undefined,
      cargo: {
        ...formData.cargo,
        dimensions: { ...formData.cargo.dimensions },
        weight: 0,
        units: 1,
        value: 0
      },
      pricing: {
        ...formData.pricing,
        additionalCharges: [...formData.pricing.additionalCharges]
      }
    };
    setFormData(duplicateData);
  };

  const handleLoadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('waybillDraft');
      if (savedDraft) {
        setFormData({ ...JSON.parse(savedDraft), isDraft: false });
        addToast({
          title: "Draft Loaded",
          description: "Previous draft has been restored successfully",
          variant: "default"
        });
      } else {
        addToast({
          title: "No Draft Found",
          description: "No saved draft was found",
          variant: "destructive"
        });
      }
    } catch (err) { // Change error to err
      console.error('Failed to load draft:', err);
      addToast({
        title: "Load Failed",
        description: "Could not load the draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: FormSection,
    subsection?: string
  ) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    const path = section ? (subsection ? [section, subsection, name] : [section, name]) : [name];

    setFormData(prev => updateFormData(prev, path, numValue));

    // If validate on change is enabled, validate the form
    if (validateOnChange) {
      // Use setTimeout to ensure form state has updated before validation
      setTimeout(() => validateForm(), 100);
    }
  };

  const handleSelectChange = (
    value: string,
    field: string,
    section?: FormSection
  ) => {
    const path = section ? [section, field] : [field];
    setFormData(prev => updateFormData(prev, path, value));

    // If validate on change is enabled, validate the form
    if (validateOnChange) {
      // Use setTimeout to ensure form state has updated before validation
      setTimeout(() => validateForm(), 100);
    }
  };

  const handleCheckboxChange = (
    checked: boolean,
    field: string,
    section: FormSection
  ) => {
    setFormData(prev => updateFormData(prev, [section, field], checked));

    // If validate on change is enabled, validate the form
    if (validateOnChange) {
      // Use setTimeout to ensure form state has updated before validation
      setTimeout(() => validateForm(), 100);
    }
  };

  const addAdditionalCharge = () => {
    if (additionalCharge.description && additionalCharge.amount > 0) {
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          additionalCharges: [...prev.pricing.additionalCharges, { ...additionalCharge }]
        }
      }));
      setAdditionalCharge({ description: '', amount: 0 });
    }
  };

  const removeAdditionalCharge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        additionalCharges: prev.pricing.additionalCharges.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Set active tab to the first tab with errors
      if (errors.truckId || errors.clientId || errors.origin || errors.destination ||
        errors.pickupDate || errors.estimatedDeliveryDate) {
        setActiveTab('general');
      } else if (errors.client || errors.shipper || errors.consignee) {
        setActiveTab('parties');
      } else if (errors.cargo) {
        setActiveTab('cargo');
      } else if (errors.pricing) {
        setActiveTab('pricing');
      }

      // Enable validation on change after first submit attempt
      setValidateOnChange(true);

      // Show toast notification
      addToast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      });

      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      addToast({
        title: "Success",
        description: "Waybill has been generated successfully",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to submit form:', err);
      addToast({
        title: "Error",
        description: "Failed to generate waybill. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-6 w-6" />
            Waybill Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {Object.keys(errors).length > 0 && validateOnChange && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
              <p className="text-sm text-red-700 mb-2">There are validation errors in the form. Please review and correct them.</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all"
                    style={{ width: `${formProgress}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600 text-right">
                  {Math.round(formProgress)}% complete
                </div>
              </div>
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="cargo">Cargo</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>

              {/* General Information Tab */}
              <TabsContent value="general" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      Truck Selection
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="truckId">Select Truck</Label>
                      <Select
                        value={formData.truckId}
                        onValueChange={(value) => handleSelectChange(value, 'truckId')}
                      >
                        <SelectTrigger className={errors.truckId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select a truck" />
                        </SelectTrigger>
                        <SelectContent>
                          {trucks.map(truck => (
                            <SelectItem key={truck.id} value={truck.id}>
                              {truck.licensePlate}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.truckId && <ErrorMessage message={errors.truckId} />}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientId">Select Client</Label>
                      <Select
                        value={formData.clientId}
                        onValueChange={(value) => handleSelectChange(value, 'clientId')}
                      >
                        <SelectTrigger className={errors.clientId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.clientId && <ErrorMessage message={errors.clientId} />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      name="origin"
                      value={formData.origin}
                      onChange={(e) => handleChange(e)}
                      placeholder="Origin location"
                      required
                      className={errors.origin ? 'border-red-500' : ''}
                    />
                    {errors.origin && <ErrorMessage message={errors.origin} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={(e) => handleChange(e)}
                      placeholder="Destination location"
                      required
                      className={errors.destination ? 'border-red-500' : ''}
                    />
                    {errors.destination && <ErrorMessage message={errors.destination} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      name="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => handleChange(e)}
                      required
                      className={errors.pickupDate ? 'border-red-500' : ''}
                    />
                    {errors.pickupDate && <ErrorMessage message={errors.pickupDate} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDeliveryDate">Estimated Delivery</Label>
                    <Input
                      id="estimatedDeliveryDate"
                      name="estimatedDeliveryDate"
                      type="date"
                      value={formData.estimatedDeliveryDate}
                      onChange={(e) => handleChange(e)}
                      required
                      className={errors.estimatedDeliveryDate ? 'border-red-500' : ''}
                    />
                    {errors.estimatedDeliveryDate && <ErrorMessage message={errors.estimatedDeliveryDate} />}
                  </div>
                </div>
              </TabsContent>
              {/* Parties Information Tab */}
              <TabsContent value="parties" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Client Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Client Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="client.name">Name</Label>
                      <Input
                        id="client.name"
                        name="name"
                        value={formData.client.name}
                        onChange={(e) => handleChange(e, 'client')}
                        required
                        className={errors.client?.name ? 'border-red-500' : ''}
                      />
                      {errors.client?.name && <ErrorMessage message={errors.client.name} />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client.contactPerson">Contact Person</Label>
                      <Input
                        id="client.contactPerson"
                        name="contactPerson"
                        value={formData.client.contactPerson}
                        onChange={(e) => handleChange(e, 'client')}
                        className={errors.client?.contactPerson ? 'border-red-500' : ''}
                      />
                      {errors.client?.contactPerson && <ErrorMessage message={errors.client.contactPerson} />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client.phone">Phone</Label>
                      <Input
                        id="client.phone"
                        name="phone"
                        value={formData.client.phone}
                        onChange={(e) => handleChange(e, 'client')}
                        className={errors.client?.phone ? 'border-red-500' : ''}
                      />
                      {errors.client?.phone && <ErrorMessage message={errors.client.phone} />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client.email">Email</Label>
                      <Input
                        id="client.email"
                        name="email"
                        type="email"
                        value={formData.client.email}
                        onChange={(e) => handleChange(e, 'client')}
                        className={errors.client?.email ? 'border-red-500' : ''}
                      />
                      {errors.client?.email && <ErrorMessage message={errors.client.email} />}
                    </div>
                  </div>

                  {/* Shipper Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Shipper Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="shipper.name">Name</Label>
                      <Input
                        id="shipper.name"
                        name="name"
                        value={formData.shipper.name}
                        onChange={(e) => handleChange(e, 'shipper')}
                        required
                        className={errors.shipper?.name ? 'border-red-500' : ''}
                      />
                      {errors.shipper?.name && <ErrorMessage message={errors.shipper.name} />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipper.address">Address</Label>
                      <Input
                        id="shipper.address"
                        name="address"
                        value={formData.shipper.address}
                        onChange={(e) => handleChange(e, 'shipper')}
                        required
                        className={errors.shipper?.address ? 'border-red-500' : ''}
                      />
                      {errors.shipper?.address && <ErrorMessage message={errors.shipper.address} />}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipper.phone">Phone</Label>
                      <Input
                        id="shipper.phone"
                        name="phone"
                        value={formData.shipper.phone}
                        onChange={(e) => handleChange(e, 'shipper')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipper.email">Email</Label>
                      <Input
                        id="shipper.email"
                        name="email"
                        type="email"
                        value={formData.shipper.email}
                        onChange={(e) => handleChange(e, 'shipper')}
                      />
                    </div>
                  </div>

                  {/* Consignee Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Consignee Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="consignee.name">Name</Label>
                      <Input
                        id="consignee.name"
                        name="name"
                        value={formData.consignee.name}
                        onChange={(e) => handleChange(e, 'consignee')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consignee.address">Address</Label>
                      <Input
                        id="consignee.address"
                        name="address"
                        value={formData.consignee.address}
                        onChange={(e) => handleChange(e, 'consignee')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consignee.phone">Phone</Label>
                      <Input
                        id="consignee.phone"
                        name="phone"
                        value={formData.consignee.phone}
                        onChange={(e) => handleChange(e, 'consignee')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consignee.email">Email</Label>
                      <Input
                        id="consignee.email"
                        name="email"
                        type="email"
                        value={formData.consignee.email}
                        onChange={(e) => handleChange(e, 'consignee')}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Cargo Information Tab */}
              <TabsContent value="cargo" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Cargo Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Cargo Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="cargo.description">Description</Label>
                      <Input
                        id="cargo.description"
                        name="description"
                        value={formData.cargo.description}
                        onChange={(e) => handleChange(e, 'cargo')}
                        placeholder="Describe the cargo"
                        required
                        className={errors.cargo?.description ? 'border-red-500' : ''}
                      />
                      {errors.cargo?.description && <ErrorMessage message={errors.cargo.description} />}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cargo.weight">Weight</Label>
                        <Input
                          id="cargo.weight"
                          name="weight"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.cargo.weight}
                          onChange={(e) => handleNumberChange(e, 'cargo')}
                          required
                          className={errors.cargo?.weight ? 'border-red-500' : ''}
                        />
                        {errors.cargo?.weight && <ErrorMessage message={errors.cargo.weight} />}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo.units">Units</Label>
                        <Input
                          id="cargo.units"
                          name="units"
                          type="number"
                          min="1"
                          value={formData.cargo.units}
                          onChange={(e) => handleNumberChange(e, 'cargo')}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargo.value">Declared Value</Label>
                      <Input
                        id="cargo.value"
                        name="value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.cargo.value}
                        onChange={(e) => handleNumberChange(e, 'cargo')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargo.type">Cargo Type</Label>
                      <Input
                        id="cargo.type"
                        name="type"
                        value={formData.cargo.type}
                        onChange={(e) => handleChange(e, 'cargo')}
                        placeholder="e.g., General, Perishable, etc."
                      />
                    </div>
                  </div>

                  {/* Dimensions and Hazardous Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Dimensions</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cargo.dimensions.length">Length</Label>
                        <Input
                          id="cargo.dimensions.length"
                          name="length"
                          type="number"
                          min="0"
                          value={formData.cargo.dimensions.length}
                          onChange={(e) => handleNumberChange(e, 'cargo', 'dimensions')}
                          className={errors.cargo?.dimensions?.length ? 'border-red-500' : ''}
                        />
                        {errors.cargo?.dimensions?.length && <ErrorMessage message={errors.cargo.dimensions.length} />}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo.dimensions.width">Width</Label>
                        <Input
                          id="cargo.dimensions.width"
                          name="width"
                          type="number"
                          min="0"
                          value={formData.cargo.dimensions.width}
                          onChange={(e) => handleNumberChange(e, 'cargo', 'dimensions')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cargo.dimensions.height">Height</Label>
                        <Input
                          id="cargo.dimensions.height"
                          name="height"
                          type="number"
                          min="0"
                          value={formData.cargo.dimensions.height}
                          onChange={(e) => handleNumberChange(e, 'cargo', 'dimensions')}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 mt-6">
                      <h3 className="font-semibold">Hazardous Materials</h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cargo.hazardous"
                          checked={formData.cargo.hazardous}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(checked as boolean, 'hazardous', 'cargo')}
                        />
                        <Label htmlFor="cargo.hazardous">Hazardous Materials</Label>
                      </div>

                      {formData.cargo.hazardous && (
                        <div className="space-y-2">
                          <Label htmlFor="cargo.hazardClass">Hazard Class</Label>
                          <Input
                            id="cargo.hazardClass"
                            name="hazardClass"
                            value={formData.cargo.hazardClass}
                            onChange={(e) => handleChange(e, 'cargo')}
                            required={formData.cargo.hazardous}
                            placeholder="Enter hazard class"
                            className={errors.cargo?.hazardClass ? 'border-red-500' : ''}
                          />
                          {errors.cargo?.hazardClass && <ErrorMessage message={errors.cargo.hazardClass} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Pricing Information Tab */}
              <TabsContent value="pricing" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Pricing */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      Basic Pricing
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="pricing.baseRate">Base Rate</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="pricing.baseRate"
                          name="baseRate"
                          type="number"
                          min="0"
                          step="0.01"
                          className={`pl-9 ${errors.pricing?.baseRate ? 'border-red-500' : ''}`}
                          value={formData.pricing.baseRate}
                          onChange={(e) => handleNumberChange(e, 'pricing')}
                          required
                        />
                      </div>
                      {errors.pricing?.baseRate && <ErrorMessage message={errors.pricing.baseRate} />}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricing.tax">Tax Rate (%)</Label>
                      <Input
                        id="pricing.tax"
                        name="tax"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.pricing.tax}
                        onChange={(e) => handleNumberChange(e, 'pricing')}
                        className={errors.pricing?.tax ? 'border-red-500' : ''}
                      />
                      {errors.pricing?.tax && <ErrorMessage message={errors.pricing.tax} />}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricing.currency">Currency</Label>
                      <Select
                        value={formData.pricing.currency}
                        onValueChange={(value) => handleSelectChange(value, 'currency', 'pricing')}
                      >
                        <SelectTrigger className={errors.pricing?.currency ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.pricing?.currency && <ErrorMessage message={errors.pricing.currency} />}
                    </div>
                  </div>

                  {/* Additional Charges */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Additional Charges</h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="additionalCharge.description">Description</Label>
                          <Input
                            id="additionalCharge.description"
                            value={additionalCharge.description}
                            onChange={(e) => setAdditionalCharge(prev => ({
                              ...prev,
                              description: e.target.value
                            }))}
                            placeholder="e.g., Handling Fee"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="additionalCharge.amount">Amount</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              id="additionalCharge.amount"
                              type="number"
                              min="0"
                              step="0.01"
                              className="pl-9"
                              value={additionalCharge.amount}
                              onChange={(e) => setAdditionalCharge(prev => ({
                                ...prev,
                                amount: parseFloat(e.target.value) || 0
                              }))}
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addAdditionalCharge}
                        disabled={!additionalCharge.description || additionalCharge.amount <= 0}
                        className="w-full"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Charge
                      </Button>
                    </div>

                    {/* List of Additional Charges */}
                    {formData.pricing.additionalCharges.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium">Added Charges</h4>
                        <div className="rounded-md border divide-y">
                          {formData.pricing.additionalCharges.map((charge, index) => (
                            <div key={index} className="p-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium">{charge.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: formData.pricing.currency
                                  }).format(charge.amount)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAdditionalCharge(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total Calculation */}
                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Base Rate:</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: formData.pricing.currency
                            }).format(formData.pricing.baseRate)}
                          </span>
                        </div>

                        {formData.pricing.additionalCharges.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Additional Charges:</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: formData.pricing.currency
                              }).format(formData.pricing.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0))}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <span>Tax ({formData.pricing.tax}%):</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: formData.pricing.currency
                            }).format((formData.pricing.baseRate +
                              formData.pricing.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0)) *
                              (formData.pricing.tax / 100))}
                          </span>
                        </div>

                        <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                          <span>Total:</span>
                          <span>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: formData.pricing.currency
                            }).format(formData.pricing.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Special Instructions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Special Instructions
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="cargo.specialInstructions">Cargo Handling Instructions</Label>
                      <Textarea
                        id="cargo.specialInstructions"
                        name="specialInstructions"
                        value={formData.cargo.specialInstructions}
                        onChange={(e) => handleChange(e, 'cargo')}
                        placeholder="Enter any special handling instructions for the cargo..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>

                  {/* General Notes */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Additional Notes
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="notes">General Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter any additional notes or comments..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Submit Buttons */}
            <div className="mt-8 flex justify-between">
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  title="Save as Draft (Ctrl+S)" // Add tooltip
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadDraft}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Load Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDuplicate}
                  title="Duplicate Waybill (Ctrl+D)" // Add tooltip
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPdfPreview(true)}
                  title="Preview PDF (Ctrl+P)" // Add tooltip
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Preview PDF
                </Button>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
                      setFormData(defaultFormData);
                    }
                  }}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Waybill'
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autosave"
                  checked={autosaveEnabled}
                  onChange={() => setAutosaveEnabled(!autosaveEnabled)}
                  className="rounded"
                />
                <label htmlFor="autosave">Enable autosave</label>
              </div>
              {lastSaved && (
                <div>
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </form>
        </CardContent >
        {showPdfPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Waybill Preview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPdfPreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="border rounded p-4">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Waybill #{formData.id || 'DRAFT'}</h1>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Shipping Details</h3>
                      <p>From: {formData.origin}</p>
                      <p>To: {formData.destination}</p>
                      <p>Pickup: {formData.pickupDate}</p>
                      <p>Delivery: {formData.estimatedDeliveryDate}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Cargo Details</h3>
                      <p>Description: {formData.cargo.description}</p>
                      <p>Weight: {formData.cargo.weight}</p>
                      <p>Units: {formData.cargo.units}</p>
                      <p>Value: {formData.cargo.value}</p>
                    </div>
                  </div>
                  {/* Add more preview content as needed */}
                </div>
              </div>
            </div>
          </div>
        )
        }
        {
          showShortcuts && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
              <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
              <ul className="space-y-1">
                <li><span className="font-mono bg-gray-200 px-1 rounded">Ctrl+S</span> - Save draft</li>
                <li><span className="font-mono bg-gray-200 px-1 rounded">Ctrl+D</span> - Duplicate waybill</li>
                <li><span className="font-mono bg-gray-200 px-1 rounded">Ctrl+P</span> - Preview PDF</li>
                <li><span className="font-mono bg-gray-200 px-1 rounded">Ctrl+Alt+T</span> - Switch to next tab</li>
              </ul>
              <button
                className="text-blue-600 text-xs mt-2"
                onClick={() => setShowShortcuts(false)}
              >
                Hide
              </button>
            </div>
          )
        }
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="text-xs"
        >
          Keyboard Shortcuts
        </Button>
      </Card >
      <Toaster />
    </>
  );
};

export default WaybillForm;