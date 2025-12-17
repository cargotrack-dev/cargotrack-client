// src/components/cargo/CargoDetails.tsx
import React from 'react';
import { 
  Cargo, 
  CargoStatus, 
  HazardClass
} from '../types/cargo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../UI/components/ui/card';
import { Badge } from '../../UI/components/ui/badge';
import { Button } from '../../UI/components/ui/button';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Info, 
  Ruler, 
  Package, 
  Tag, 
  AlertTriangle, 
  ShieldAlert, 
  TruckIcon,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../UI/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../UI/components/ui/table';
import { Separator } from '../../UI/components/ui/separator';
import { format } from 'date-fns';

interface CargoDetailsProps {
  cargo: Cargo;
  onBack: () => void;
  onEdit: (id: string) => void;
  onCreateShipment: (id: string) => void;
}

// Helper function to get status badge variant
const getStatusBadge = (status: CargoStatus) => {
  switch (status) {
    case CargoStatus.PENDING:
      return <Badge variant="outline">{status}</Badge>;
    case CargoStatus.SCHEDULED:
      return <Badge variant="secondary">{status}</Badge>;
    case CargoStatus.IN_TRANSIT:
      return <Badge variant="default" className="bg-blue-500">{status}</Badge>;
    case CargoStatus.DELIVERED:
      return <Badge variant="default" className="bg-green-500">{status}</Badge>;
    case CargoStatus.RETURNED:
      return <Badge variant="destructive">{status}</Badge>;
    case CargoStatus.DAMAGED:
      return <Badge variant="destructive">{status}</Badge>;
    case CargoStatus.LOST:
      return <Badge variant="destructive">{status}</Badge>;
    case CargoStatus.ON_HOLD:
      return <Badge variant="warning" className="bg-amber-500 text-white">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Helper function to format document type
const formatDocType = (type: string): string => {
  switch (type) {
    case 'BOL': return 'Bill of Lading';
    case 'CMR': return 'CMR Transport Document';
    case 'INVOICE': return 'Commercial Invoice';
    case 'PERMIT': return 'Permit/License';
    case 'CUSTOMS': return 'Customs Declaration';
    case 'CERTIFICATE': return 'Certificate';
    case 'OTHER': return 'Other Document';
    default: return type;
  }
};

const CargoDetails: React.FC<CargoDetailsProps> = ({
  cargo,
  onBack,
  onEdit,
  onCreateShipment
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cargo List
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => onEdit(cargo.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={() => onCreateShipment(cargo.id)}>
            <TruckIcon className="mr-2 h-4 w-4" />
            Create Shipment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Content - Left Column */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <Package className="h-6 w-6 mr-2 text-primary" />
                    {cargo.reference}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Created {format(new Date(cargo.createdAt), 'PP')} by {cargo.createdBy}
                  </CardDescription>
                </div>
                <div>
                  {getStatusBadge(cargo.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line mb-4">{cargo.description}</p>
              
              {cargo.tags && cargo.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {cargo.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="dimensions">Dimensions & Weight</TabsTrigger>
                  <TabsTrigger value="handling">Handling Instructions</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Cargo Type</p>
                      <Badge variant="outline">
                        {cargo.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Client ID</p>
                      <p className="font-medium">{cargo.clientId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{cargo.quantity} {cargo.quantityUnit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: cargo.value.currency
                        }).format(cargo.value.amount)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Hazard Class</p>
                      <div>
                        {cargo.hazardClass === HazardClass.NONE ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            Non-Hazardous
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {cargo.hazardClass.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {cargo.hazardClass !== HazardClass.NONE && cargo.hazardDetails && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Hazard Details</p>
                        <p className="font-medium">{cargo.hazardDetails}</p>
                      </div>
                    )}
                  </div>
                  
                  {cargo.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="whitespace-pre-line text-gray-700 p-3 bg-gray-50 rounded-md">
                        {cargo.notes}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="dimensions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                        Dimensions
                      </h4>
                      <Separator className="my-2" />
                    </div>
                    {cargo.dimensions && (
                      <>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Length</p>
                          <p className="font-medium">{cargo.dimensions.length} {cargo.dimensions.unit}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Width</p>
                          <p className="font-medium">{cargo.dimensions.width} {cargo.dimensions.unit}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Height</p>
                          <p className="font-medium">{cargo.dimensions.height} {cargo.dimensions.unit}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Volume</p>
                          <p className="font-medium">
                            {(cargo.dimensions.length * cargo.dimensions.width * cargo.dimensions.height).toFixed(2)} {cargo.dimensions.unit}³
                          </p>
                        </div>
                      </>
                    )}
                    <div className="col-span-2 mt-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Package className="h-4 w-4 mr-1 text-gray-500" />
                        Weight
                      </h4>
                      <Separator className="my-2" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Gross Weight</p>
                      <p className="font-medium">{cargo.weight.gross} {cargo.weight.unit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Net Weight</p>
                      <p className="font-medium">{cargo.weight.net} {cargo.weight.unit}</p>
                    </div>
                    {cargo.weight.tare > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Tare Weight</p>
                        <p className="font-medium">{cargo.weight.tare} {cargo.weight.unit}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="handling" className="space-y-4">
                  {cargo.handlingInstructions ? (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="col-span-2">
                        <div className="flex items-center">
                          {cargo.handlingInstructions.fragile && (
                            <Badge className="mr-2 bg-red-100 text-red-800 border-red-300">
                              Fragile
                            </Badge>
                          )}
                          {cargo.handlingInstructions.orientationRequired && (
                            <Badge className="mr-2 bg-amber-100 text-amber-800 border-amber-300">
                              Specific Orientation Required
                            </Badge>
                          )}
                          {cargo.handlingInstructions.stackable === false && (
                            <Badge className="mr-2 bg-amber-100 text-amber-800 border-amber-300">
                              Not Stackable
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {cargo.handlingInstructions.temperatureRange && (
                        (cargo.handlingInstructions.temperatureRange.min !== 0 || 
                         cargo.handlingInstructions.temperatureRange.max !== 0) && (
                          <>
                            <div className="col-span-2 mt-2">
                              <h4 className="text-sm font-medium">Temperature Requirements</h4>
                              <Separator className="my-2" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Temperature Range</p>
                              <p className="font-medium">
                                {cargo.handlingInstructions.temperatureRange.min}° to {cargo.handlingInstructions.temperatureRange.max}° 
                                {cargo.handlingInstructions.temperatureRange.unit}
                              </p>
                            </div>
                          </>
                        )
                      )}
                      
                      {cargo.handlingInstructions.customInstructions && (
                        <div className="col-span-2 mt-4">
                          <p className="text-sm text-gray-500 mb-1">Special Instructions</p>
                          <div className="p-3 bg-gray-50 rounded-md whitespace-pre-line">
                            {cargo.handlingInstructions.customInstructions}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Info className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No special handling instructions</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="documents">
                  {cargo.documents && cargo.documents.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cargo.documents.map((doc, index) => (
                            <TableRow key={doc.id || index}>
                              <TableCell className="font-medium">
                                {formatDocType(doc.type)}
                              </TableCell>
                              <TableCell>{doc.reference}</TableCell>
                              <TableCell>
                                {format(new Date(doc.issueDate), 'PP')}
                              </TableCell>
                              <TableCell>
                                {doc.fileUrl ? (
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <a 
                                        href={doc.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                      >
                                        <ExternalLink className="h-4 w-4 mr-1" /> View
                                      </a>
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <a 
                                        href={doc.fileUrl} 
                                        download
                                        className="flex items-center"
                                      >
                                        <Download className="h-4 w-4 mr-1" /> Download
                                      </a>
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm italic">No file attached</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No documents attached</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current Status</span>
                <span>{getStatusBadge(cargo.status)}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm">
                    {format(new Date(cargo.createdAt), 'PP')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm">
                    {format(new Date(cargo.updatedAt), 'PP')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created By</span>
                  <span className="text-sm">{cargo.createdBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Updated By</span>
                  <span className="text-sm">{cargo.updatedBy}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hazard Information Card (if applicable) */}
          {cargo.hazardClass !== HazardClass.NONE && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-700 flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-red-700" />
                  Hazardous Material
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-900">
                <p className="text-sm mb-2">
                  <span className="font-semibold">Classification:</span> {cargo.hazardClass.replace('_', ' ')}
                </p>
                {cargo.hazardDetails && (
                  <p className="text-sm">
                    <span className="font-semibold">Details:</span> {cargo.hazardDetails}
                  </p>
                )}
                <div className="mt-4 p-2 bg-red-100 rounded-md text-xs text-red-800">
                  <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                  Special handling and documentation required for transport.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Associated Shipments (would be implemented in a real app) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Associated Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <TruckIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No associated shipments</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => onCreateShipment(cargo.id)}
                >
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Create Shipment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline (would be implemented in a real app) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="h-full w-px bg-gray-200" />
                  </div>
                  <div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Cargo Registered</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {format(new Date(cargo.createdAt), 'PP')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Created by {cargo.createdBy}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <Edit className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Cargo Updated</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {format(new Date(cargo.updatedAt), 'PP')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Updated by {cargo.updatedBy}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CargoDetails;