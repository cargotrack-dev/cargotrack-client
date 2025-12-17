// src/features/Documents/components/DocumentManager.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../UI/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import { Badge } from '../../UI/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../UI/components/ui/table';
import {
  FileText,
  Download,
  Upload,
  Eye,
  Trash2,
  PenTool,
  Search,
  Plus
} from 'lucide-react';
import { Document, DocumentTemplate } from '../types/document';

const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    type: 'WAYBILL',
    reference: 'WB-2023-001',
    shipmentId: 'ship-001',
    fileUrl: '/files/waybill-001.pdf',
    createdAt: new Date('2023-04-10T14:30:00'),
    createdBy: 'John Doe',
    status: 'APPROVED'
  },
  {
    id: 'doc-002',
    type: 'INVOICE',
    reference: 'INV-2023-045',
    shipmentId: 'ship-002',
    fileUrl: '/files/invoice-045.pdf',
    createdAt: new Date('2023-04-12T09:15:00'),
    createdBy: 'Jane Smith',
    status: 'PENDING'
  },
  {
    id: 'doc-003',
    type: 'MANIFEST',
    reference: 'MNF-2023-022',
    shipmentId: 'ship-003',
    fileUrl: '/files/manifest-022.pdf',
    createdAt: new Date('2023-04-08T16:45:00'),
    createdBy: 'Mike Johnson',
    status: 'APPROVED'
  },
  {
    id: 'doc-004',
    type: 'CUSTOMS',
    reference: 'CST-2023-015',
    shipmentId: 'ship-002',
    fileUrl: '/files/customs-015.pdf',
    createdAt: new Date('2023-04-11T11:20:00'),
    createdBy: 'Sarah Williams',
    status: 'REJECTED'
  }
];

const mockTemplates: DocumentTemplate[] = [
  { 
    id: 'template-001', 
    name: 'Standard Waybill', 
    description: 'Default waybill template with company branding', 
    type: 'WAYBILL' 
  },
  { 
    id: 'template-002', 
    name: 'Detailed Invoice', 
    description: 'Comprehensive invoice with itemized charges', 
    type: 'INVOICE' 
  },
  { 
    id: 'template-003', 
    name: 'Cargo Manifest', 
    description: 'Complete cargo manifest for multiple items', 
    type: 'MANIFEST' 
  },
  { 
    id: 'template-004', 
    name: 'Basic Customs Form', 
    description: 'Simplified customs declaration form', 
    type: 'CUSTOMS' 
  }
];

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [templates] = useState<DocumentTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleGenerateDocument = () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        const newDocument: Document = {
          id: `doc-${Math.floor(Math.random() * 1000)}`,
          type: template.type,
          reference: `${template.type.substring(0, 3)}-2023-${Math.floor(Math.random() * 100)}`,
          shipmentId: 'ship-new',
          fileUrl: `/files/generated-${Date.now()}.pdf`,
          createdAt: new Date(),
          createdBy: 'Current User',
          status: 'DRAFT'
        };
        
        setDocuments([newDocument, ...documents]);
        setIsGenerating(false);
        setSelectedTemplate(null);
      }
    }, 1500);
  };

  const handleUploadDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newDocument: Document = {
        id: `doc-${Math.floor(Math.random() * 1000)}`,
        type: 'OTHER',
        reference: `DOC-2023-${Math.floor(Math.random() * 100)}`,
        shipmentId: 'ship-new',
        fileUrl: URL.createObjectURL(file),
        createdAt: new Date(),
        createdBy: 'Current User',
        status: 'UPLOADED'
      };
      
      setDocuments([newDocument, ...documents]);
      setIsUploading(false);
    }, 1500);
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'DRAFT':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'UPLOADED':
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Generate, upload, and manage documents</CardDescription>
            </div>
            <div className="flex space-x-2">
              <label className="cursor-pointer">
                <Input 
                  type="file" 
                  className="hidden" 
                  onChange={handleUploadDocument} 
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <div className="inline-block">
                  <Button variant="outline" disabled={isUploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </label>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedTemplate || ''}
                onChange={(e) => setSelectedTemplate(e.target.value || null)}
              >
                <option value="">Select Template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
              <Button onClick={handleGenerateDocument} disabled={!selectedTemplate || isGenerating}>
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="waybills">Waybills</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="manifests">Manifests</TabsTrigger>
                <TabsTrigger value="customs">Customs</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search documents..." 
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">All Types</option>
                  <option value="WAYBILL">Waybills</option>
                  <option value="INVOICE">Invoices</option>
                  <option value="MANIFEST">Manifests</option>
                  <option value="CUSTOMS">Customs</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell className="font-medium">{doc.reference}</TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>{doc.createdBy}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  download={doc.reference}
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No documents found. Try adjusting your search or filter criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="waybills">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter(doc => doc.type === 'WAYBILL')
                      .map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.reference}</TableCell>
                          <TableCell>{doc.shipmentId}</TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  download={doc.reference}
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Similar TabsContent blocks for invoices, manifests, customs would be here */}
            <TabsContent value="invoices">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter(doc => doc.type === 'INVOICE')
                      .map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.reference}</TableCell>
                          <TableCell>{doc.shipmentId}</TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  download={doc.reference}
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="manifests">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter(doc => doc.type === 'MANIFEST')
                      .map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.reference}</TableCell>
                          <TableCell>{doc.shipmentId}</TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  download={doc.reference}
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="customs">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter(doc => doc.type === 'CUSTOMS')
                      .map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.reference}</TableCell>
                          <TableCell>{doc.shipmentId}</TableCell>
                          <TableCell>{formatDate(doc.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(doc.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost">
                                <a 
                                  href={doc.fileUrl} 
                                  download={doc.reference}
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
          <CardDescription>Manage and customize document templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map(template => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.type}</TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <PenTool className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Use
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;