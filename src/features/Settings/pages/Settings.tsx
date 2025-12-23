// src/features/Settings/pages/Settings.tsx
// 🌟 PREMIUM INVESTOR-READY SETTINGS - All Elements Beautifully Styled

import { FC, useState, useRef } from 'react'
import {
  Upload,
  CopyIcon,
  PlusCircleIcon,
  Loader2Icon,
  Trash2,
  CheckCircle,
  Globe,
  Cog,
  FileText,
  Wrench,
  Code2,
  Webhook,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'

import { Button } from '../../UI/components/ui/button'
import { Input } from '../../UI/components/ui/input'
import { Label } from '../../UI/components/ui/label'
import { Textarea } from '../../UI/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '../../UI/components/ui/radio-group'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../UI/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../UI/components/ui/card'
import { Checkbox } from '../../UI/components/ui/checkbox'
import { Badge } from '../../UI/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../UI/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../UI/components/ui/table'

// ✅ PREMIUM COLOR & STYLE DEFINITIONS
const CATEGORY_CONFIG = {
  general: {
    icon: <Cog className="h-6 w-6" />,
    title: 'General',
    desc: 'Basic settings',
    lightBg: '#e0f2fe',
    mediumBg: '#cffafe',
    darkBg: '#a5f3fc',
    accentColor: '#06B6D4',
    accentDark: '#0891b2',
    borderColor: '#a5f3fc',
  },
  invoice: {
    icon: <FileText className="h-6 w-6" />,
    title: 'Billing',
    desc: 'Billing settings',
    lightBg: '#fef3c7',
    mediumBg: '#fed7aa',
    darkBg: '#fdba74',
    accentColor: '#F59E0B',
    accentDark: '#d97706',
    borderColor: '#fed7aa',
  },
  maintenance: {
    icon: <Wrench className="h-6 w-6" />,
    title: 'Maintenance',
    desc: 'Maintenance settings',
    lightBg: '#d1fae5',
    mediumBg: '#a7f3d0',
    darkBg: '#6ee7b7',
    accentColor: '#10B981',
    accentDark: '#059669',
    borderColor: '#a7f3d0',
  },
  api: {
    icon: <Code2 className="h-6 w-6" />,
    title: 'API',
    desc: 'API management',
    lightBg: '#ede9fe',
    mediumBg: '#ddd6fe',
    darkBg: '#c4b5fd',
    accentColor: '#A855F7',
    accentDark: '#7e22ce',
    borderColor: '#ddd6fe',
  },
  webhooks: {
    icon: <Webhook className="h-6 w-6" />,
    title: 'Webhooks',
    desc: 'Webhook config',
    lightBg: '#fce7f3',
    mediumBg: '#fbcfe8',
    darkBg: '#f8a5d4',
    accentColor: '#EC4899',
    accentDark: '#be185d',
    borderColor: '#fbcfe8',
  }
} as const

// Types
interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
}

interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
  created: string
}

interface CompanySettings {
  name: string
  address: string
  phone: string
  email: string
  taxId: string
  logo: string
  currency: string
  timeZone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  language: string
  units: 'imperial' | 'metric'
}

interface InvoiceSettings {
  prefix: string
  startNumber: number
  dueDays: number
  terms: string
  notes: string
  logo: boolean
  showTaxId: boolean
  digitalSignature: boolean
}

interface MaintenanceSettings {
  alertDays: number
  maintenanceInterval: {
    mileage: number
    days: number
  }
  requiredChecks: {
    oilChange: boolean
    tireRotation: boolean
    brakeInspection: boolean
    fluidLevels: boolean
    lightsInspection: boolean
    filterReplacement: boolean
  }
}

// Initial data
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
]

const initialWebhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://example.com/webhooks/cargotrack',
    events: ['shipment.created', 'shipment.updated', 'shipment.delivered'],
    status: 'active',
    created: '2023-06-15T11:30:00Z',
  }
]

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
}

const initialInvoiceSettings: InvoiceSettings = {
  prefix: 'INV',
  startNumber: 1001,
  dueDays: 30,
  terms: 'Payment is due within 30 days of invoice date.',
  notes: 'Thank you for your business!',
  logo: true,
  showTaxId: true,
  digitalSignature: true
}

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
}

