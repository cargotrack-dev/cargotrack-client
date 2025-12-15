// src/components/cargo/CargoForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@features/UI/components/ui/card';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from '@features/UI/components/ui/form';
import { Input } from '@features/UI/components/ui/input';
import { Button } from '@features/UI/components/ui/button';
import { Textarea } from '@features/UI/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@features/UI/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@features/UI/components/ui/tabs';
import { Separator } from '@features/UI/components/ui/separator';
import { Alert, AlertDescription } from '@features/UI/components/ui/alert';
import {
    Cargo,
    CargoType,
    CargoStatus,
    HazardClass,
    CargoDocument
} from '../types/cargo';
import { Label } from '@features/UI/components/ui/label';
import { Switch } from '@features/UI/components/ui/switch';
import { AlertCircle, Save, X, FileText, Plus, Trash2 } from 'lucide-react';

interface CargoFormProps {
    initialData?: Partial<Cargo>;
    onSubmit: (data: Cargo) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    error?: string;
}

// Using the actual CargoDocument type from our types
type DocumentFormEntry = Omit<CargoDocument, 'type'> & {
    type: "BOL" | "CMR" | "INVOICE" | "PERMIT" | "CUSTOMS" | "CERTIFICATE" | "OTHER";
};


const CargoForm: React.FC<CargoFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    error
}) => {
    const [activeTab, setActiveTab] = useState('general');
    const [documents, setDocuments] = useState<DocumentFormEntry[]>(
        initialData?.documents as DocumentFormEntry[] || []
    );

    // Default form values
    const defaultValues: Partial<Cargo> = {
        id: initialData?.id || '',
        reference: initialData?.reference || '',
        description: initialData?.description || '',
        type: initialData?.type || CargoType.GENERAL,
        status: initialData?.status || CargoStatus.PENDING,
        quantity: initialData?.quantity || 1,
        quantityUnit: initialData?.quantityUnit || 'units',
        dimensions: initialData?.dimensions || {
            length: 0,
            width: 0,
            height: 0,
            unit: 'm'
        },
        weight: initialData?.weight || {
            gross: 0,
            net: 0,
            tare: 0,
            unit: 'kg'
        },
        value: initialData?.value || {
            amount: 0,
            currency: 'USD'
        },
        hazardClass: initialData?.hazardClass || HazardClass.NONE,
        hazardDetails: initialData?.hazardDetails || '',
        handlingInstructions: initialData?.handlingInstructions || {
            temperatureRange: {
                min: 0,
                max: 0,
                unit: 'C'
            },
            orientationRequired: false,
            stackable: true,
            fragile: false,
            customInstructions: ''
        },
        documents: initialData?.documents || [],
        clientId: initialData?.clientId || '',
        notes: initialData?.notes || '',
        tags: initialData?.tags || [],
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: initialData?.updatedAt || new Date(),
        createdBy: initialData?.createdBy || '',
        updatedBy: initialData?.updatedBy || ''
    };

    const form = useForm<Cargo>({
        defaultValues: defaultValues as Cargo,
    });

    // Handle form submission
    const handleSubmit = form.handleSubmit((data) => {
        // Add any data transformations here if needed
        const submissionData = {
            ...data,
            documents: documents as CargoDocument[]
        };
        onSubmit(submissionData);
    });

    // Handle document upload
    const handleAddDocument = () => {
        setDocuments([
            ...documents,
            {
                id: `doc-${Date.now()}`,
                type: "BOL",
                reference: '',
                issueDate: new Date(),
                fileUrl: '',
                notes: ''
            }
        ]);
    };

    // Handle document removal
    const handleRemoveDocument = (index: number) => {
        const newDocs = [...documents];
        newDocs.splice(index, 1);
        setDocuments(newDocs);
    };


    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {initialData?.id ? 'Edit Cargo' : 'Register New Cargo'}
                </CardTitle>
                <CardDescription>
                    Enter the details of the cargo item to be transported
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-4 mb-8">
                                <TabsTrigger value="general">General Information</TabsTrigger>
                                <TabsTrigger value="dimensions">Dimensions & Weight</TabsTrigger>
                                <TabsTrigger value="handling">Handling Instructions</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>

                            {/* General Information Tab */}
                            <TabsContent value="general" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="reference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reference Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., CARGO-2025-001" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Customer reference number for this cargo
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="clientId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Client *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select client" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="client-1">Acme Corporation</SelectItem>
                                                        <SelectItem value="client-2">Globex Industries</SelectItem>
                                                        <SelectItem value="client-3">Oceanic Shipping</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Client associated with this cargo
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the cargo contents"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cargo Type *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select cargo type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(CargoType).map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type.replace('_', ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(CargoStatus).map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status.replace('_', ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="quantityUnit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., boxes, pallets" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="value.amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Value *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="value.currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Currency *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select currency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                        <SelectItem value="GBP">GBP</SelectItem>
                                                        <SelectItem value="CAD">CAD</SelectItem>
                                                        <SelectItem value="AUD">AUD</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="hazardClass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hazard Class *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select hazard class" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(HazardClass).map((hazard) => (
                                                            <SelectItem key={hazard} value={hazard}>
                                                                {hazard.replace('_', ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="hazardDetails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hazard Details</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Additional hazard information"
                                                        {...field}
                                                        disabled={form.watch('hazardClass') === HazardClass.NONE}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Any additional information"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter comma-separated tags"
                                                    {...field}
                                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                    onChange={(e) => {
                                                        const tags = e.target.value
                                                            .split(',')
                                                            .map((tag) => tag.trim())
                                                            .filter((tag) => tag !== '');
                                                        field.onChange(tags);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Tags help with searching and categorizing cargo
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* Dimensions & Weight Tab */}
                            <TabsContent value="dimensions" className="space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Dimensions</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dimensions.length"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Length</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dimensions.width"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Width</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dimensions.height"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Height</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dimensions.unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select unit" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="cm">Centimeters (cm)</SelectItem>
                                                            <SelectItem value="m">Meters (m)</SelectItem>
                                                            <SelectItem value="in">Inches (in)</SelectItem>
                                                            <SelectItem value="ft">Feet (ft)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Weight *</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="weight.gross"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gross Weight *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Total weight with packaging
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="weight.net"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Net Weight *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Weight of goods only
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="weight.tare"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tare Weight</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Weight of packaging
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="weight.unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select unit" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                                            <SelectItem value="lb">Pounds (lb)</SelectItem>
                                                            <SelectItem value="t">Metric Tons (t)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Handling Instructions Tab */}
                            <TabsContent value="handling" className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Temperature Requirements</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="handlingInstructions.temperatureRange.min"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Minimum Temperature</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="handlingInstructions.temperatureRange.max"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Maximum Temperature</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="handlingInstructions.temperatureRange.unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select unit" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="C">Celsius (°C)</SelectItem>
                                                            <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Special Handling</h3>
                                    <div className="grid grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="handlingInstructions.orientationRequired"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between space-x-2">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Specific Orientation Required</FormLabel>
                                                        <FormDescription>
                                                            Must be transported in specific orientation
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="handlingInstructions.stackable"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between space-x-2">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Stackable</FormLabel>
                                                        <FormDescription>
                                                            Can be stacked with other cargo
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="handlingInstructions.fragile"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between space-x-2">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Fragile</FormLabel>
                                                        <FormDescription>
                                                            Requires careful handling
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="handlingInstructions.customInstructions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Custom Handling Instructions</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Any specific handling requirements"
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>

                            {/* Documents Tab */}
                            <TabsContent value="documents" className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Document Attachments</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddDocument}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Document
                                    </Button>
                                </div>

                                {documents.length === 0 ? (
                                    <div className="text-center p-8 border border-dashed rounded-md">
                                        <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">No documents attached</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Click 'Add Document' to attach relevant documents
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {documents.map((doc, index) => (
                                            <Card key={doc.id || index} className="relative">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => handleRemoveDocument(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                                <CardContent className="pt-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`doc-type-${index}`}>Document Type</Label>
                                                            <Select
                                                                value={doc.type}
                                                                onValueChange={(value: "BOL" | "CMR" | "INVOICE" | "PERMIT" | "CUSTOMS" | "CERTIFICATE" | "OTHER") => {
                                                                    const newDocs = [...documents];
                                                                    newDocs[index].type = value;
                                                                    setDocuments(newDocs);
                                                                }}
                                                            >
                                                                <SelectTrigger id={`doc-type-${index}`}>
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="BOL">Bill of Lading</SelectItem>
                                                                    <SelectItem value="CMR">CMR Transport Document</SelectItem>
                                                                    <SelectItem value="INVOICE">Commercial Invoice</SelectItem>
                                                                    <SelectItem value="PERMIT">Permit/License</SelectItem>
                                                                    <SelectItem value="CUSTOMS">Customs Declaration</SelectItem>
                                                                    <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                                                                    <SelectItem value="OTHER">Other Document</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`doc-ref-${index}`}>Reference Number</Label>
                                                            <Input
                                                                id={`doc-ref-${index}`}
                                                                placeholder="Document reference number"
                                                                value={doc.reference}
                                                                onChange={(e) => {
                                                                    const newDocs = [...documents];
                                                                    newDocs[index].reference = e.target.value;
                                                                    setDocuments(newDocs);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`doc-date-${index}`}>Issue Date</Label>
                                                            <Input
                                                                id={`doc-date-${index}`}
                                                                type="date"
                                                                value={doc.issueDate instanceof Date
                                                                    ? doc.issueDate.toISOString().split('T')[0]
                                                                    : new Date().toISOString().split('T')[0]
                                                                }
                                                                onChange={(e) => {
                                                                    const newDocs = [...documents];
                                                                    newDocs[index].issueDate = new Date(e.target.value);
                                                                    setDocuments(newDocs);
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`doc-file-${index}`}>File Upload</Label>
                                                            <Input
                                                                id={`doc-file-${index}`}
                                                                type="file"
                                                                onChange={() => {
                                                                    // Handle file upload logic would go here
                                                                    // In a real implementation, you would upload the file to a server
                                                                    // and store the returned URL
                                                                    const newDocs = [...documents];
                                                                    newDocs[index].fileUrl = "placeholder-url";
                                                                    setDocuments(newDocs);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <Label htmlFor={`doc-notes-${index}`}>Notes</Label>
                                                        <Textarea
                                                            id={`doc-notes-${index}`}
                                                            placeholder="Additional information about this document"
                                                            value={doc.notes || ''}
                                                            onChange={(e) => {
                                                                const newDocs = [...documents];
                                                                newDocs[index].notes = e.target.value;
                                                                setDocuments(newDocs);
                                                            }}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end space-x-2 pt-4">
                            {onCancel && (
                                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent" />
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {initialData?.id ? 'Update Cargo' : 'Register Cargo'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CargoForm;