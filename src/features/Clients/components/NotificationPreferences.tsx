// src/components/client/NotificationPreferences.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Switch } from '../../UI/components/ui/switch';
import { Input } from '../../UI/components/ui/input';
import { Separator } from '../../UI/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  Phone, 
  Save, 
  Check,
  Truck,
  FileText,
  Package,
  MessageSquare,
  Clock
} from 'lucide-react';

// export interface NotificationPreferencesProps {
//   clientId: string;
// }

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  events: {
    id: string;
    name: string;
    description?: string;
  }[];
}

// Notification categories and events
const notificationCategories: NotificationCategory[] = [
  {
    id: 'shipment-updates',
    title: 'Shipment Updates',
    description: 'Stay informed about your shipment status changes',
    icon: <Truck className="h-5 w-5" />,
    events: [
      { id: 'shipment-created', name: 'Shipment Created' },
      { id: 'shipment-dispatched', name: 'Shipment Dispatched' },
      { id: 'shipment-in-transit', name: 'Shipment In Transit' },
      { id: 'shipment-out-for-delivery', name: 'Out For Delivery' },
      { id: 'shipment-delivered', name: 'Shipment Delivered' },
      { id: 'shipment-delayed', name: 'Shipment Delayed' }
    ]
  },
  {
    id: 'document-notifications',
    title: 'Document Notifications',
    description: 'Get notified about important shipment documentation',
    icon: <FileText className="h-5 w-5" />,
    events: [
      { id: 'document-generated', name: 'Document Generated' },
      { id: 'document-needs-signature', name: 'Document Needs Signature' },
      { id: 'waybill-ready', name: 'Waybill Ready' },
      { id: 'invoice-ready', name: 'Invoice Ready' },
      { id: 'proof-of-delivery', name: 'Proof of Delivery Available' }
    ]
  },
  {
    id: 'cargo-notifications',
    title: 'Cargo Notifications',
    description: 'Receive updates related to your cargo',
    icon: <Package className="h-5 w-5" />,
    events: [
      { id: 'cargo-received', name: 'Cargo Received at Origin' },
      { id: 'cargo-inspected', name: 'Cargo Inspected' },
      { id: 'cargo-loaded', name: 'Cargo Loaded' },
      { id: 'cargo-unloaded', name: 'Cargo Unloaded' },
      { id: 'cargo-customs', name: 'Cargo in Customs' },
      { id: 'cargo-cleared', name: 'Cargo Cleared Customs' }
    ]
  },
  {
    id: 'account-notifications',
    title: 'Account Notifications',
    description: 'Updates related to your account activity',
    icon: <MessageSquare className="h-5 w-5" />,
    events: [
      { id: 'quote-ready', name: 'Quote Ready' },
      { id: 'payment-received', name: 'Payment Received' },
      { id: 'payment-due', name: 'Payment Due Reminder' },
      { id: 'feedback-request', name: 'Feedback Request' },
      { id: 'account-update', name: 'Account Updates' }
    ]
  }
];

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  requiresVerification?: boolean;
  value: string;
  isVerified: boolean;
}

interface NotificationPreferencesProps {
  clientId?: string;
  onSaveSuccess?: () => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ clientId, onSaveSuccess }) => {
  // Notification channels state
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      requiresVerification: true,
      value: 'user@example.com',
      isVerified: true
    },
    {
      id: 'sms',
      name: 'SMS/Text',
      icon: <Phone className="h-5 w-5" />,
      requiresVerification: true,
      value: '+1 (555) 123-4567',
      isVerified: false
    },
    {
      id: 'push',
      name: 'Push Notifications',
      icon: <Bell className="h-5 w-5" />,
      value: 'Enabled',
      isVerified: true
    }
  ]);

  // Notification preferences state - for each category, event, and channel
  const [preferences, setPreferences] = useState<{[key: string]: boolean}>({
    // Default values - enabling all email notifications for shipment status
    'email_shipment-created': true,
    'email_shipment-dispatched': true,
    'email_shipment-in-transit': true,
    'email_shipment-out-for-delivery': true,
    'email_shipment-delivered': true,
    'email_shipment-delayed': true,
    
    // Some SMS notifications
    'sms_shipment-dispatched': true,
    'sms_shipment-out-for-delivery': true,
    'sms_shipment-delivered': true,
    'sms_shipment-delayed': true,
    
    // Push notifications
    'push_shipment-delayed': true,
    'push_cargo-customs': true,
    'push_document-needs-signature': true
  });
  
  // Digest preferences
  const [digestPreferences, setDigestPreferences] = useState({
    dailyDigest: false,
    weeklyDigest: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Handle channel value change
  const handleChannelValueChange = (channelId: string, value: string) => {
    setChannels(channels.map(channel => 
      channel.id === channelId ? { ...channel, value, isVerified: false } : channel
    ));
  };
  
  // Handle notification preference toggle
  const handlePreferenceToggle = (key: string, isEnabled: boolean) => {
    setPreferences({
      ...preferences,
      [key]: isEnabled
    });
  };
  
  // Handle digest preference toggle
  const handleDigestToggle = (digestType: 'dailyDigest' | 'weeklyDigest', isEnabled: boolean) => {
    setDigestPreferences({
      ...digestPreferences,
      [digestType]: isEnabled
    });
  };
  
  // Send verification code
  const handleSendVerification = (channelId: string) => {
    setIsVerifying(true);
    
    // Simulate API call to send verification code
    setTimeout(() => {
      alert(`Verification code sent to your ${channelId === 'email' ? 'email address' : 'phone number'}`);
      setIsVerifying(false);
    }, 1000);
  };
  
  // Save all preferences
  const handleSavePreferences = () => {
    setIsSaving(true);
    
    // Prepare notification settings data
    const notificationSettings = {
      clientId,
      channels,
      preferences,
      digestPreferences,
      updatedAt: new Date()
    };
    
    // Simulate API call to save preferences
    setTimeout(() => {
      console.log('Notification preferences saved:', notificationSettings);
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      // Call onSaveSuccess callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    }, 1500);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Customize how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Communication Channels */}
        <div className="space-y-4">
        <p>Notification preferences for client ID: {clientId}</p>
          <h3 className="text-lg font-medium">Communication Channels</h3>
          <p className="text-sm text-gray-500">
            Choose how you want to receive notifications
          </p>
          
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    {channel.icon}
                  </div>
                  <div>
                    <p className="font-medium">{channel.name}</p>
                    {channel.requiresVerification && (
                      <div className="flex items-center mt-1">
                        <Input
                          className="w-64 mr-2"
                          value={channel.value}
                          onChange={(e) => handleChannelValueChange(channel.id, e.target.value)}
                        />
                        {channel.isVerified ? (
                          <div className="flex items-center text-green-600 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSendVerification(channel.id)}
                            disabled={isVerifying}
                          >
                            {isVerifying ? 'Sending...' : 'Verify'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>
          <p className="text-sm text-gray-500">
            Select which notifications you want to receive and how
          </p>
          
          <Tabs defaultValue="shipment-updates">
            <TabsList>
              {notificationCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <div className="flex items-center space-x-2">
                    {category.icon}
                    <span>{category.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {notificationCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-4">
                  <p>{category.description}</p>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-2 border-b">Event</th>
                        <th className="text-center p-2 border-b w-24">Email</th>
                        <th className="text-center p-2 border-b w-24">SMS</th>
                        <th className="text-center p-2 border-b w-24">Push</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.events.map((event) => (
                        <tr key={event.id} className="border-b border-gray-100">
                          <td className="p-2">
                            <div className="font-medium">{event.name}</div>
                            {event.description && (
                              <div className="text-xs text-gray-500">{event.description}</div>
                            )}
                          </td>
                          {channels.map((channel) => (
                            <td key={channel.id} className="text-center p-2">
                              <Switch
                                checked={!!preferences[`${channel.id}_${event.id}`]}
                                onCheckedChange={(checked) => 
                                  handlePreferenceToggle(`${channel.id}_${event.id}`, checked)
                                }
                                disabled={!channel.isVerified && channel.requiresVerification}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <Separator />
        
        {/* Digest Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Digest Preferences</h3>
          <p className="text-sm text-gray-500">
            Receive a summary of your shipment activities
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Daily Digest</p>
                  <p className="text-sm text-gray-500">Receive a summary of all activities at the end of each day</p>
                </div>
              </div>
              <Switch
                checked={digestPreferences.dailyDigest}
                onCheckedChange={(checked) => 
                  handleDigestToggle('dailyDigest', checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-gray-500">Receive a summary of all activities at the end of each week</p>
                </div>
              </div>
              <Switch
                checked={digestPreferences.weeklyDigest}
                onCheckedChange={(checked) => 
                  handleDigestToggle('weeklyDigest', checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-2">
          {showSuccess && (
            <div className="flex items-center text-green-600 text-sm mr-2">
              <Check className="h-4 w-4 mr-1" />
              Preferences saved
            </div>
          )}
          <Button 
            onClick={handleSavePreferences}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NotificationPreferences;