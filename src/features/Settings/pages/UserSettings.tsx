// src/features/Settings/pages/UserSettings.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  ViewDay as ViewDayIcon,
  Save as SaveIcon,
  LockOutlined as LockIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import { apiClient } from '../services/api/apiClient';
import { useAuth } from '@features/Auth/hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { CustomGrid as Grid } from '../components/CustomGrid';

// Create more specific type for nested object properties
type NestedValueType = string | number | boolean | 
  Record<string, string | number | boolean> | 
  Array<{ type: string; number: string; expiration: string; isActive: boolean }>;

interface UserSettingsData {
  theme: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    density: 'comfortable' | 'compact' | 'standard';
  };
  notifications: {
    email: {
      enabled: boolean;
      shipmentUpdates: boolean;
      maintenanceAlerts: boolean;
      systemNotices: boolean;
      weeklyReports: boolean;
    };
    inApp: {
      enabled: boolean;
      shipmentUpdates: boolean;
      maintenanceAlerts: boolean;
      systemNotices: boolean;
      taskAssignments: boolean;
    };
    sms: {
      enabled: boolean;
      emergencyAlerts: boolean;
    };
  };
  display: {
    language: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    distanceUnit: 'km' | 'miles';
    numberFormat: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    sessionTimeout: number;
    loginDevices: {
      id: string;
      deviceName: string;
      browser: string;
      lastActivity: string;
      isCurrent: boolean;
    }[];
  };
  dashboardWidgets: {
    id: string;
    name: string;
    enabled: boolean;
    position: number;
  }[];
  // Use safer index signature
  [key: string]: unknown;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
];

const timezones = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Australia/Sydney', 'Pacific/Auckland'
];

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
const timeFormats = ['12h', '24h'];
const colorOptions = ['blue', 'purple', 'green', 'orange', 'red', 'teal'];

const UserSettings: React.FC = () => {
  useAuth();
  const { toggleTheme, currentTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('theme');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/users/settings');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load settings',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await apiClient.put('/api/users/settings', settings);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Settings saved successfully',
          severity: 'success',
        });

        // Apply theme changes if they were updated
        if (settings.theme.mode !== currentTheme) {
          toggleTheme(settings.theme.mode);
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: keyof UserSettingsData, field: string, value: NestedValueType) => {
    if (!settings) return;

    if (field.includes('.')) {
      const [subsection, subfield] = field.split('.');
      
      // Type-safe way to update nested properties
      if (
        typeof settings[section] === 'object' && 
        settings[section] !== null &&
        typeof (settings[section] as Record<string, unknown>)[subsection] === 'object'
      ) {
        setSettings({
          ...settings,
          [section]: {
            ...(settings[section] as Record<string, unknown>),
            [subsection]: {
              ...((settings[section] as Record<string, unknown>)[subsection] as Record<string, unknown>),
              [subfield]: value,
            },
          },
        });
      }
    } else {
      // Type-safe way to update properties
      if (typeof settings[section] === 'object' && settings[section] !== null) {
        setSettings({
          ...settings,
          [section]: {
            ...(settings[section] as Record<string, unknown>),
            [field]: value,
          },
        });
      }
    }
  };

  // Function to toggle dashboard widget visibility
  const handleWidgetToggle = (widgetId: string) => {
    if (!settings) return;
    
    const updatedWidgets = settings.dashboardWidgets.map(widget => 
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    );
    
    setSettings({
      ...settings,
      dashboardWidgets: updatedWidgets,
    });
  };

  // Function to handle logging out a device
  const handleLogoutDevice = async (deviceId: string) => {
    try {
      const response = await apiClient.post('/api/users/security/devices/logout', { deviceId });
      if (response.data.success && settings) {
        // Remove the device from the list
        const updatedDevices = settings.security.loginDevices.filter(device => device.id !== deviceId);
        setSettings({
          ...settings,
          security: {
            ...settings.security,
            loginDevices: updatedDevices,
          },
        });
        
        setSnackbar({
          open: true,
          message: 'Device logged out successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error logging out device:', error);
      setSnackbar({
        open: true,
        message: 'Failed to log out device',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load settings</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            User Settings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            Save Changes
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Navigation Tabs */}
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant={activeTab === 'theme' ? 'contained' : 'outlined'}
                startIcon={<PaletteIcon />}
                onClick={() => setActiveTab('theme')}
              >
                Theme
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'display' ? 'contained' : 'outlined'}
                startIcon={<LanguageIcon />}
                onClick={() => setActiveTab('display')}
              >
                Display
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'notifications' ? 'contained' : 'outlined'}
                startIcon={<NotificationsIcon />}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'security' ? 'contained' : 'outlined'}
                startIcon={<SecurityIcon />}
                onClick={() => setActiveTab('security')}
              >
                Security
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'dashboard' ? 'contained' : 'outlined'}
                startIcon={<ViewDayIcon />}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Theme Settings */}
        {activeTab === 'theme' && (
          <Card>
            <CardHeader 
              title="Theme Settings" 
              avatar={<PaletteIcon />}
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="theme-mode-label">Theme Mode</InputLabel>
                    <Select
                      labelId="theme-mode-label"
                      value={settings.theme.mode}
                      label="Theme Mode"
                      onChange={(e) => handleChange('theme', 'mode', e.target.value as 'light' | 'dark' | 'system')}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="density-label">UI Density</InputLabel>
                    <Select
                      labelId="density-label"
                      value={settings.theme.density}
                      label="UI Density"
                      onChange={(e) => handleChange('theme', 'density', e.target.value as 'comfortable' | 'compact' | 'standard')}
                    >
                      <MenuItem value="comfortable">Comfortable</MenuItem>
                      <MenuItem value="standard">Standard</MenuItem>
                      <MenuItem value="compact">Compact</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Primary Color
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {colorOptions.map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleChange('theme', 'primaryColor', color)}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: color,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: settings.theme.primaryColor === color ? '3px solid #000' : 'none',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Box mt={4}>
                    <Typography variant="subtitle1" gutterBottom>
                      Preview
                    </Typography>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2, 
                        mt: 1,
                        bgcolor: settings.theme.mode === 'dark' ? '#333' : '#fff',
                        color: settings.theme.mode === 'dark' ? '#fff' : '#333',
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box 
                          sx={{ 
                            bgcolor: settings.theme.primaryColor, 
                            width: 36, 
                            height: 36, 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <PaletteIcon sx={{ color: '#fff' }} />
                        </Box>
                        <Typography variant="h6">Theme Preview</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        This is a preview of your selected theme settings.
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ 
                          bgcolor: settings.theme.primaryColor,
                          '&:hover': {
                            bgcolor: settings.theme.primaryColor,
                            opacity: 0.9,
                          }
                        }}
                      >
                        Sample Button
                      </Button>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Display Settings */}
        {activeTab === 'display' && (
          <Card>
            <CardHeader 
              title="Display Settings" 
              avatar={<LanguageIcon />}
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="language-label">Language</InputLabel>
                    <Select
                      labelId="language-label"
                      value={settings.display.language}
                      label="Language"
                      onChange={(e) => handleChange('display', 'language', e.target.value)}
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="timezone-label">Timezone</InputLabel>
                    <Select
                      labelId="timezone-label"
                      value={settings.display.timezone}
                      label="Timezone"
                      onChange={(e) => handleChange('display', 'timezone', e.target.value)}
                    >
                      {timezones.map((timezone) => (
                        <MenuItem key={timezone} value={timezone}>
                          {timezone}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="date-format-label">Date Format</InputLabel>
                    <Select
                      labelId="date-format-label"
                      value={settings.display.dateFormat}
                      label="Date Format"
                      onChange={(e) => handleChange('display', 'dateFormat', e.target.value)}
                    >
                      {dateFormats.map((format) => (
                        <MenuItem key={format} value={format}>
                          {format}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="time-format-label">Time Format</InputLabel>
                    <Select
                      labelId="time-format-label"
                      value={settings.display.timeFormat}
                      label="Time Format"
                      onChange={(e) => handleChange('display', 'timeFormat', e.target.value)}
                    >
                      {timeFormats.map((format) => (
                        <MenuItem key={format} value={format}>
                          {format === '12h' ? '12-hour (AM/PM)' : '24-hour'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel id="distance-unit-label">Distance Unit</InputLabel>
                    <Select
                      labelId="distance-unit-label"
                      value={settings.display.distanceUnit}
                      label="Distance Unit"
                      onChange={(e) => handleChange('display', 'distanceUnit', e.target.value as 'km' | 'miles')}
                    >
                      <MenuItem value="km">Kilometers (km)</MenuItem>
                      <MenuItem value="miles">Miles</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader
              title="Notification Settings"
              avatar={<NotificationsIcon />}
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Email Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email.enabled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleChange('notifications', 'email.enabled', e.target.checked)
                        }
                      />
                    }
                    label="Enable Email Notifications"
                  />

                  <List dense disablePadding sx={{ ml: 4, mt: 1 }}>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.email.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.email.shipmentUpdates}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'email.shipmentUpdates', e.target.checked)
                            }
                            disabled={!settings.notifications.email.enabled}
                          />
                        }
                        label="Shipment Updates"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.email.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.email.maintenanceAlerts}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'email.maintenanceAlerts', e.target.checked)
                            }
                            disabled={!settings.notifications.email.enabled}
                          />
                        }
                        label="Maintenance Alerts"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.email.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.email.systemNotices}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'email.systemNotices', e.target.checked)
                            }
                            disabled={!settings.notifications.email.enabled}
                          />
                        }
                        label="System Notices"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.email.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.email.weeklyReports}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'email.weeklyReports', e.target.checked)
                            }
                            disabled={!settings.notifications.email.enabled}
                          />
                        }
                        label="Weekly Reports"
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    In-App Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.inApp.enabled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleChange('notifications', 'inApp.enabled', e.target.checked)
                        }
                      />
                    }
                    label="Enable In-App Notifications"
                  />

                  <List dense disablePadding sx={{ ml: 4, mt: 1 }}>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.inApp.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.inApp.shipmentUpdates}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'inApp.shipmentUpdates', e.target.checked)
                            }
                            disabled={!settings.notifications.inApp.enabled}
                          />
                        }
                        label="Shipment Updates"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.inApp.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.inApp.maintenanceAlerts}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'inApp.maintenanceAlerts', e.target.checked)
                            }
                            disabled={!settings.notifications.inApp.enabled}
                          />
                        }
                        label="Maintenance Alerts"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.inApp.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.inApp.systemNotices}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'inApp.systemNotices', e.target.checked)
                            }
                            disabled={!settings.notifications.inApp.enabled}
                          />
                        }
                        label="System Notices"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.inApp.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.inApp.taskAssignments}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'inApp.taskAssignments', e.target.checked)
                            }
                            disabled={!settings.notifications.inApp.enabled}
                          />
                        }
                        label="Task Assignments"
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    SMS Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.sms.enabled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleChange('notifications', 'sms.enabled', e.target.checked)
                        }
                      />
                    }
                    label="Enable SMS Notifications"
                  />

                  <List dense disablePadding sx={{ ml: 4, mt: 1 }}>
                    <ListItem disablePadding sx={{ opacity: settings.notifications.sms.enabled ? 1 : 0.5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={settings.notifications.sms.emergencyAlerts}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleChange('notifications', 'sms.emergencyAlerts', e.target.checked)
                            }
                            disabled={!settings.notifications.sms.enabled}
                          />
                        }
                        label="Emergency Alerts Only"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader
              title="Security Settings"
              avatar={<SecurityIcon />}
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Account Security
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactorEnabled}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleChange('security', 'twoFactorEnabled', e.target.checked)
                        }
                      />
                    }
                    label="Two-Factor Authentication"
                  />

                  {settings.security.lastPasswordChange && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Last password change: {new Date(settings.security.lastPasswordChange).toLocaleDateString()}
                    </Typography>
                  )}

                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<LockIcon />}
                      onClick={() => window.location.href = '/auth/change-password'}
                    >
                      Change Password
                    </Button>
                  </Box>

                  <Box mt={3}>
                    <FormControl fullWidth>
                      <InputLabel id="session-timeout-label">Session Timeout</InputLabel>
                      <Select
                        labelId="session-timeout-label"
                        value={settings.security.sessionTimeout}
                        label="Session Timeout"
                        onChange={(e) => handleChange('security', 'sessionTimeout', Number(e.target.value))}
                      >
                        <MenuItem value={15}>15 minutes</MenuItem>
                        <MenuItem value={30}>30 minutes</MenuItem>
                        <MenuItem value={60}>1 hour</MenuItem>
                        <MenuItem value={120}>2 hours</MenuItem>
                        <MenuItem value={240}>4 hours</MenuItem>
                        <MenuItem value={480}>8 hours</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Active Sessions
                  </Typography>

                  <List>
                    {settings.security.loginDevices.map((device) => (
                      <ListItem
                        key={device.id}
                        secondaryAction={
                          device.isCurrent ? (
                            <Chip size="small" label="Current Device" color="primary" />
                          ) : (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleLogoutDevice(device.id)}
                            >
                              Logout
                            </Button>
                          )
                        }
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <ListItemIcon>
                          <DevicesIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={device.deviceName}
                          secondary={`Last activity: ${new Date(device.lastActivity).toLocaleString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Widgets Settings */}
        {activeTab === 'dashboard' && (
          <Card>
            <CardHeader
              title="Dashboard Widgets"
              avatar={<ViewDayIcon />}
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            />
            <CardContent>
              <Typography variant="body2" paragraph>
                Configure which widgets appear on your dashboard and their order.
              </Typography>

              <List>
                {settings.dashboardWidgets.map((widget) => (
                  <ListItem
                    key={widget.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      opacity: widget.enabled ? 1 : 0.6
                    }}
                  >
                    <ListItemText primary={widget.name} />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={widget.enabled}
                            onChange={() => handleWidgetToggle(widget.id)}
                            size="small"
                          />
                        }
                        label="Show"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSettings;