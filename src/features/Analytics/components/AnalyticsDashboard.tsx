// src/components/dashboard/AnalyticsDashboard.tsx
import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../UI/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../UI/components/ui/select';
import { DateRangePicker } from '../../UI/components/ui/date-range-picker';
import { Button } from '../../UI/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

// Mock data for demonstration
const monthlyShipments = [
  { month: 'Jan', shipments: 65, onTime: 58, delayed: 7 },
  { month: 'Feb', shipments: 72, onTime: 63, delayed: 9 },
  { month: 'Mar', shipments: 80, onTime: 72, delayed: 8 },
  { month: 'Apr', shipments: 78, onTime: 68, delayed: 10 },
  { month: 'May', shipments: 92, onTime: 85, delayed: 7 },
  { month: 'Jun', shipments: 110, onTime: 102, delayed: 8 },
];

const deliveryPerformance = [
  { name: 'On Time', value: 85 },
  { name: 'Delayed', value: 12 },
  { name: 'Cancelled', value: 3 },
];

const COLORS = ['#0088FE', '#FF8042', '#FF0000'];

const cargoTypeDistribution = [
  { type: 'Electronics', count: 245 },
  { type: 'Furniture', count: 168 },
  { type: 'Automotive', count: 112 },
  { type: 'Food', count: 205 },
  { type: 'Medical', count: 87 },
  { type: 'Hazardous', count: 45 },
];

interface RoutePerformance {
  route: string;
  avgTime: number;
  deliveries: number;
  revenue: number;
}

const topRoutes: RoutePerformance[] = [
  { route: 'NYC to LA', avgTime: 4.2, deliveries: 87, revenue: 124500 },
  { route: 'Chicago to Miami', avgTime: 3.1, deliveries: 65, revenue: 98750 },
  { route: 'Seattle to Denver', avgTime: 2.5, deliveries: 54, revenue: 76200 },
  { route: 'Boston to Washington', avgTime: 1.2, deliveries: 102, revenue: 68500 },
  { route: 'Dallas to Phoenix', avgTime: 2.0, deliveries: 48, revenue: 64300 },
];

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().setMonth(new Date().getMonth() - 6)), to: new Date() });
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, you would fetch updated data here
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Logic to export dashboard data to CSV/Excel would go here
    alert('Analytics data export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {timeRange === 'custom' && (
            <DateRangePicker 
              from={dateRange.from} 
              to={dateRange.to} 
              onFromChange={(date: Date) => setDateRange(prev => ({ ...prev, from: date }))} 
              onToChange={(date: Date) => setDateRange(prev => ({ ...prev, to: date }))} 
            />
          )}
          
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Shipments</CardTitle>
            <CardDescription>Total shipments processed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyShipments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="shipments" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>On-time vs delayed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deliveryPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryPerformance.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cargo Distribution</CardTitle>
            <CardDescription>Shipments by cargo type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cargoTypeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Routes</CardTitle>
          <CardDescription>Based on volume and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time (days)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topRoutes.map((route, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{route.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{route.avgTime.toFixed(1)} days</td>
                    <td className="px-6 py-4 whitespace-nowrap">{route.deliveries}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${route.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="delivery">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="delivery">Delivery Time</TabsTrigger>
              <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
              <TabsTrigger value="costs">Operational Costs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="delivery">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyShipments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="onTime" stroke="#10B981" name="On Time" />
                  <Line type="monotone" dataKey="delayed" stroke="#F59E0B" name="Delayed" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="fuel">
              {/* Fuel efficiency chart would go here */}
              <div className="text-center py-10 text-gray-500">
                Fuel efficiency data visualization will be implemented here
              </div>
            </TabsContent>
            
            <TabsContent value="costs">
              {/* Operational costs chart would go here */}
              <div className="text-center py-10 text-gray-500">
                Operational costs data visualization will be implemented here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;