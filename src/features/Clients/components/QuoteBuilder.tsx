// src/components/client/QuoteBuilder.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@features/UI/components/ui/card';
import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Label } from '@features/UI/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@features/UI/components/ui/select';
import { Checkbox } from '@features/UI/components/ui/checkbox';
import { Badge } from '@features/UI/components/ui/badge';
import { Separator } from '@features/UI/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@features/UI/components/ui/tabs';
import {
  Truck,
  Package,
  PlusCircle,
  MinusCircle,
  Save,
  Send,
  ArrowRight,
  Check,
  Calendar,
  Clock
} from 'lucide-react';

export interface QuoteBuilderProps {
  clientId: string;
}

// Types
interface CargoItem {
  id: string;
  type: string;
  description: string;
  weight: number;
  weightUnit: 'kg' | 'lb';
  quantity: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  isDangerous: boolean;
  requiresRefrigeration: boolean;
  estimatedValue?: number;
}

interface LocationInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface QuoteDetails {
  cargoItems: CargoItem[];
  origin: LocationInfo;
  destination: LocationInfo;
  serviceType: 'standard' | 'express' | 'economy';
  insuranceRequired: boolean;
  estimatedDeparture: string;
  additionalServices: {
    customsClearance: boolean;
    packaging: boolean;
    loading: boolean;
    unloading: boolean;
    warehouseStorage: boolean;
  };
  notes: string;
}

interface QuoteEstimate {
  baseRate: number;
  distanceCharge: number;
  weightCharge: number;
  serviceCharge: number;
  additionalServicesCharges: {
    customsClearance: number;
    packaging: number;
    loading: number;
    unloading: number;
    warehouseStorage: number;
  };
  insuranceCharge: number;
  estimatedTax: number;
  totalEstimate: number;
  currency: string;
  estimatedDays: number;
}

// Initial empty state
const emptyQuote: QuoteDetails = {
  cargoItems: [],
  origin: {
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  },
  destination: {
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  },
  serviceType: 'standard',
  insuranceRequired: false,
  estimatedDeparture: '',
  additionalServices: {
    customsClearance: false,
    packaging: false,
    loading: false,
    unloading: false,
    warehouseStorage: false
  },
  notes: ''
};

// Mock data for service types
const serviceTypes = [
  {
    id: 'standard',
    name: 'Standard',
    description: '5-7 business days',
    multiplier: 1.0
  },
  {
    id: 'express',
    name: 'Express',
    description: '2-3 business days',
    multiplier: 1.75
  },
  {
    id: 'economy',
    name: 'Economy',
    description: '7-10 business days',
    multiplier: 0.8
  }
];

