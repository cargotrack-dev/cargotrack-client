// src/features/Analytics/pages/Dashboard.tsx
import React from 'react';
import { Truck, FileText, DollarSign, AlertTriangle, Package, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

const mockRevenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 4500 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4800 },
  { name: 'May', revenue: 5500 },
  { name: 'Jun', revenue: 6000 },
  { name: 'Jul', revenue: 6200 },
];

const mockCargoData = [
  { name: 'Electronics', value: 35 },
  { name: 'Food', value: 25 },
  { name: 'Chemicals', value: 15 },
  { name: 'Textiles', value: 12 },
  { name: 'Other', value: 13 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: Feb 18, 2025</div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center pt-1">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">8% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Waybills</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center pt-1">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500">3% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <div className="flex items-center pt-1">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">12% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Maintenance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center pt-1">
              <span className="text-sm text-gray-500">Trucks need service</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fill="#93c5fd" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cargo Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCargoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Truck TRK-001 loaded at Port A", time: "2 hours ago", icon: Truck },
              { title: "New waybill generated for Client XYZ", time: "4 hours ago", icon: FileText },
              { title: "Invoice #INV-2025-042 paid", time: "5 hours ago", icon: DollarSign },
              { title: "5 packages delivered to warehouse", time: "1 day ago", icon: Package },
              { title: "Maintenance completed for Truck TRK-003", time: "1 day ago", icon: AlertTriangle },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                <div className="bg-blue-100 p-2 rounded-full">
                  <activity.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;