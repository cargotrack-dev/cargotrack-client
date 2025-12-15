import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid as MuiGrid, 
  TextField, 
  Button, 
  // Divider, - removed unused import
  Snackbar, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  PhotoCamera as PhotoCameraIcon,
  PersonOutline as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  // Cake as CakeIcon - removed unused import
} from '@mui/icons-material';
import { apiClient } from '../services/api/apiClient';
import { useAuth } from '@features/Auth/hooks/useAuth';


interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  jobTitle: string;
  department: string;
  employeeId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  birthDate: string | null;
  hireDate: string | null;
  bio: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
  licenses: {
    type: string;
    number: string;
    expiration: string;
    isActive: boolean;
  }[];
  [key: string]: string | string[] | number | boolean | null | { [key: string]: string | number | boolean } | Array<{ type: string; number: string; expiration: string; isActive: boolean }>; // Type-safe index signature
}

// Create custom Grid component to handle MUI Grid props correctly
// Import necessary types from Material UI
import { SxProps, Theme } from '@mui/material/styles';

// Create a custom Grid wrapper that's compatible with MUI Grid
// This approach avoids type issues with the 'item' prop
const Grid = (props: {
  item?: boolean;
  container?: boolean;
  spacing?: number;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  key?: React.Key;
}) => {
  // The trick is to create a div-based component with Grid props
  return <MuiGrid {...props} />;
};

const UserProfile: React.FC = () => {
 
useAuth();
const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/users/profile');
        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load profile',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (!profile) return;

    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      if (section && subField && profile[section] && typeof profile[section] === 'object') {
        setProfile({
          ...profile,
          [section]: {
            ...profile[section],
            [subField]: value,
          },
        });
      }
    } else {
      setProfile({
        ...profile,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const response = await apiClient.put('/api/users/profile', profile);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success',
        });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
      
      const response = await apiClient.post('/api/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success && profile) {
        setProfile({
          ...profile,
          profileImage: response.data.data.imageUrl,
        });
        
        setSnackbar({
          open: true,
          message: 'Profile image updated successfully',
          severity: 'success',
        });
        
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setSnackbar({
        open: true,
        message: 'Failed to upload profile image',
        severity: 'error',
      });
    } finally {
      setUploadingImage(false);
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

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load user profile</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            My Profile
          </Typography>
          <Box>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditMode(false)}
                  sx={{ mr: 1 }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Header - Avatar and Basic Info */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <label htmlFor="icon-button-file">
                          <input
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            disabled={!editMode || uploadingImage}
                          />
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            sx={{
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                            disabled={!editMode || uploadingImage}
                          >
                            {uploadingImage ? (
                              <CircularProgress size={24} />
                            ) : (
                              <PhotoCameraIcon />
                            )}
                          </IconButton>
                        </label>
                      }
                    >
                      <Avatar
                        src={profile.profileImage || undefined}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        sx={{ width: 120, height: 120 }}
                      />
                    </Badge>
                    {selectedFile && (
                      <Box mt={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={handleUploadImage}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? <CircularProgress size={20} /> : 'Upload'}
                        </Button>
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs>
                    <Box>
                      <Typography variant="h4">
                        {profile.firstName} {profile.lastName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {profile.jobTitle} {profile.department ? `- ${profile.department}` : ''}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">{profile.email}</Typography>
                      </Box>
                      
                      {profile.phone && (
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">{profile.phone}</Typography>
                        </Box>
                      )}
                      
                      {profile.employeeId && (
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <WorkIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">Employee ID: {profile.employeeId}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title="Personal Information" 
                avatar={<PersonIcon />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={true} // Email is typically not editable
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Phone"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Birth Date"
                  type="date"
                  value={profile.birthDate ? profile.birthDate.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  fullWidth
                  label="Bio"
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Work Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title="Employment Information" 
                avatar={<WorkIcon />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={profile.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Department"
                  value={profile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={profile.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Hire Date"
                  type="date"
                  value={profile.hireDate ? profile.hireDate.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('hireDate', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills & Expertise
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {profile.skills && profile.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                    {editMode && (
                      <Chip 
                        label="+ Add Skill" 
                        color="primary" 
                        variant="outlined" 
                        onClick={() => {/* Show skill add dialog */}}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Address Information" 
                avatar={<LocationIcon />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={profile.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      value={profile.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal/Zip Code"
                      value={profile.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={profile.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Emergency Contact" 
                avatar={<PhoneIcon />}
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
              <CardContent>
                <TextField
                  fullWidth
                  label="Contact Name"
                  value={profile.emergencyContact?.name || ''}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Relationship"
                  value={profile.emergencyContact?.relationship || ''}
                  onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={profile.emergencyContact?.phone || ''}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  disabled={!editMode}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Licenses & Certifications */}
          {profile.licenses && profile.licenses.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Licenses & Certifications" 
                  avatar={<WorkIcon />}
                  sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    {profile.licenses.map((license, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1">{license.type}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              License #: {license.number}
                            </Typography>
                            <Typography variant="body2">
                              Expires: {new Date(license.expiration).toLocaleDateString()}
                            </Typography>
                            <Chip 
                              label={license.isActive ? "Active" : "Expired"} 
                              color={license.isActive ? "success" : "error"} 
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {editMode && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Card 
                          variant="outlined" 
                          sx={{
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderStyle: 'dashed'
                          }}
                        >
                          <CardContent>
                            <Box textAlign="center">
                              <Button 
                                startIcon={<EditIcon />}
                                color="primary"
                              >
                                Add License
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
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

export default UserProfile;