// Mock freight rate calculator function
const calculateFreightRate = (quoteDetails: QuoteDetails): QuoteEstimate => {
  // This would typically be a complex calculation based on many factors
  // For demo purposes, we'll use simplified logic

  // Calculate total weight
  const totalWeight = quoteDetails.cargoItems.reduce((sum, item) => {
    // Convert to kg for consistent calculation
    const weight = item.weightUnit === 'lb' ? item.weight * 0.453592 : item.weight;
    return sum + (weight * item.quantity);
  }, 0);

  // Base distance charge (would typically use actual distance calculation)
  const distanceMultiplier =
    (quoteDetails.origin.country !== quoteDetails.destination.country) ? 2.5 : 1;
  const distanceCharge = 250 * distanceMultiplier;

  // Weight charge
  const weightCharge = totalWeight * 0.5; // $0.50 per kg

  // Service type multiplier
  const serviceType = serviceTypes.find(s => s.id === quoteDetails.serviceType);
  const serviceMultiplier = serviceType?.multiplier || 1.0;

  // Calculate base rate
  const baseRate = 100 + distanceCharge + weightCharge;

  // Apply service multiplier
  const serviceCharge = baseRate * (serviceMultiplier - 1);

  // Additional services
  const additionalServicesCharges = {
    customsClearance: quoteDetails.additionalServices.customsClearance ? 120 : 0,
    packaging: quoteDetails.additionalServices.packaging ?
      (totalWeight * 0.2) : 0, // $0.20 per kg
    loading: quoteDetails.additionalServices.loading ? 75 : 0,
    unloading: quoteDetails.additionalServices.unloading ? 75 : 0,
    warehouseStorage: quoteDetails.additionalServices.warehouseStorage ?
      (totalWeight * 0.1 * 7) : 0 // $0.10 per kg per day, assuming 7 days
  };

  // Total for additional services
  const additionalServicesTotal = Object.values(additionalServicesCharges).reduce(
    (sum, charge) => sum + charge, 0
  );

  // Insurance
  const totalDeclaredValue = quoteDetails.cargoItems.reduce(
    (sum, item) => sum + (item.estimatedValue || 0) * item.quantity, 0
  );
  const insuranceCharge = quoteDetails.insuranceRequired ?
    (totalDeclaredValue * 0.01) : 0; // 1% of declared value

  // Tax (simplified)
  const subtotal = baseRate + serviceCharge + additionalServicesTotal + insuranceCharge;
  const estimatedTax = subtotal * 0.07; // Assuming 7% tax

  // Estimated delivery time in days
  let estimatedDays = 0;
  switch (quoteDetails.serviceType) {
    case 'express':
      estimatedDays = 3;
      break;
    case 'standard':
      estimatedDays = 7;
      break;
    case 'economy':
      estimatedDays = 10;
      break;
  }

  // Total estimate
  const totalEstimate = subtotal + estimatedTax;

  return {
    baseRate,
    distanceCharge,
    weightCharge,
    serviceCharge,
    additionalServicesCharges,
    insuranceCharge,
    estimatedTax,
    totalEstimate,
    currency: 'USD',
    estimatedDays
  };
};

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ clientId }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails>(emptyQuote);
  const [quoteEstimate, setQuoteEstimate] = useState<QuoteEstimate | null>(null);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new cargo item
  const handleAddCargoItem = () => {
    const newItem: CargoItem = {
      id: `cargo-${Date.now()}`,
      type: 'General',
      description: '',
      weight: 0,
      weightUnit: 'kg',
      quantity: 1,
      isDangerous: false,
      requiresRefrigeration: false
    };

    setQuoteDetails({
      ...quoteDetails,
      cargoItems: [...quoteDetails.cargoItems, newItem]
    });
  };

  // Remove a cargo item
  const handleRemoveCargoItem = (id: string) => {
    setQuoteDetails({
      ...quoteDetails,
      cargoItems: quoteDetails.cargoItems.filter(item => item.id !== id)
    });
  };

  // Update a cargo item
  const handleUpdateCargoItem = (id: string, field: string, value: string | number | boolean) => {
    setQuoteDetails({
      ...quoteDetails,
      cargoItems: quoteDetails.cargoItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  // Update origin or destination
  const handleLocationChange = (locationType: 'origin' | 'destination', field: string, value: string) => {
    setQuoteDetails({
      ...quoteDetails,
      [locationType]: {
        ...quoteDetails[locationType],
        [field]: value
      }
    });
  };

  // Update service options
  const handleServiceChange = (field: string, value: string | number | boolean) => {
    setQuoteDetails({
      ...quoteDetails,
      [field]: value
    });
  };

  // Update additional services
  const handleAdditionalServiceChange = (service: string, checked: boolean) => {
    setQuoteDetails({
      ...quoteDetails,
      additionalServices: {
        ...quoteDetails.additionalServices,
        [service]: checked
      }
    });
  };

  // Generate quote estimate
  const handleGenerateEstimate = () => {
    setIsGeneratingQuote(true);

    // Simulate API call delay
    setTimeout(() => {
      const estimate = calculateFreightRate(quoteDetails);
      setQuoteEstimate(estimate);
      setIsGeneratingQuote(false);
      setActiveStep(3); // Move to review step
    }, 1500);
  };

  // Save quote for later
  const handleSaveQuote = () => {
    setIsSaving(true);

    // Simulate API call delay
    setTimeout(() => {
      alert('Quote saved successfully! You can access it from your account dashboard.');
      setIsSaving(false);
    }, 1000);
  };

  // Submit quote request
  const handleSubmitQuote = () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      alert('Quote request submitted successfully! Our team will contact you shortly.');
      setIsSubmitting(false);

      // Reset form and go back to step 1
      setQuoteDetails(emptyQuote);
      setQuoteEstimate(null);
      setActiveStep(1);
    }, 1500);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Check if form is valid for the current step
  const isCurrentStepValid = () => {
    switch (activeStep) {
      case 1: // Cargo details
        return quoteDetails.cargoItems.length > 0 &&
          quoteDetails.cargoItems.every(item =>
            item.description && item.weight > 0
          );
      case 2: // Route and services
        return quoteDetails.origin.city &&
          quoteDetails.origin.country &&
          quoteDetails.destination.city &&
          quoteDetails.destination.country &&
          quoteDetails.serviceType;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      <p>Quote Builder for client ID: {clientId}</p>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Quote Builder</CardTitle>
          <CardDescription>
            Get an instant estimate for your cargo shipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div
                className={`flex flex-col items-center ${activeStep >= 1 ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${activeStep >= 1 ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}>
                  {activeStep > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="text-xs mt-1">Cargo Details</span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                }`} />
              <div
                className={`flex flex-col items-center ${activeStep >= 2 ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${activeStep >= 2 ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}>
                  {activeStep > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="text-xs mt-1">Route & Services</span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-300"
                }`} />
              <div
                className={`flex flex-col items-center ${activeStep >= 3 ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${activeStep >= 3 ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}>
                  3
                </div>
                <span className="text-xs mt-1">Review & Submit</span>
              </div>
            </div>
          </div>

          {/* Step 1: Cargo Details */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Cargo Items</h2>
                <Button onClick={handleAddCargoItem}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {quoteDetails.cargoItems.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-md">
                  <Package className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No cargo items added yet.</p>
                  <Button onClick={handleAddCargoItem} className="mt-4">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {quoteDetails.cargoItems.map((item, index) => (
                    <Card key={item.id}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md">Item {index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCargoItem(item.id)}
                          >
                            <MinusCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`item-${item.id}-type`}>Cargo Type</Label>
                            <Select
                              value={item.type}
                              onValueChange={(value) =>
                                handleUpdateCargoItem(item.id, 'type', value)
                              }
                            >
                              <SelectTrigger id={`item-${item.id}-type`}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="Furniture">Furniture</SelectItem>
                                <SelectItem value="Food">Food & Beverages</SelectItem>
                                <SelectItem value="Medical">Medical Supplies</SelectItem>
                                <SelectItem value="Clothing">Clothing & Textiles</SelectItem>
                                <SelectItem value="Chemicals">Chemicals</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-${item.id}-description`}>Description</Label>
                            <Input
                              id={`item-${item.id}-description`}
                              placeholder="Brief description of the item"
                              value={item.description}
                              onChange={(e) =>
                                handleUpdateCargoItem(item.id, 'description', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-${item.id}-weight`}>Weight</Label>
                            <div className="flex space-x-2">
                              <Input
                                id={`item-${item.id}-weight`}
                                type="number"
                                min="0"
                                step="0.1"
                                placeholder="Weight"
                                value={item.weight || ''}
                                onChange={(e) =>
                                  handleUpdateCargoItem(item.id, 'weight', parseFloat(e.target.value) || 0)
                                }
                              />
                              <Select
                                value={item.weightUnit}
                                onValueChange={(value) =>
                                  handleUpdateCargoItem(item.id, 'weightUnit', value)
                                }
                              >
                                <SelectTrigger className="w-[80px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">kg</SelectItem>
                                  <SelectItem value="lb">lb</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-${item.id}-quantity`}>Quantity</Label>
                            <Input
                              id={`item-${item.id}-quantity`}
                              type="number"
                              min="1"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateCargoItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-${item.id}-value`}>Estimated Value</Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input
                                id={`item-${item.id}-value`}
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-8"
                                placeholder="Estimated value (USD)"
                                value={item.estimatedValue || ''}
                                onChange={(e) =>
                                  handleUpdateCargoItem(item.id, 'estimatedValue', parseFloat(e.target.value) || 0)
                                }
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2 flex space-x-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`item-${item.id}-dangerous`}
                                checked={item.isDangerous}
                                onCheckedChange={(checked) =>
                                  handleUpdateCargoItem(item.id, 'isDangerous', !!checked)
                                }
                              />
                              <Label htmlFor={`item-${item.id}-dangerous`}>Dangerous Goods</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`item-${item.id}-refrigeration`}
                                checked={item.requiresRefrigeration}
                                onCheckedChange={(checked) =>
                                  handleUpdateCargoItem(item.id, 'requiresRefrigeration', !!checked)
                                }
                              />
                              <Label htmlFor={`item-${item.id}-refrigeration`}>Requires Refrigeration</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Route & Services */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <Tabs defaultValue="route">
                <TabsList className="mb-4">
                  <TabsTrigger value="route">
                    <Truck className="h-4 w-4 mr-2" />
                    Route
                  </TabsTrigger>
                  <TabsTrigger value="services">
                    <Package className="h-4 w-4 mr-2" />
                    Services
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="route" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Origin Address */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Origin</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="origin-name">Contact Name/Company</Label>
                          <Input
                            id="origin-name"
                            placeholder="Name or Company"
                            value={quoteDetails.origin.name}
                            onChange={(e) =>
                              handleLocationChange('origin', 'name', e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="origin-address">Address</Label>
                          <Input
                            id="origin-address"
                            placeholder="Street address"
                            value={quoteDetails.origin.address}
                            onChange={(e) =>
                              handleLocationChange('origin', 'address', e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="origin-city">City</Label>
                            <Input
                              id="origin-city"
                              placeholder="City"
                              value={quoteDetails.origin.city}
                              onChange={(e) =>
                                handleLocationChange('origin', 'city', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="origin-state">State/Province</Label>
                            <Input
                              id="origin-state"
                              placeholder="State/Province"
                              value={quoteDetails.origin.state}
                              onChange={(e) =>
                                handleLocationChange('origin', 'state', e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="origin-zip">Zip/Postal Code</Label>
                            <Input
                              id="origin-zip"
                              placeholder="Zip/Postal Code"
                              value={quoteDetails.origin.zipCode}
                              onChange={(e) =>
                                handleLocationChange('origin', 'zipCode', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="origin-country">Country</Label>
                            <Input
                              id="origin-country"
                              placeholder="Country"
                              value={quoteDetails.origin.country}
                              onChange={(e) =>
                                handleLocationChange('origin', 'country', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Destination Address */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Destination</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="destination-name">Contact Name/Company</Label>
                          <Input
                            id="destination-name"
                            placeholder="Name or Company"
                            value={quoteDetails.destination.name}
                            onChange={(e) =>
                              handleLocationChange('destination', 'name', e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="destination-address">Address</Label>
                          <Input
                            id="destination-address"
                            placeholder="Street address"
                            value={quoteDetails.destination.address}
                            onChange={(e) =>
                              handleLocationChange('destination', 'address', e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="destination-city">City</Label>
                            <Input
                              id="destination-city"
                              placeholder="City"
                              value={quoteDetails.destination.city}
                              onChange={(e) =>
                                handleLocationChange('destination', 'city', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="destination-state">State/Province</Label>
                            <Input
                              id="destination-state"
                              placeholder="State/Province"
                              value={quoteDetails.destination.state}
                              onChange={(e) =>
                                handleLocationChange('destination', 'state', e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="destination-zip">Zip/Postal Code</Label>
                            <Input
                              id="destination-zip"
                              placeholder="Zip/Postal Code"
                              value={quoteDetails.destination.zipCode}
                              onChange={(e) =>
                                handleLocationChange('destination', 'zipCode', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="destination-country">Country</Label>
                            <Input
                              id="destination-country"
                              placeholder="Country"
                              value={quoteDetails.destination.country}
                              onChange={(e) =>
                                handleLocationChange('destination', 'country', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimated-departure">Estimated Departure Date</Label>
                    <Input
                      id="estimated-departure"
                      type="date"
                      value={quoteDetails.estimatedDeparture}
                      onChange={(e) =>
                        handleServiceChange('estimatedDeparture', e.target.value)
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  {/* Service Type */}
                  <div className="space-y-3">
                    <Label>Service Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {serviceTypes.map((service) => (
                        <div
                          key={service.id}
                          className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 ${quoteDetails.serviceType === service.id ? 'border-blue-500 bg-blue-50' : ''
                            }`}
                          onClick={() => handleServiceChange('serviceType', service.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{service.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            </div>
                            {quoteDetails.serviceType === service.id && (
                              <Check className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="space-y-3">
                    <Label>Additional Services</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customs-clearance"
                          checked={quoteDetails.additionalServices.customsClearance}
                          onCheckedChange={(checked) =>
                            handleAdditionalServiceChange('customsClearance', !!checked)
                          }
                        />
                        <Label htmlFor="customs-clearance">Customs Clearance Assistance</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="packaging"
                          checked={quoteDetails.additionalServices.packaging}
                          onCheckedChange={(checked) =>
                            handleAdditionalServiceChange('packaging', !!checked)
                          }
                        />
                        <Label htmlFor="packaging">Packaging Services</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="loading"
                          checked={quoteDetails.additionalServices.loading}
                          onCheckedChange={(checked) =>
                            handleAdditionalServiceChange('loading', !!checked)
                          }
                        />
                        <Label htmlFor="loading">Loading at Origin</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="unloading"
                          checked={quoteDetails.additionalServices.unloading}
                          onCheckedChange={(checked) =>
                            handleAdditionalServiceChange('unloading', !!checked)
                          }
                        />
                        <Label htmlFor="unloading">Unloading at Destination</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="warehouse"
                          checked={quoteDetails.additionalServices.warehouseStorage}
                          onCheckedChange={(checked) =>
                            handleAdditionalServiceChange('warehouseStorage', !!checked)
                          }
                        />
                        <Label htmlFor="warehouse">Warehouse Storage</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="insurance"
                          checked={quoteDetails.insuranceRequired}
                          onCheckedChange={(checked) =>
                            handleServiceChange('insuranceRequired', !!checked)
                          }
                        />
                        <Label htmlFor="insurance">Cargo Insurance</Label>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                      id="notes"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requirements or information"
                      value={quoteDetails.notes}
                      onChange={(e) =>
                        handleServiceChange('notes', e.target.value)
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {activeStep === 3 && quoteEstimate && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Cargo</h3>
                      <ul className="space-y-2">
                        {quoteDetails.cargoItems.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.description} ({item.weight} {item.weightUnit})
                            </span>
                            {item.estimatedValue && (
                              <span className="text-gray-500">
                                Value: ${item.estimatedValue * item.quantity}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h3 className="font-semibold mb-2">Origin</h3>
                        <p className="text-sm">{quoteDetails.origin.city}, {quoteDetails.origin.country}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Destination</h3>
                        <p className="text-sm">{quoteDetails.destination.city}, {quoteDetails.destination.country}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Services</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">
                          {serviceTypes.find(s => s.id === quoteDetails.serviceType)?.name}
                        </Badge>
                        {quoteDetails.insuranceRequired && (
                          <Badge variant="outline">Insurance</Badge>
                        )}

                        {Object.entries(quoteDetails.additionalServices)
                          .filter(entry => entry[1]) // Use the entry array instead of destructuring
                          .map(([key]) => (
                            <Badge key={key} variant="outline">
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase())
                                .replace('Customs Clearance', 'Customs')
                                .replace('Warehouse Storage', 'Storage')
                              }
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Estimate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Base Rate:</span>
                        <span>{formatCurrency(quoteEstimate.baseRate)}</span>
                      </div>

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Distance Charge:</span>
                        <span>{formatCurrency(quoteEstimate.distanceCharge)}</span>
                      </div>

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Weight Charge:</span>
                        <span>{formatCurrency(quoteEstimate.weightCharge)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service Charge:</span>
                        <span>{formatCurrency(quoteEstimate.serviceCharge)}</span>
                      </div>
                    </div>

                    {/* Additional Services */}
                    {Object.entries(quoteEstimate.additionalServicesCharges).some(([, value]) => value > 0) && (
                      <div className="space-y-2">
                        <div className="flex justify-between font-medium">
                          <span>Additional Services:</span>
                        </div>

                        {Object.entries(quoteEstimate.additionalServicesCharges)
                          .filter(entry => entry[1] > 0) // Use the entry array instead of destructuring
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm text-gray-500">
                              <span>
                                {key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, str => str.toUpperCase())
                                  .replace('Customs Clearance', 'Customs')
                                  .replace('Warehouse Storage', 'Storage')
                                }:
                              </span>
                              <span>{formatCurrency(value)}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Insurance */}
                    {quoteEstimate.insuranceCharge > 0 && (
                      <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>{formatCurrency(quoteEstimate.insuranceCharge)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Tax:</span>
                      <span>{formatCurrency(quoteEstimate.estimatedTax)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Estimate:</span>
                      <span>{formatCurrency(quoteEstimate.totalEstimate)}</span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Clock className="h-5 w-5" />
                        <span>Estimated Transit Time: {quoteEstimate.estimatedDays} days</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="h-5 w-5" />
                        <span>
                          Estimated Delivery: {
                            new Date(
                              new Date(quoteDetails.estimatedDeparture).getTime() +
                              quoteEstimate.estimatedDays * 24 * 60 * 60 * 1000
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          }
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 text-sm text-gray-500">
                      <p>* This is an estimate only. Final pricing may vary based on actual cargo details and route specifics.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {activeStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              Back
            </Button>
          )}

          <div className="flex space-x-2">
            {activeStep === 3 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleSaveQuote}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Quote'}
                </Button>
                <Button
                  onClick={handleSubmitQuote}
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </>
            )}

            {activeStep === 1 && (
              <Button
                onClick={() => setActiveStep(2)}
                disabled={!isCurrentStepValid()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {activeStep === 2 && (
              <Button
                onClick={handleGenerateEstimate}
                disabled={isGeneratingQuote || !isCurrentStepValid()}
              >
                {isGeneratingQuote ? 'Calculating...' : 'Generate Estimate'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuoteBuilder;