// src/features/Settings/pages/Settings.tsx
import { FC, useState } from 'react';
import {
  Upload,
  CopyIcon,
  PlusCircleIcon,
  Loader2Icon,
  Trash,
  CheckCircle,
  Globe
} from 'lucide-react';

import { Button } from '@features/UI/components/ui/button';
import { Input } from '@features/UI/components/ui/input';
import { Label } from '@features/UI/components/ui/label';
import { Textarea } from '@features/UI/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@features/UI/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@features/UI/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@features/UI/components/ui/card';
import { Checkbox } from '@features/UI/components/ui/checkbox';
import { Badge } from '@features/UI/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@features/UI/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@features/UI/components/ui/table';

// Types
interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  created: string;
}

interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  logo: string;
  currency: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  language: string;
  units: 'imperial' | 'metric';
}

interface InvoiceSettings {
  prefix: string;
  startNumber: number;
  dueDays: number;
  terms: string;
  notes: string;
  logo: boolean;
  showTaxId: boolean;
  digitalSignature: boolean;
}

interface MaintenanceSettings {
  alertDays: number;
  maintenanceInterval: {
    mileage: number;
    days: number;
  };
  requiredChecks: {
    oilChange: boolean;
    tireRotation: boolean;
    brakeInspection: boolean;
    fluidLevels: boolean;
    lightsInspection: boolean;
    filterReplacement: boolean;
  };
}

// Initial mock data
const initialApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'ct_prod_8a7sd6f7a6sd87f6as8d7f6',
    created: '2023-05-15T10:30:00Z',
    lastUsed: '2023-08-10T14:22:45Z',
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'ct_dev_9a8s7df6a8s7df68a7sdf68',
    created: '2023-06-20T08:15:30Z',
    lastUsed: '2023-08-11T09:45:12Z',
  }
];

const initialWebhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://example.com/webhooks/cargotrack',
    events: ['shipment.created', 'shipment.updated', 'shipment.delivered'],
    status: 'active',
    created: '2023-06-15T11:30:00Z',
  }
];

const initialCompanySettings: CompanySettings = {
  name: 'CargoTrack Logistics LLC',
  address: '123 Transportation Blvd, Logistics City, LC 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@cargotracklogistics.com',
  taxId: 'TAX-12345678',
  logo: '/company-logo.png',
  currency: 'USD',
  timeZone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  language: 'en-US',
  units: 'imperial'
};

const initialInvoiceSettings: InvoiceSettings = {
  prefix: 'INV',
  startNumber: 1001,
  dueDays: 30,
  terms: 'Payment is due within 30 days of invoice date.',
  notes: 'Thank you for your business!',
  logo: true,
  showTaxId: true,
  digitalSignature: true
};

const initialMaintenanceSettings: MaintenanceSettings = {
  alertDays: 7,
  maintenanceInterval: {
    mileage: 5000,
    days: 90
  },
  requiredChecks: {
    oilChange: true,
    tireRotation: true,
    brakeInspection: true,
    fluidLevels: true,
    lightsInspection: true,
    filterReplacement: true
  }
};

// Component
const Settings: FC = () => {
  // State Management
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(initialCompanySettings);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(initialInvoiceSettings);
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>(initialMaintenanceSettings);
  
  const [newWebhook, setNewWebhook] = useState<{ url: string; events: string[] }>({
    url: '',
    events: []
  });

  // Handlers
  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const toggleWebhookStatus = (id: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id 
        ? { ...webhook, status: webhook.status === 'active' ? 'inactive' : 'active' }
        : webhook
    ));
  };

  const handleWebhookDelete = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
  };

  const handleApiKeyDelete = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const generateApiKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: `API Key ${apiKeys.length + 1}`,
      key: `ct_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      lastUsed: null
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleAddWebhook = () => {
    if (newWebhook.url && newWebhook.events.length > 0) {
      const webhook: Webhook = {
        id: `webhook-${Date.now()}`,
        url: newWebhook.url,
        events: newWebhook.events,
        status: 'active',
        created: new Date().toISOString()
      };
      setWebhooks([...webhooks, webhook]);
      setNewWebhook({ url: '', events: [] });
    }
  };

  // Render Functions
  // ... [Previous render functions: renderCompanySettings, renderInvoiceSettings, renderMaintenanceSettings, etc.]
  // Utility functions
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Render functions
  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative h-24 w-24 rounded-md border border-gray-200 p-1">
          <img
            src={companySettings.logo || '/placeholder-logo.png'}
            alt="Company Logo"
            className="h-full w-full object-contain"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-3 -right-3 h-8 w-8 rounded-full p-0"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload Logo</span>
          </Button>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">Company Logo</h3>
          <p className="text-sm text-gray-500">
            Upload your company logo. Recommended size: 200x200px, max 1MB.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            value={companySettings.name}
            onChange={(e) =>
              setCompanySettings({
                ...companySettings,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
          <Input
            id="tax-id"
            value={companySettings.taxId}
            onChange={(e) =>
              setCompanySettings({
                ...companySettings,
                taxId: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={companySettings.address}
            onChange={(e) =>
              setCompanySettings({
                ...companySettings,
                address: e.target.value,
              })
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={companySettings.phone}
            onChange={(e) =>
              setCompanySettings({
                ...companySettings,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={companySettings.email}
            onChange={(e) =>
              setCompanySettings({
                ...companySettings,
                email: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={companySettings.currency}
            onValueChange={(value) =>
              setCompanySettings({
                ...companySettings,
                currency: value,
              })
            }
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">US Dollar (USD)</SelectItem>
              <SelectItem value="EUR">Euro (EUR)</SelectItem>
              <SelectItem value="GBP">British Pound (GBP)</SelectItem>
              <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Time Zone</Label>
          <Select
            value={companySettings.timeZone}
            onValueChange={(value) =>
              setCompanySettings({
                ...companySettings,
                timeZone: value,
              })
            }
          >
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={companySettings.language}
            onValueChange={(value) =>
              setCompanySettings({
                ...companySettings,
                language: value,
              })
            }
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Units</Label>
          <RadioGroup
            value={companySettings.units}
            onValueChange={(value: 'imperial' | 'metric') =>
              setCompanySettings({
                ...companySettings,
                units: value,
              })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="imperial" id="imperial" />
              <Label htmlFor="imperial">Imperial (mi, lb)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metric" id="metric" />
              <Label htmlFor="metric">Metric (km, kg)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  const renderInvoiceSettings = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
          <Input
            id="invoice-prefix"
            value={invoiceSettings.prefix}
            onChange={(e) =>
              setInvoiceSettings({
                ...invoiceSettings,
                prefix: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-number">Starting Number</Label>
          <Input
            id="start-number"
            type="number"
            min="1"
            value={invoiceSettings.startNumber}
            onChange={(e) =>
              setInvoiceSettings({
                ...invoiceSettings,
                startNumber: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due-days">Payment Due Days</Label>
          <Input
            id="due-days"
            type="number"
            min="0"
            max="90"
            value={invoiceSettings.dueDays}
            onChange={(e) =>
              setInvoiceSettings({
                ...invoiceSettings,
                dueDays: parseInt(e.target.value) || 30,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-terms">Terms and Conditions</Label>
        <Textarea
          id="invoice-terms"
          value={invoiceSettings.terms}
          onChange={(e) =>
            setInvoiceSettings({
              ...invoiceSettings,
              terms: e.target.value,
            })
          }
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-notes">Default Notes</Label>
        <Textarea
          id="invoice-notes"
          value={invoiceSettings.notes}
          onChange={(e) =>
            setInvoiceSettings({
              ...invoiceSettings,
              notes: e.target.value,
            })
          }
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-logo"
            checked={invoiceSettings.logo}
            onCheckedChange={(checked) =>
              setInvoiceSettings({
                ...invoiceSettings,
                logo: checked === true,
              })
            }
          />
          <Label htmlFor="show-logo">Display company logo on invoices</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-tax-id"
            checked={invoiceSettings.showTaxId}
            onCheckedChange={(checked) =>
              setInvoiceSettings({
                ...invoiceSettings,
                showTaxId: checked === true,
              })
            }
          />
          <Label htmlFor="show-tax-id">Show Tax ID / VAT number</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="digital-signature"
            checked={invoiceSettings.digitalSignature}
            onCheckedChange={(checked) =>
              setInvoiceSettings({
                ...invoiceSettings,
                digitalSignature: checked === true,
              })
            }
          />
          <Label htmlFor="digital-signature">Enable digital signatures</Label>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Maintenance Alerts</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alert-days">Alert Days Before Due</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="alert-days"
                type="number"
                min="1"
                max="30"
                value={maintenanceSettings.alertDays}
                onChange={(e) =>
                  setMaintenanceSettings({
                    ...maintenanceSettings,
                    alertDays: parseInt(e.target.value) || 7,
                  })
                }
                className="w-24"
              />
              <span className="text-sm text-gray-500">days</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Maintenance Intervals</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maintenance-mileage">Mileage Interval</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="maintenance-mileage"
                type="number"
                min="1000"
                step="1000"
                value={maintenanceSettings.maintenanceInterval.mileage}
                onChange={(e) =>
                  setMaintenanceSettings({
                    ...maintenanceSettings,
                    maintenanceInterval: {
                      ...maintenanceSettings.maintenanceInterval,
                      mileage: parseInt(e.target.value) || 5000,
                    },
                  })
                }
              />
              <span className="text-sm text-gray-500">
                {companySettings.units === 'imperial' ? 'miles' : 'km'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance-days">Time Interval</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="maintenance-days"
                type="number"
                min="30"
                max="365"
                value={maintenanceSettings.maintenanceInterval.days}
                onChange={(e) =>
                  setMaintenanceSettings({
                    ...maintenanceSettings,
                    maintenanceInterval: {
                      ...maintenanceSettings.maintenanceInterval,
                      days: parseInt(e.target.value) || 90,
                    },
                  })
                }
              />
              <span className="text-sm text-gray-500">days</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Required Maintenance Checks</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {Object.entries(maintenanceSettings.requiredChecks).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`check-${key}`}
                checked={value}
                onCheckedChange={(checked) =>
                  setMaintenanceSettings({
                    ...maintenanceSettings,
                    requiredChecks: {
                      ...maintenanceSettings.requiredChecks,
                      [key]: checked === true,
                    },
                  })
                }
              />
              <Label htmlFor={`check-${key}`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">
                  {apiKey.name}
                </TableCell>
                <TableCell>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {apiKey.key.substring(0, 8)}...
                  </code>
                </TableCell>
                <TableCell>
                  {formatDate(apiKey.created)}
                </TableCell>
                <TableCell>
                  {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey.key);
                      }}
                    >
                      <CopyIcon className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApiKeyDelete(apiKey.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={generateApiKey}>
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        Generate New API Key
      </Button>
    </div>
  );

  const renderWebhookSettings = () => (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endpoint URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium">
                  {webhook.url}
                </TableCell>
                <TableCell>
                  {webhook.events.join(', ')}
                </TableCell>
                <TableCell>
                  <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                    {webhook.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWebhookStatus(webhook.id)}
                    >
                      {webhook.status === 'active' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {webhook.status === 'active' ? 'Disable' : 'Enable'}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWebhookDelete(webhook.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Endpoint URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhooks/cargotrack"
                value={newWebhook.url}
                onChange={(e) =>
                  setNewWebhook({
                    ...newWebhook,
                    url: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Events to Subscribe</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  'shipment.created',
                  'shipment.updated',
                  'shipment.delivered',
                  'invoice.created',
                  'invoice.paid',
                  'invoice.overdue',
                ].map((event) => (
                  <div
                    key={event}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`event-${event}`}
                      checked={newWebhook.events.includes(event)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, event],
                          });
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter(
                              (e) => e !== event
                            ),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`event-${event}`}>{event}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddWebhook}
              disabled={!newWebhook.url || newWebhook.events.length === 0}
            >
              Add Webhook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Manage your company details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCompanySettings()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Settings Tab */}
          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>
                  Configure how your invoices are generated and displayed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderInvoiceSettings()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Settings Tab */}
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Settings</CardTitle>
                <CardDescription>
                  Configure maintenance schedules and alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderMaintenanceSettings()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for programmatic access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderApiSettings()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhook Settings Tab */}
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configure webhooks to receive real-time notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderWebhookSettings()}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Save Settings Button */}
      <div className="mt-6 flex items-center justify-end space-x-4">
        <Button variant="outline" disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        {showSuccess && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="mr-1 h-4 w-4" />
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;