// Main Component
const Settings: FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [activeCategory, setActiveCategory] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks)
  const [companySettings, setCompanySettings] = useState<CompanySettings>(initialCompanySettings)
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(initialInvoiceSettings)
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>(initialMaintenanceSettings)
  
  const [newWebhook, setNewWebhook] = useState<{ url: string; events: string[] }>({
    url: '',
    events: []
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCategoryClick = (tabValue: string) => {
    setActiveCategory(tabValue)
    setActiveTab(tabValue)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setCompanySettings({ ...companySettings, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const toggleWebhookStatus = (id: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id 
        ? { ...webhook, status: webhook.status === 'active' ? 'inactive' : 'active' }
        : webhook
    ))
  }

  const handleWebhookDelete = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id))
  }

  const handleApiKeyDelete = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
  }

  const generateApiKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: `API Key ${apiKeys.length + 1}`,
      key: `ct_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString(),
      lastUsed: null
    }
    setApiKeys([...apiKeys, newKey])
  }

  const handleAddWebhook = () => {
    if (newWebhook.url && newWebhook.events.length > 0) {
      const webhook: Webhook = {
        id: `webhook-${Date.now()}`,
        url: newWebhook.url,
        events: newWebhook.events,
        status: 'active',
        created: new Date().toISOString()
      }
      setWebhooks([...webhooks, webhook])
      setNewWebhook({ url: '', events: [] })
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  // ✅ PREMIUM CATEGORY CARD
  const renderCategoryCard = (id: keyof typeof CATEGORY_CONFIG) => {
    const isActive = activeCategory === id
    const config = CATEGORY_CONFIG[id]
    
    const cardStyle: React.CSSProperties = {
      border: `2px solid ${isActive ? config.accentColor : '#e5e7eb'}`,
      backgroundColor: isActive ? config.mediumBg : config.lightBg,
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isActive ? `0 20px 45px -5px rgba(0, 0, 0, 0.15)` : '0 2px 8px rgba(0, 0, 0, 0.06)',
      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
    }

    return (
      <button
        key={id}
        onClick={() => handleCategoryClick(id)}
        style={cardStyle}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = config.mediumBg;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = config.lightBg;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: config.accentColor, marginBottom: '12px', display: 'flex' }}>
              {config.icon}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '0 0 6px 0' }}>
              {config.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              {config.desc}
            </p>
          </div>
          {isActive && (
            <ChevronRight style={{ color: config.accentColor, opacity: 0.8, flexShrink: 0, marginTop: '2px' }} />
          )}
        </div>
      </button>
    )
  }

  // ✅ PREMIUM INPUT COMPONENT
  const PremiumInput = ({ value, onChange, placeholder, type = 'text', accentColor }: any) => (
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        borderRadius: '10px',
        borderColor: '#e5e7eb',
        borderWidth: '1.5px',
        fontSize: '14px',
        padding: '10px 14px',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = accentColor || '#06B6D4'
        e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor ? accentColor + '15' : '#06B6D415'}`
        e.currentTarget.style.backgroundColor = '#f9fafb'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.backgroundColor = '#ffffff'
      }}
    />
  )

  // ✅ PREMIUM TEXTAREA
  const PremiumTextarea = ({ value, onChange, placeholder, rows, accentColor }: any) => (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        borderRadius: '10px',
        borderColor: '#e5e7eb',
        borderWidth: '1.5px',
        fontSize: '14px',
        padding: '10px 14px',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = accentColor || '#06B6D4'
        e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor ? accentColor + '15' : '#06B6D415'}`
        e.currentTarget.style.backgroundColor = '#f9fafb'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.backgroundColor = '#ffffff'
      }}
    />
  )

  // ✅ PREMIUM LABEL
  const PremiumLabel = ({ children, accentColor }: any) => (
    <Label style={{ fontSize: '13px', fontWeight: '600', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {children}
    </Label>
  )

  const renderCompanySettings = () => {
    const accentColor = CATEGORY_CONFIG.general.accentColor
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Logo Section */}
        <div style={{
          border: `2px dashed ${accentColor}`,
          borderRadius: '14px',
          backgroundColor: CATEGORY_CONFIG.general.lightBg,
          padding: '32px',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '12px',
            border: '3px solid white',
            backgroundColor: 'white',
            padding: '8px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}>
            <img src={companySettings.logo || '/placeholder-logo.png'} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            <button style={{
              position: 'absolute',
              bottom: '-12px',
              right: '-12px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s'
            }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            }}
            >
              <Upload size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>Company Logo</h3>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0' }}>Upload your company logo for invoices and reports</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Recommended: 200x200px, max 1MB (PNG, JPG)</p>
          </div>
        </div>

        {/* Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Company Name</PremiumLabel>
            <PremiumInput
              value={companySettings.name}
              onChange={(e: any) => setCompanySettings({ ...companySettings, name: e.target.value })}
              placeholder="Enter company name"
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Tax ID / VAT Number</PremiumLabel>
            <PremiumInput
              value={companySettings.taxId}
              onChange={(e: any) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
              placeholder="Enter tax ID"
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
            <PremiumLabel accentColor={accentColor}>Address</PremiumLabel>
            <PremiumTextarea
              value={companySettings.address}
              onChange={(e: any) => setCompanySettings({ ...companySettings, address: e.target.value })}
              placeholder="Enter full address"
              rows={3}
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Phone Number</PremiumLabel>
            <PremiumInput
              type="tel"
              value={companySettings.phone}
              onChange={(e: any) => setCompanySettings({ ...companySettings, phone: e.target.value })}
              placeholder="Enter phone number"
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Email Address</PremiumLabel>
            <PremiumInput
              type="email"
              value={companySettings.email}
              onChange={(e: any) => setCompanySettings({ ...companySettings, email: e.target.value })}
              placeholder="Enter email address"
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Currency</PremiumLabel>
            <Select value={companySettings.currency} onValueChange={(v) => setCompanySettings({ ...companySettings, currency: v })}>
              <SelectTrigger style={{ borderRadius: '10px', borderColor: '#e5e7eb', borderWidth: '1.5px', fontSize: '14px', padding: '10px 14px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                <SelectItem value="GBP">🇬🇧 British Pound (GBP)</SelectItem>
                <SelectItem value="CAD">🇨🇦 Canadian Dollar (CAD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Time Zone</PremiumLabel>
            <Select value={companySettings.timeZone} onValueChange={(v) => setCompanySettings({ ...companySettings, timeZone: v })}>
              <SelectTrigger style={{ borderRadius: '10px', borderColor: '#e5e7eb', borderWidth: '1.5px', fontSize: '14px', padding: '10px 14px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Language</PremiumLabel>
            <Select value={companySettings.language} onValueChange={(v) => setCompanySettings({ ...companySettings, language: v })}>
              <SelectTrigger style={{ borderRadius: '10px', borderColor: '#e5e7eb', borderWidth: '1.5px', fontSize: '14px', padding: '10px 14px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <PremiumLabel accentColor={accentColor}>Units</PremiumLabel>
            <RadioGroup value={companySettings.units} onValueChange={(v: any) => setCompanySettings({ ...companySettings, units: v })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', padding: '12px 16px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#ffffff' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
                (e.currentTarget as HTMLDivElement).style.backgroundColor = CATEGORY_CONFIG.general.lightBg
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#ffffff'
              }}
              >
                <RadioGroupItem value="imperial" id="imperial" />
                <Label htmlFor="imperial" style={{ cursor: 'pointer', fontWeight: '500', margin: 0, color: '#374151' }}>Imperial (mi, lb)</Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '10px', border: '1.5px solid #e5e7eb', padding: '12px 16px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#ffffff' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
                (e.currentTarget as HTMLDivElement).style.backgroundColor = CATEGORY_CONFIG.general.lightBg
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#ffffff'
              }}
              >
                <RadioGroupItem value="metric" id="metric" />
                <Label htmlFor="metric" style={{ cursor: 'pointer', fontWeight: '500', margin: 0, color: '#374151' }}>Metric (km, kg)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    )
  }

  const renderInvoiceSettings = () => {
    const accentColor = CATEGORY_CONFIG.invoice.accentColor
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Invoice Prefix</PremiumLabel>
            <PremiumInput
              value={invoiceSettings.prefix}
              onChange={(e: any) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })}
              placeholder="e.g., INV"
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Starting Number</PremiumLabel>
            <PremiumInput
              type="number"
              value={invoiceSettings.startNumber}
              onChange={(e: any) => setInvoiceSettings({ ...invoiceSettings, startNumber: parseInt(e.target.value) || 1 })}
              placeholder="1001"
              accentColor={accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={accentColor}>Payment Due Days</PremiumLabel>
            <PremiumInput
              type="number"
              value={invoiceSettings.dueDays}
              onChange={(e: any) => setInvoiceSettings({ ...invoiceSettings, dueDays: parseInt(e.target.value) || 30 })}
              placeholder="30"
              accentColor={accentColor}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <PremiumLabel accentColor={accentColor}>Terms and Conditions</PremiumLabel>
          <PremiumTextarea
            value={invoiceSettings.terms}
            onChange={(e: any) => setInvoiceSettings({ ...invoiceSettings, terms: e.target.value })}
            placeholder="Enter payment terms"
            rows={3}
            accentColor={accentColor}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <PremiumLabel accentColor={accentColor}>Default Notes</PremiumLabel>
          <PremiumTextarea
            value={invoiceSettings.notes}
            onChange={(e: any) => setInvoiceSettings({ ...invoiceSettings, notes: e.target.value })}
            placeholder="Add default notes for invoices"
            rows={2}
            accentColor={accentColor}
          />
        </div>

        <div style={{
          borderRadius: '14px',
          backgroundColor: CATEGORY_CONFIG.invoice.lightBg,
          border: `2px solid ${CATEGORY_CONFIG.invoice.borderColor}`,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h4 style={{ fontWeight: '700', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <AlertCircle size={20} /> Display Options
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'show-logo', label: 'Display company logo on invoices', key: 'logo' as const },
              { id: 'show-tax', label: 'Show Tax ID / VAT number', key: 'showTaxId' as const },
              { id: 'digital-sig', label: 'Enable digital signatures', key: 'digitalSignature' as const },
            ].map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '10px', backgroundColor: 'white', padding: '12px 16px', border: '1.5px solid #fed7aa', transition: 'all 0.2s' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = CATEGORY_CONFIG.invoice.lightBg
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'white'
              }}
              >
                <Checkbox
                  id={item.id}
                  checked={invoiceSettings[item.key]}
                  onCheckedChange={(checked) => setInvoiceSettings({ ...invoiceSettings, [item.key]: checked === true })}
                />
                <Label htmlFor={item.id} style={{ cursor: 'pointer', fontWeight: '500', margin: 0, color: '#1f2937' }}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderMaintenanceSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Card style={{ borderColor: '#86efac', backgroundColor: '#dcfce7', border: '2px solid #a7f3d0' }}>
        <CardHeader style={{ paddingBottom: '16px' }}>
          <CardTitle style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <AlertCircle size={20} /> Maintenance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor="#10B981">Alert Days Before Due</PremiumLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PremiumInput
                type="number"
                value={maintenanceSettings.alertDays}
                onChange={(e: any) => setMaintenanceSettings({ ...maintenanceSettings, alertDays: parseInt(e.target.value) || 7 })}
                accentColor="#10B981"
              />
              <span style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>days before maintenance is due</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ borderColor: '#fdba74', backgroundColor: '#fed7aa', border: '2px solid #fda858' }}>
        <CardHeader style={{ paddingBottom: '16px' }}>
          <CardTitle style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Wrench size={20} /> Maintenance Intervals
          </CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor="#F59E0B">Mileage Interval</PremiumLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PremiumInput
                type="number"
                value={maintenanceSettings.maintenanceInterval.mileage}
                onChange={(e: any) => setMaintenanceSettings({ ...maintenanceSettings, maintenanceInterval: { ...maintenanceSettings.maintenanceInterval, mileage: parseInt(e.target.value) || 5000 } })}
                accentColor="#F59E0B"
              />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>miles</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor="#F59E0B">Time Interval</PremiumLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PremiumInput
                type="number"
                value={maintenanceSettings.maintenanceInterval.days}
                onChange={(e: any) => setMaintenanceSettings({ ...maintenanceSettings, maintenanceInterval: { ...maintenanceSettings.maintenanceInterval, days: parseInt(e.target.value) || 90 } })}
                accentColor="#F59E0B"
              />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ borderColor: '#c4b5fd', backgroundColor: '#ede9fe', border: '2px solid #ddd6fe' }}>
        <CardHeader style={{ paddingBottom: '16px' }}>
          <CardTitle style={{ color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <CheckCircle size={20} /> Required Maintenance Checks
          </CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {Object.entries(maintenanceSettings.requiredChecks).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '10px', backgroundColor: 'white', padding: '12px 16px', border: '1.5px solid #ddd6fe', transition: 'all 0.2s' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = CATEGORY_CONFIG.api.lightBg
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'white'
            }}
            >
              <Checkbox
                id={`check-${key}`}
                checked={value}
                onCheckedChange={(checked) => setMaintenanceSettings({ ...maintenanceSettings, requiredChecks: { ...maintenanceSettings.requiredChecks, [key]: checked === true } })}
              />
              <Label htmlFor={`check-${key}`} style={{ cursor: 'pointer', fontWeight: '500', margin: 0, color: '#1f2937' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderApiSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHeader style={{ backgroundColor: CATEGORY_CONFIG.api.lightBg, borderBottom: `2px solid ${CATEGORY_CONFIG.api.borderColor}` }}>
            <TableRow>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</TableHead>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key</TableHead>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</TableHead>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Used</TableHead>
              <TableHead style={{ width: '120px', textAlign: 'right', fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey, index) => (
              <TableRow key={apiKey.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                <TableCell style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{apiKey.name}</TableCell>
                <TableCell>
                  <code style={{ borderRadius: '8px', backgroundColor: '#f3f4f6', padding: '6px 12px', fontSize: '12px', color: '#374151', fontWeight: '600', fontFamily: 'monospace' }}>
                    {showApiKeys[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 12) + '...'}
                  </code>
                </TableCell>
                <TableCell style={{ fontSize: '14px', color: '#6b7280' }}>{formatDate(apiKey.created)}</TableCell>
                <TableCell style={{ fontSize: '14px', color: '#6b7280' }}>{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : <span style={{ color: '#9ca3af' }}>Never</span>}</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => setShowApiKeys({ ...showApiKeys, [apiKey.id]: !showApiKeys[apiKey.id] })}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: CATEGORY_CONFIG.api.accentColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.api.lightBg
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      {showApiKeys[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(apiKey.key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: CATEGORY_CONFIG.api.accentColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.api.lightBg
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      <CopyIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleApiKeyDelete(apiKey.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <button
        onClick={generateApiKey}
        style={{
          backgroundColor: CATEGORY_CONFIG.api.accentColor,
          color: 'white',
          fontWeight: '600',
          borderRadius: '10px',
          boxShadow: '0 8px 20px rgba(168, 85, 247, 0.3)',
          border: 'none',
          padding: '12px 24px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(168, 85, 247, 0.4)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.api.accentDark
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.3)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.api.accentColor
        }}
      >
        <PlusCircleIcon size={18} />
        Generate New API Key
      </button>
    </div>
  )

  const renderWebhookSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHeader style={{ backgroundColor: CATEGORY_CONFIG.webhooks.lightBg, borderBottom: `2px solid ${CATEGORY_CONFIG.webhooks.borderColor}` }}>
            <TableRow>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Endpoint URL</TableHead>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Events</TableHead>
              <TableHead style={{ fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</TableHead>
              <TableHead style={{ width: '120px', textAlign: 'right', fontWeight: '700', color: '#1f2937', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook, index) => (
              <TableRow key={webhook.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                <TableCell style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{webhook.url}</TableCell>
                <TableCell style={{ fontSize: '14px', color: '#6b7280' }}>{webhook.events.join(', ')}</TableCell>
                <TableCell>
                  <Badge style={{ backgroundColor: webhook.status === 'active' ? '#dcfce7' : '#f3f4f6', color: webhook.status === 'active' ? '#166534' : '#4b5563', fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}>
                    {webhook.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                  </Badge>
                </TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => toggleWebhookStatus(webhook.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: CATEGORY_CONFIG.webhooks.accentColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.webhooks.lightBg
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      {webhook.status === 'active' ? <CheckCircle size={16} /> : <Globe size={16} />}
                    </button>
                    <button
                      onClick={() => handleWebhookDelete(webhook.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Card style={{ borderColor: CATEGORY_CONFIG.webhooks.borderColor, backgroundColor: CATEGORY_CONFIG.webhooks.lightBg, border: `2px solid ${CATEGORY_CONFIG.webhooks.borderColor}` }}>
        <CardHeader style={{ paddingBottom: '16px' }}>
          <CardTitle style={{ color: CATEGORY_CONFIG.webhooks.accentDark, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <PlusCircleIcon size={20} /> Add New Webhook
          </CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={CATEGORY_CONFIG.webhooks.accentColor}>Endpoint URL</PremiumLabel>
            <PremiumInput
              placeholder="https://example.com/webhooks/cargotrack"
              value={newWebhook.url}
              onChange={(e: any) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              accentColor={CATEGORY_CONFIG.webhooks.accentColor}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <PremiumLabel accentColor={CATEGORY_CONFIG.webhooks.accentColor}>Events to Subscribe</PremiumLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {['shipment.created', 'shipment.updated', 'shipment.delivered', 'invoice.created', 'invoice.paid', 'invoice.overdue'].map((event) => (
                <div key={event} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Checkbox
                    id={`event-${event}`}
                    checked={newWebhook.events.includes(event)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] })
                      } else {
                        setNewWebhook({ ...newWebhook, events: newWebhook.events.filter((e) => e !== event) })
                      }
                    }}
                  />
                  <Label htmlFor={`event-${event}`} style={{ cursor: 'pointer', fontSize: '14px', color: '#4b5563' }}>{event}</Label>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddWebhook}
            disabled={!newWebhook.url || newWebhook.events.length === 0}
            style={{
              backgroundColor: CATEGORY_CONFIG.webhooks.accentColor,
              color: 'white',
              fontWeight: '600',
              borderRadius: '10px',
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
              border: 'none',
              padding: '12px 24px',
              cursor: !newWebhook.url || newWebhook.events.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: !newWebhook.url || newWebhook.events.length === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!newWebhook.url || newWebhook.events.length === 0) return
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(236, 72, 153, 0.4)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.webhooks.accentDark
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.3)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = CATEGORY_CONFIG.webhooks.accentColor
            }}
          >
            <PlusCircleIcon size={18} />
            Add Webhook
          </button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: 'white', boxShadow: '0 12px 30px rgba(37, 99, 235, 0.25)' }}>
              <Cog size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Settings</h1>
              <p style={{ fontSize: '15px', color: '#64748b', marginTop: '6px' }}>Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* CATEGORY CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {renderCategoryCard('general')}
          {renderCategoryCard('invoice')}
          {renderCategoryCard('maintenance')}
          {renderCategoryCard('api')}
          {renderCategoryCard('webhooks')}
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TabsList style={{ display: 'none' }}>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* CONTENT CARD */}
          <div style={{ borderRadius: '16px', border: '2px solid #e2e8f0', backgroundColor: 'white', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            <TabsContent value="general" style={{ margin: 0 }}>
              <div style={{ backgroundColor: CATEGORY_CONFIG.general.lightBg, padding: '32px', borderBottom: `2px solid ${CATEGORY_CONFIG.general.borderColor}` }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>General Settings</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage your company details and preferences</p>
              </div>
              <div style={{ padding: '32px' }}>
                {renderCompanySettings()}
              </div>
            </TabsContent>

            <TabsContent value="invoice" style={{ margin: 0 }}>
              <div style={{ backgroundColor: CATEGORY_CONFIG.invoice.lightBg, padding: '32px', borderBottom: `2px solid ${CATEGORY_CONFIG.invoice.borderColor}` }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Billing Settings</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Configure how your invoices are generated and displayed</p>
              </div>
              <div style={{ padding: '32px' }}>
                {renderInvoiceSettings()}
              </div>
            </TabsContent>

            <TabsContent value="maintenance" style={{ margin: 0 }}>
              <div style={{ backgroundColor: CATEGORY_CONFIG.maintenance.lightBg, padding: '32px', borderBottom: `2px solid ${CATEGORY_CONFIG.maintenance.borderColor}` }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Maintenance Settings</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Configure maintenance schedules and alerts</p>
              </div>
              <div style={{ padding: '32px' }}>
                {renderMaintenanceSettings()}
              </div>
            </TabsContent>

            <TabsContent value="api" style={{ margin: 0 }}>
              <div style={{ backgroundColor: CATEGORY_CONFIG.api.lightBg, padding: '32px', borderBottom: `2px solid ${CATEGORY_CONFIG.api.borderColor}` }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>API Keys</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage API keys for programmatic access</p>
              </div>
              <div style={{ padding: '32px' }}>
                {renderApiSettings()}
              </div>
            </TabsContent>

            <TabsContent value="webhooks" style={{ margin: 0 }}>
              <div style={{ backgroundColor: CATEGORY_CONFIG.webhooks.lightBg, padding: '32px', borderBottom: `2px solid ${CATEGORY_CONFIG.webhooks.borderColor}` }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Webhooks</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Configure webhooks to receive real-time notifications</p>
              </div>
              <div style={{ padding: '32px' }}>
                {renderWebhookSettings()}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* SAVE BUTTON */}
        <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', backgroundColor: 'white', borderRadius: '14px', padding: '28px 32px', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)', border: '2px solid #e2e8f0' }}>
          <button
            disabled={isSaving}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: 'white',
              color: '#475569',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              if (isSaving) return
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f1f5f9';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#94a3b8'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            style={{
              padding: '10px 32px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (isSaving) return
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.4)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb'
            }}
          >
            {isSaving && <Loader2Icon className="animate-spin" size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {showSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#059669', fontWeight: '700', animation: 'pulse 2s infinite' }}>
              <CheckCircle size={20} />
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings