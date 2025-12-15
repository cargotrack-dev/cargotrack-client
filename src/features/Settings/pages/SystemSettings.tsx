// src/features/Settings/pages/SystemSettings.tsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  TextField, 
  Button, 
  FormControlLabel, 
  Switch, 
  Grid as MuiGrid, 
  Card, 
  CardContent, 
  CardHeader, 
  Snackbar, 
  Alert, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
// Install with: npm install @mui/icons-material
import { 
  Save as SaveOutlined, 
  Refresh as RefreshOutlined, 
  Business as BusinessOutlined, 
  Language as LanguageOutlined, 
  SettingsBackupRestore as SettingsBackupRestoreOutlined, 
  Notifications as NotificationsOutlined, 
  Email as EmailOutlined 
} from '@mui/icons-material';
import { apiClient } from '../services/api/apiClient';

// Create a Grid component that works with the correct props
interface GridProps extends Omit<React.ComponentProps<typeof MuiGrid>, 'item'> {
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
}

const Grid: React.FC<GridProps> = (props) => {
  // Use a TypeScript technique to exclude 'item' from props before spreading
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, ...rest } = props;
  return <MuiGrid {...rest} />;
};

interface SystemSettingsProps {
  isAdmin?: boolean;
}

interface SystemSettingsData {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
  };
  preferences: {
    defaultLanguage: string;
    defaultCurrency: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    distanceUnit: 'km' | 'miles';
    weightUnit: 'kg' | 'lbs';
  };
  notifications: {
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    enableSmsNotifications: boolean;
    dailySummaryEnabled: boolean;
    alertsEnabled: boolean;
  };
  backup: {
    autoBackupEnabled: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupTime: string;
    retentionPeriod: number;
    lastBackupDate: string | null;
  };
  smtp: {
    server: string;
    port: number;
    username: string;
    password: string;
    useSsl: boolean;
    senderEmail: string;
    senderName: string;
  };
}

const defaultSettings: SystemSettingsData = {
  company: {
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
  },
  preferences: {
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'UTC',
    distanceUnit: 'km',
    weightUnit: 'kg',
  },
  notifications: {
    enableEmailNotifications: true,
    enablePushNotifications: false,
    enableSmsNotifications: false,
    dailySummaryEnabled: true,
    alertsEnabled: true,
  },
  backup: {
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '01:00',
    retentionPeriod: 30,
    lastBackupDate: null,
  },
  smtp: {
    server: '',
    port: 587,
    username: '',
    password: '',
    useSsl: true,
    senderEmail: '',
    senderName: '',
  },
};

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'];
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

const SystemSettings: React.FC<SystemSettingsProps> = ({ isAdmin = false }) => {
  const [settings, setSettings] = useState<SystemSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  // Removed unused state variables: activeTab and setActiveTab

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/settings/system');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching system settings:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load system settings',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiClient.put('/api/settings/system', settings);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'System settings saved successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error saving system settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save system settings',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Define a more specific type for the value parameter based on its context
  const handleChange = <T extends keyof SystemSettingsData, K extends keyof SystemSettingsData[T]>(
    section: T,
    field: K extends string ? K : never,
    value: SystemSettingsData[T][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            System Settings
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveOutlined />}
              onClick={handleSave}
              disabled={saving || !isAdmin}
              sx={{ ml: 2 }}
            >
              {saving ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {!isAdmin && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You are viewing system settings in read-only mode. Contact an administrator to make changes.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Company Information */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Company Information" 
                avatar={<BusinessOutlined />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="companyName"
                    label="Company Name"
                    name="companyName"
                    value={settings.company.name}
                    onChange={(e) => handleChange('company', 'name', e.target.value)}
                    disabled={!isAdmin}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="companyAddress"
                    label="Address"
                    name="companyAddress"
                    multiline
                    rows={3}
                    value={settings.company.address}
                    onChange={(e) => handleChange('company', 'address', e.target.value)}
                    disabled={!isAdmin}
                  />
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="companyPhone"
                        label="Phone"
                        name="companyPhone"
                        value={settings.company.phone}
                        onChange={(e) => handleChange('company', 'phone', e.target.value)}
                        disabled={!isAdmin}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="companyEmail"
                        label="Email"
                        name="companyEmail"
                        value={settings.company.email}
                        onChange={(e) => handleChange('company', 'email', e.target.value)}
                        disabled={!isAdmin}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="companyWebsite"
                        label="Website"
                        name="companyWebsite"
                        value={settings.company.website}
                        onChange={(e) => handleChange('company', 'website', e.target.value)}
                        disabled={!isAdmin}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        id="companyTaxId"
                        label="Tax ID / VAT Number"
                        name="companyTaxId"
                        value={settings.company.taxId}
                        onChange={(e) => handleChange('company', 'taxId', e.target.value)}
                        disabled={!isAdmin}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Preferences */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Preferences" 
                avatar={<LanguageOutlined />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="language-label">Default Language</InputLabel>
                      <Select
                        labelId="language-label"
                        id="language"
                        value={settings.preferences.defaultLanguage}
                        label="Default Language"
                        onChange={(e: SelectChangeEvent) => handleChange('preferences', 'defaultLanguage', e.target.value)}
                        disabled={!isAdmin}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="currency-label">Default Currency</InputLabel>
                      <Select
                        labelId="currency-label"
                        id="currency"
                        value={settings.preferences.defaultCurrency}
                        label="Default Currency"
                        onChange={(e: SelectChangeEvent) => handleChange('preferences', 'defaultCurrency', e.target.value)}
                        disabled={!isAdmin}
                      >
                        {currencies.map((currency) => (
                          <MenuItem key={currency} value={currency}>
                            {currency}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="date-format-label">Date Format</InputLabel>
                      <Select
                        labelId="date-format-label"
                        id="dateFormat"
                        value={settings.preferences.dateFormat}
                        label="Date Format"
                        onChange={(e: SelectChangeEvent) => handleChange('preferences', 'dateFormat', e.target.value)}
                        disabled={!isAdmin}
                      >
                        {dateFormats.map((format) => (
                          <MenuItem key={format} value={format}>
                            {format}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="time-format-label">Time Format</InputLabel>
                      <Select
                        labelId="time-format-label"
                        id="timeFormat"
                        value={settings.preferences.timeFormat}
                        label="Time Format"
                        onChange={(e: SelectChangeEvent) => handleChange('preferences', 'timeFormat', e.target.value)}
                        disabled={!isAdmin}
                      >
                        {timeFormats.map((format) => (
                          <MenuItem key={format} value={format}>
                            {format === '12h' ? '12-hour (AM/PM)' : '24-hour'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="timezone-label">Timezone</InputLabel>
                  <Select
                    labelId="timezone-label"
                    id="timezone"
                    value={settings.preferences.timezone}
                    label="Timezone"
                    onChange={(e: SelectChangeEvent) => handleChange('preferences', 'timezone', e.target.value)}
                    disabled={!isAdmin}
                  >
                    {timezones.map((timezone) => (
                      <MenuItem key={timezone} value={timezone}>
                        {timezone}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="distance-unit-label">Distance Unit</InputLabel>
                      <Select
                        labelId="distance-unit-label"
                        id="distanceUnit"
                        value={settings.preferences.distanceUnit}
                        label="Distance Unit"
                        onChange={(e: SelectChangeEvent) => handleChange('preferences', 'distanceUnit', e.target.value as 'km' | 'miles')}
                        disabled={!isAdmin}
                      >
                        <MenuItem value="km">Kilometers (km)</MenuItem>
                        <MenuItem value="miles">Miles</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="weight-unit-label">Weight Unit</InputLabel>
                      <Select
                        labelId="weight-unit-label"
                        id="weightUnit"
                        value={settings.preferences.weightUnit}
                        label="Weight Unit"
                        onChange={(e: SelectChangeEvent) => handleChange('preferences', 'weightUnit', e.target.value as 'kg' | 'lbs')}
                        disabled={!isAdmin}
                      >
                        <MenuItem value="kg">Kilograms (kg)</MenuItem>
                        <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Notification Settings" 
                avatar={<NotificationsOutlined />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.enableEmailNotifications}
                      onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Enable Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.enablePushNotifications}
                      onChange={(e) => handleChange('notifications', 'enablePushNotifications', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Enable Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.enableSmsNotifications}
                      onChange={(e) => handleChange('notifications', 'enableSmsNotifications', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Enable SMS Notifications"
                />
                <Divider sx={{ my: 2 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.dailySummaryEnabled}
                      onChange={(e) => handleChange('notifications', 'dailySummaryEnabled', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Send Daily Summary Report"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.alertsEnabled}
                      onChange={(e) => handleChange('notifications', 'alertsEnabled', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Enable System Alerts"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Backup Settings */}
          <Grid xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Backup & Recovery" 
                avatar={<SettingsBackupRestoreOutlined />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.backup.autoBackupEnabled}
                      onChange={(e) => handleChange('backup', 'autoBackupEnabled', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Enable Automatic Backups"
                />

                <FormControl fullWidth margin="normal" disabled={!settings.backup.autoBackupEnabled || !isAdmin}>
                  <InputLabel id="backup-frequency-label">Backup Frequency</InputLabel>
                  <Select
                    labelId="backup-frequency-label"
                    id="backupFrequency"
                    value={settings.backup.backupFrequency}
                    label="Backup Frequency"
                    onChange={(e: SelectChangeEvent) => handleChange('backup', 'backupFrequency', e.target.value as 'daily' | 'weekly' | 'monthly')}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  margin="normal"
                  fullWidth
                  id="backupTime"
                  label="Backup Time (HH:MM)"
                  type="time"
                  name="backupTime"
                  value={settings.backup.backupTime}
                  onChange={(e) => handleChange('backup', 'backupTime', e.target.value)}
                  disabled={!settings.backup.autoBackupEnabled || !isAdmin}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="retentionPeriod"
                  label="Retention Period (Days)"
                  type="number"
                  name="retentionPeriod"
                  value={settings.backup.retentionPeriod}
                  onChange={(e) => handleChange('backup', 'retentionPeriod', Number(e.target.value))}
                  disabled={!settings.backup.autoBackupEnabled || !isAdmin}
                  InputProps={{ inputProps: { min: 1 } }}
                />

                {settings.backup.lastBackupDate && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Last backup: {new Date(settings.backup.lastBackupDate).toLocaleString()}
                  </Typography>
                )}

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<RefreshOutlined />}
                    disabled={!isAdmin}
                  >
                    Run Manual Backup
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SMTP Settings */}
          <Grid xs={12}>
            <Card>
              <CardHeader 
                title="Email Server (SMTP) Settings" 
                avatar={<EmailOutlined />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={8}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="smtpServer"
                      label="SMTP Server"
                      name="smtpServer"
                      value={settings.smtp.server}
                      onChange={(e) => handleChange('smtp', 'server', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="smtpPort"
                      label="Port"
                      name="smtpPort"
                      type="number"
                      value={settings.smtp.port}
                      onChange={(e) => handleChange('smtp', 'port', Number(e.target.value))}
                      disabled={!isAdmin}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="smtpUsername"
                      label="Username"
                      name="smtpUsername"
                      value={settings.smtp.username}
                      onChange={(e) => handleChange('smtp', 'username', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="smtpPassword"
                      label="Password"
                      name="smtpPassword"
                      type="password"
                      value={settings.smtp.password}
                      onChange={(e) => handleChange('smtp', 'password', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smtp.useSsl}
                      onChange={(e) => handleChange('smtp', 'useSsl', e.target.checked)}
                      disabled={!isAdmin}
                    />
                  }
                  label="Use SSL/TLS"
                />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="smtpSenderEmail"
                      label="Sender Email"
                      name="smtpSenderEmail"
                      value={settings.smtp.senderEmail}
                      onChange={(e) => handleChange('smtp', 'senderEmail', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="smtpSenderName"
                      label="Sender Name"
                      name="smtpSenderName"
                      value={settings.smtp.senderName}
                      onChange={(e) => handleChange('smtp', 'senderName', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!isAdmin}
                  >
                    Test SMTP Connection
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;