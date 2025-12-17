// client/src/components/Financial/FinancialDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CircularProgress, 
  Grid as MuiGrid,
  Paper, 
  Typography, 
  Tabs,
  Tab,
  Button,
  Stack,
  useTheme,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { subDays, format } from 'date-fns';
import { apiClient } from '../../Invoices/services/api/apiClient';

// Create a custom Grid component to work around TypeScript issues
interface GridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
  sx?: Record<string, unknown>;
  [key: string]: unknown;
}

// Type-safe wrapper for MUI Grid
const Grid = ({ children, ...props }: GridProps) => {
  return <MuiGrid {...props}>{children}</MuiGrid>;
};

interface FinancialStatistics {
  totalRevenue: number;
  paidAmount: number;
  outstandingAmount: number;
  invoiceCount: {
    total: number;
    paid: number;
    partial: number;
    pending: number;
    overdue: number;
  };
  revenueByClient: Array<{ clientId: string; clientName: string; revenue: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  avgDaysToPayment: number;
}

const timeRanges = [
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'Last 6 Months', value: 180 },
  { label: 'Last 12 Months', value: 365 },
  { label: 'Custom Range', value: 'custom' }
];

const FinancialDashboard: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedRange, setSelectedRange] = useState<number | string>(30);
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [statistics, setStatistics] = useState<FinancialStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Colors for charts
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    '#8884d8',
    '#83a6ed',
    '#8dd1e1',
    '#82ca9d',
    '#a4de6c'
  ];

  // Fetch financial statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calculate the start date based on selected range
        let start = startDate;
        if (typeof selectedRange === 'number') {
          start = subDays(new Date(), selectedRange);
        }
        
        const response = await apiClient.get('/api/financial/statistics', {
          params: {
            startDate: start ? format(start, 'yyyy-MM-dd') : undefined,
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined
          }
        });
        
        if (response.data.success) {
          setStatistics(response.data.data);
        } else {
          setError('Failed to load financial statistics');
        }
      } catch (err) {
        console.error('Error fetching financial statistics:', err);
        setError('An error occurred while loading financial data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, [selectedRange, startDate, endDate]);

  // Handle time range change
  const handleRangeChange = (range: number | string) => {
    setSelectedRange(range);
    
    // Update start date based on range
    if (typeof range === 'number') {
      setStartDate(subDays(new Date(), range));
      setEndDate(new Date());
    }
  };

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Financial Dashboard</Typography>
            
            {/* Time range selection */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Time Range:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value.toString()}
                    variant={selectedRange === range.value ? 'contained' : 'outlined'}
                    size="small"
                    color="primary"
                    onClick={() => handleRangeChange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
            
            {/* Custom date range selector */}
            {selectedRange === 'custom' && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Stack>
            )}
            
            {/* Error message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}
            
            {/* Loading indicator */}
            {loading && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Loading financial data...</Typography>
              </Box>
            )}
            
            {/* Main statistics */}
            {!loading && statistics && (
              <Grid container spacing={3}>
                {/* Total Revenue */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">Total Revenue</Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>{formatCurrency(statistics.totalRevenue)}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {`${formatPercentage(100 * statistics.paidAmount / statistics.totalRevenue)} collected`}
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Outstanding Amount */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">Outstanding Amount</Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>{formatCurrency(statistics.outstandingAmount)}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {`${formatPercentage(100 * statistics.outstandingAmount / statistics.totalRevenue)} of total revenue`}
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Invoice Count */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">Invoices</Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>{statistics.invoiceCount.total}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {`${statistics.invoiceCount.overdue} overdue`}
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Average Days to Payment */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">Avg. Days to Payment</Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>{statistics.avgDaysToPayment}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {statistics.avgDaysToPayment <= 30 ? 'Good payment cycle' : 'Payment cycle needs improvement'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
        
        {/* Charts and Analysis */}
        {!loading && statistics && (
          <Card elevation={3}>
            <CardContent>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ mb: 3 }}
              >
                <Tab label="Revenue Trends" />
                <Tab label="Client Analysis" />
                <Tab label="Invoice Status" />
              </Tabs>
              
              {/* Revenue Trends */}
              {selectedTab === 0 && (
                <Box sx={{ height: 400 }}>
                  <Typography variant="h6" gutterBottom>Monthly Revenue</Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart
                      data={statistics.revenueByMonth}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                      />
                      <Tooltip
                        formatter={(value) => [`${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
              
              {/* Client Analysis */}
              {selectedTab === 1 && (
                <Box sx={{ height: 400 }}>
                  <Typography variant="h6" gutterBottom>Revenue by Client</Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={statistics.revenueByClient.slice(0, 10)} // Show top 10 clients
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="clientName"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                      />
                      <YAxis
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                      />
                      <Tooltip
                        formatter={(value) => [`${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue" 
                        fill={theme.palette.primary.main}
                      >
                        {statistics.revenueByClient.slice(0, 10).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
              
              {/* Invoice Status */}
              {selectedTab === 2 && (
                <Box sx={{ height: 400 }}>
                  <Typography variant="h6" gutterBottom>Invoice Status Distribution</Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Paid', value: statistics.invoiceCount.paid },
                          { name: 'Partial', value: statistics.invoiceCount.partial },
                          { name: 'Pending', value: statistics.invoiceCount.pending },
                          { name: 'Overdue', value: statistics.invoiceCount.overdue }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill={theme.palette.success.main} /> {/* Paid */}
                        <Cell fill={theme.palette.info.main} /> {/* Partial */}
                        <Cell fill={theme.palette.warning.main} /> {/* Pending */}
                        <Cell fill={theme.palette.error.main} /> {/* Overdue */}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Invoices']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default FinancialDashboard;