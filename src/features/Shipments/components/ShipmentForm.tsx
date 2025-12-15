// src/components/shipment/ShipmentForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
import { Badge } from '@features/UI/components/ui/badge';
import { Checkbox } from '@features/UI/components/ui/checkbox';
import {
    Cargo,
    CargoStatus
} from '@features/Cargo/types/cargo';
import {
    Shipment,
    ShipmentStatus,
    ShipmentStop,
    ShipmentDriver,
    ShipmentVehicle
} from '../types/shipment';
import {
    AlertCircle,
    Save,
    X,
    Plus,
    Trash2,
    MapPin,
    TruckIcon,
    CalendarIcon,
    User,
    Route
} from 'lucide-react';
import { Label } from '@features/UI/components/ui/label';
import CargoService from '@features/Cargo/services/CargoService';

// Mock driver and vehicle data
const mockDrivers: ShipmentDriver[] = [
    {
        id: 'driver-1',
        name: 'John Smith',
        licenseNumber: 'DL12345678',
        contactPhone: '+1-123-456-7890',
        assignment: {
            role: 'PRIMARY',
            startTime: new Date(),
        }
    },
    {
        id: 'driver-2',
        name: 'Sarah Johnson',
        licenseNumber: 'DL87654321',
        contactPhone: '+1-987-654-3210',
        assignment: {
            role: 'RELIEF',
            startTime: new Date(),
        }
    }
];

const mockVehicles: ShipmentVehicle[] = [
    {
        id: 'vehicle-1',
        type: 'TRUCK',
        make: 'Volvo',
        model: 'VNL 860',
        year: 2023,
        licensePlate: 'ABC-1234',
        vin: '4V4NC9EH4LN123456',
        status: 'AVAILABLE'
    },
    {
        id: 'vehicle-2',
        type: 'TRAILER',
        make: 'Great Dane',
        model: 'Champion',
        year: 2022,
        licensePlate: 'XYZ-7890',
        vin: '1GRAA06Y2HS123456',
        status: 'AVAILABLE'
    }
];

interface ShipmentFormProps {
    initialData?: Partial<Shipment>;
    preselectedCargoIds?: string[];
    onSubmit: (data: Shipment) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    error?: string;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({
    initialData,
    preselectedCargoIds = [],
    onSubmit,
    onCancel,
    isLoading = false,
    error
}) => {
    const [activeTab, setActiveTab] = useState('cargo');
    const [availableCargo, setAvailableCargo] = useState<Cargo[]>([]);
    const [selectedCargoIds, setSelectedCargoIds] = useState<string[]>(preselectedCargoIds);
    const [stops, setStops] = useState<ShipmentStop[]>(initialData?.stops || []);
    const [drivers, setDrivers] = useState<ShipmentDriver[]>(initialData?.drivers || []);
    const [vehicles, setVehicles] = useState<ShipmentVehicle[]>(initialData?.vehicles || []);

    // Fetch available cargo on component mount
    useEffect(() => {
        const fetchCargo = async () => {
            try {
                const cargoItems = await CargoService.getAllCargo();
                // Filter for cargo that can be shipped (not delivered, lost, etc.)
                const availableItems = cargoItems.filter(item =>
                    [CargoStatus.PENDING, CargoStatus.SCHEDULED, CargoStatus.ON_HOLD].includes(item.status)
                );
                setAvailableCargo(availableItems);
            } catch (error) {
                console.error('Error fetching cargo:', error);
            }
        };

        fetchCargo();
    }, []);

    // Create default values for form
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const defaultValues: Partial<Shipment> = {
        id: initialData?.id || '',
        reference: initialData?.reference || `SHIP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        description: initialData?.description || '',
        status: initialData?.status || ShipmentStatus.PLANNED,
        priority: initialData?.priority || 'NORMAL',
        cargoIds: initialData?.cargoIds || selectedCargoIds,
        origin: initialData?.origin || {
            name: '',
            address: '',
            city: '',
            country: '',
        },
        destination: initialData?.destination || {
            name: '',
            address: '',
            city: '',
            country: '',
        },
        stops: initialData?.stops || [],
        drivers: initialData?.drivers || [],
        vehicles: initialData?.vehicles || [],
        schedule: initialData?.schedule || {
            plannedStart: today,
            plannedEnd: tomorrow,
        },
        tracking: initialData?.tracking || {
            trackingEvents: [],
        },
        costs: initialData?.costs || {
            estimatedTotal: 0,
            currency: 'USD',
            breakdown: [],
        },
        documents: initialData?.documents || [],
        clientId: initialData?.clientId || '',
        notes: initialData?.notes || '',
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: initialData?.updatedAt || new Date(),
        createdBy: initialData?.createdBy || '',
        updatedBy: initialData?.updatedBy || ''
    };

    const form = useForm<Shipment>({
        defaultValues: defaultValues as Shipment,
    });

    // Handle form submission
    const handleSubmit = form.handleSubmit((data) => {
        // Make sure the latest stops, drivers and vehicles are included
        const submissionData = {
            ...data,
            cargoIds: selectedCargoIds,
            stops: stops,
            drivers: drivers,
            vehicles: vehicles
        };
        onSubmit(submissionData);
    });

    // Handle cargo selection
    const toggleCargoSelection = (cargoId: string) => {
        setSelectedCargoIds(prevIds => {
            if (prevIds.includes(cargoId)) {
                return prevIds.filter(id => id !== cargoId);
            } else {
                return [...prevIds, cargoId];
            }
        });
    };

    // Handle stops management
    const addStop = () => {
        const newStop: ShipmentStop = {
            id: `stop-${Date.now()}`,
            location: {
                name: '',
                address: '',
                city: '',
                country: '',
            },
            type: 'CHECKPOINT',
            scheduledArrival: new Date(),
            scheduledDeparture: new Date(),
            status: 'PENDING',
        };
        setStops([...stops, newStop]);
    };

    const removeStop = (index: number) => {
        const newStops = [...stops];
        newStops.splice(index, 1);
        setStops(newStops);
    };

    const updateStop = (index: number, updatedStop: Partial<ShipmentStop>) => {
        const newStops = [...stops];
        newStops[index] = { ...newStops[index], ...updatedStop };
        setStops(newStops);
    };

    // Handle driver assignment
    const addDriver = (driverId: string) => {
        const driver = mockDrivers.find(d => d.id === driverId);
        if (driver && !drivers.some(d => d.id === driverId)) {
            setDrivers([...drivers, driver]);
        }
    };

    const removeDriver = (driverId: string) => {
        setDrivers(drivers.filter(d => d.id !== driverId));
    };

    // Handle vehicle assignment
    const addVehicle = (vehicleId: string) => {
        const vehicle = mockVehicles.find(v => v.id === vehicleId);
        if (vehicle && !vehicles.some(v => v.id === vehicleId)) {
            setVehicles([...vehicles, vehicle]);
        }
    };

    const removeVehicle = (vehicleId: string) => {
        setVehicles(vehicles.filter(v => v.id !== vehicleId));
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {initialData?.id ? 'Edit Shipment' : 'Create New Shipment'}
                </CardTitle>
                <CardDescription>
                    Plan and schedule a cargo shipment
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="reference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shipment Reference *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., SHIP-2025-001" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Unique reference number for this shipment
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                                {Object.values(ShipmentStatus).map(status => (
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

                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="NORMAL">Normal</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the shipment details"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-4 mb-8">
                                <TabsTrigger value="cargo">Cargo</TabsTrigger>
                                <TabsTrigger value="route">Route & Schedule</TabsTrigger>
                                <TabsTrigger value="resources">Drivers & Vehicles</TabsTrigger>
                                <TabsTrigger value="costs">Costs</TabsTrigger>
                            </TabsList>

                            {/* Cargo Tab */}
                            <TabsContent value="cargo" className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Selected Cargo Items</h3>
                                    <Badge variant="outline">{selectedCargoIds.length} items selected</Badge>
                                </div>

                                {availableCargo.length === 0 ? (
                                    <div className="text-center p-8 border border-dashed rounded-md">
                                        <p className="text-sm text-gray-500">Loading available cargo...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {availableCargo.map(cargo => (
                                            <div
                                                key={cargo.id}
                                                className={`p-4 border rounded-md ${selectedCargoIds.includes(cargo.id)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`cargo-${cargo.id}`}
                                                            checked={selectedCargoIds.includes(cargo.id)}
                                                            onCheckedChange={() => toggleCargoSelection(cargo.id)}
                                                        />
                                                        <Label
                                                            htmlFor={`cargo-${cargo.id}`}
                                                            className="font-medium cursor-pointer"
                                                        >
                                                            {cargo.reference}
                                                        </Label>
                                                        <Badge>{cargo.status}</Badge>
                                                    </div>
                                                    <Badge variant="outline">{cargo.type}</Badge>
                                                </div>
                                                <p className="ml-6 mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {cargo.description}
                                                </p>
                                                <div className="ml-6 mt-2 flex items-center justify-between text-sm">
                                                    <span>{cargo.quantity} {cargo.quantityUnit}</span>
                                                    <span>
                                                        {cargo.weight.gross} {cargo.weight.unit}
                                                    </span>
                                                    <span>
                                                        Value: {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: cargo.value.currency
                                                        }).format(cargo.value.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedCargoIds.length === 0 && (
                                    <Alert>
                                        <AlertDescription>
                                            Please select at least one cargo item for this shipment.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </TabsContent>

                            {/* Route & Schedule Tab */}
                            <TabsContent value="route" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium flex items-center">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Origin
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="origin.name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Warehouse A" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="origin.address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Street address" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="origin.city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="City" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="origin.state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State/Province</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="State/Province" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="origin.country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Country" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium flex items-center">
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Destination
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="destination.name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Client Facility" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="destination.address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Street address" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="destination.city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="City" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="destination.state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State/Province</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="State/Province" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="destination.country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Country" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium flex items-center">
                                            <Route className="mr-2 h-5 w-5" />
                                            Stops & Waypoints
                                        </h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addStop}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Stop
                                        </Button>
                                    </div>

                                    {stops.length === 0 ? (
                                        <div className="text-center p-6 border border-dashed rounded-md">
                                            <p className="text-sm text-gray-500">
                                                No additional stops defined. Click "Add Stop" to add waypoints between origin and destination.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {stops.map((stop, index) => (
                                                <Card key={stop.id} className="relative">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => removeStop(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                    <CardContent className="p-4">
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <Label>Stop Type</Label>
                                                                <Select
                                                                    value={stop.type}
                                                                    onValueChange={(value: "PICKUP" | "DELIVERY" | "REST" | "CHECKPOINT" | "BORDER_CROSSING" | "FUEL" | "OTHER") => updateStop(index, { type: value })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="PICKUP">Pickup</SelectItem>
                                                                        <SelectItem value="DELIVERY">Delivery</SelectItem>
                                                                        <SelectItem value="REST">Rest Stop</SelectItem>
                                                                        <SelectItem value="CHECKPOINT">Checkpoint</SelectItem>
                                                                        <SelectItem value="BORDER_CROSSING">Border Crossing</SelectItem>
                                                                        <SelectItem value="FUEL">Fuel</SelectItem>
                                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label>Status</Label>
                                                                <Select
                                                                    value={stop.status}
                                                                    onValueChange={(value: "PENDING" | "ARRIVED" | "COMPLETED" | "SKIPPED" | "CANCELLED") => updateStop(index, { status: value })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                                        <SelectItem value="ARRIVED">Arrived</SelectItem>
                                                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                                                        <SelectItem value="SKIPPED">Skipped</SelectItem>
                                                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div>
                                                                <Label>Location Name</Label>
                                                                <Input
                                                                    value={stop.location.name || ''}
                                                                    onChange={(e) => updateStop(index, {
                                                                        location: { ...stop.location, name: e.target.value }
                                                                    })}
                                                                    placeholder="Enter location name"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Address</Label>
                                                                    <Input
                                                                        value={stop.location.address || ''}
                                                                        onChange={(e) => updateStop(index, {
                                                                            location: { ...stop.location, address: e.target.value }
                                                                        })}
                                                                        placeholder="Street address"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>City</Label>
                                                                    <Input
                                                                        value={stop.location.city || ''}
                                                                        onChange={(e) => updateStop(index, {
                                                                            location: { ...stop.location, city: e.target.value }
                                                                        })}
                                                                        placeholder="City"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Scheduled Arrival</Label>
                                                                    <Input
                                                                        type="datetime-local"
                                                                        value={stop.scheduledArrival instanceof Date
                                                                            ? stop.scheduledArrival.toISOString().slice(0, 16)
                                                                            : ''}
                                                                        onChange={(e) => updateStop(index, {
                                                                            scheduledArrival: new Date(e.target.value)
                                                                        })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Scheduled Departure</Label>
                                                                    <Input
                                                                        type="datetime-local"
                                                                        value={stop.scheduledDeparture instanceof Date
                                                                            ? stop.scheduledDeparture.toISOString().slice(0, 16)
                                                                            : ''}
                                                                        onChange={(e) => updateStop(index, {
                                                                            scheduledDeparture: new Date(e.target.value)
                                                                        })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium flex items-center">
                                        <CalendarIcon className="mr-2 h-5 w-5" />
                                        Schedule
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="schedule.plannedStart"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Planned Start Date *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            {...field}
                                                            value={field.value instanceof Date
                                                                ? field.value.toISOString().slice(0, 16)
                                                                : ''}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="schedule.plannedEnd"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Planned End Date *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            {...field}
                                                            value={field.value instanceof Date
                                                                ? field.value.toISOString().slice(0, 16)
                                                                : ''}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Drivers & Vehicles Tab */}
                            <TabsContent value="resources" className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium flex items-center">
                                            <User className="mr-2 h-5 w-5" />
                                            Assigned Drivers
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Available Drivers</Label>
                                            <Select
                                                onValueChange={addDriver}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select driver" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockDrivers
                                                        .filter(driver => !drivers.some(d => d.id === driver.id))
                                                        .map(driver => (
                                                            <SelectItem key={driver.id} value={driver.id}>
                                                                {driver.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            {drivers.length === 0 ? (
                                                <div className="border border-dashed rounded-md p-4 text-center">
                                                    <p className="text-sm text-gray-500">No drivers assigned</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label>Assigned Drivers</Label>
                                                    {drivers.map(driver => (
                                                        <div
                                                            key={driver.id}
                                                            className="flex items-center justify-between border rounded-md p-2"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{driver.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {driver.assignment.role} • License: {driver.licenseNumber}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeDriver(driver.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium flex items-center">
                                            <TruckIcon className="mr-2 h-5 w-5" />
                                            Assigned Vehicles
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Available Vehicles</Label>
                                            <Select
                                                onValueChange={addVehicle}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select vehicle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockVehicles
                                                        .filter(vehicle => !vehicles.some(v => v.id === vehicle.id))
                                                        .map(vehicle => (
                                                            <SelectItem key={vehicle.id} value={vehicle.id}>
                                                                {vehicle.type}: {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            {vehicles.length === 0 ? (
                                                <div className="border border-dashed rounded-md p-4 text-center">
                                                    <p className="text-sm text-gray-500">No vehicles assigned</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label>Assigned Vehicles</Label>
                                                    {vehicles.map(vehicle => (
                                                        <div
                                                            key={vehicle.id}
                                                            className="flex items-center justify-between border rounded-md p-2"
                                                        >
                                                            <div>
                                                                <p className="font-medium">
                                                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {vehicle.type} • {vehicle.licensePlate} • VIN: {vehicle.vin.slice(-6)}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeVehicle(vehicle.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Costs Tab */}
                            <TabsContent value="costs" className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Estimated Costs</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="costs.estimatedTotal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Estimated Total Cost</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="0.00"
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
                                            name="costs.currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
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

                                    <Separator />

                                    <div className="space-y-2">
                                        <h4 className="text-md font-medium">Cost Breakdown</h4>
                                        <p className="text-sm text-gray-500">
                                            Detailed cost tracking will be available after the shipment is created.
                                        </p>

                                        <div className="p-4 border rounded-md space-y-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label>Cost Category</Label>
                                                    <Select defaultValue="FUEL">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="FUEL">Fuel</SelectItem>
                                                            <SelectItem value="TOLLS">Tolls</SelectItem>
                                                            <SelectItem value="DRIVER_PAY">Driver Pay</SelectItem>
                                                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                                            <SelectItem value="PERMITS">Permits</SelectItem>
                                                            <SelectItem value="OTHER">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Estimated Amount</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        disabled
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <Input placeholder="Cost description" disabled />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Cost Item
                                                </Button>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Cost breakdown functionality will be enabled after shipment creation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter any additional information or special instructions"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            {onCancel && (
                                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={isLoading || selectedCargoIds.length === 0}>
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent" />
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {initialData?.id ? 'Update Shipment' : 'Create Shipment'}
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

export default ShipmentForm;