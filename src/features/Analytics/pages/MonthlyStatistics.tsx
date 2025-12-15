// src/pages/statistics/MonthlyStatistics.tsx
import React, { useState, useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Clipboard,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/features/UI/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/UI/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/features/UI/components/ui/select';
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for monthly statistics
const monthlyData = [
  { month: 'Jan', deliveries: 145, revenue: 78500, expenses: 52000, newClients: 12 },
  { month: 'Feb', deliveries: 132, revenue: 71200, expenses: 48500, newClients: 8 },
  { month: 'Mar', deliveries: 158, revenue: 84300, expenses: 54200, newClients: 15 },
  { month: 'Apr', deliveries: 162, revenue: 88100, expenses: 56800, newClients: 10 },
  { month: 'May', deliveries: 175, revenue: 92400, expenses: 58200, newClients: 13 },
  { month: 'Jun', deliveries: 187, revenue: 98600, expenses: 61500, newClients: 18 },
  { month: 'Jul', deliveries: 196, revenue: 103200, expenses: 64100, newClients: 14 },
  { month: 'Aug', deliveries: 201, revenue: 108500, expenses: 67200, newClients: 16 },
  { month: 'Sep', deliveries: 189, revenue: 99800, expenses: 62400, newClients: 9 },
  { month: 'Oct', deliveries: 178, revenue: 95200, expenses: 59800, newClients: 11 },
  { month: 'Nov', deliveries: 164, revenue: 89100, expenses: 56200, newClients: 7 },
  { month: 'Dec', deliveries: 152, revenue: 82300, expenses: 54100, newClients: 5 }
];

// Mock data for cargo types
const cargoTypeData = [
  { name: 'Electronics', value: 35 },
  { name: 'Furniture', value: 20 },
  { name: 'Food & Beverages', value: 15 },
  { name: 'Clothing', value: 12 },
  { name: 'Chemicals', value: 9 },
  { name: 'Machinery', value: 7 },
  { name: 'Other', value: 2 },
];

// Mock data for top routes
const topRoutesData = [
  { route: 'New York to Los Angeles', trips: 58, revenue: 32450 },
  { route: 'Chicago to Miami', trips: 42, revenue: 28300 },
  { route: 'Seattle to Denver', trips: 39, revenue: 24800 },
  { route: 'Houston to Phoenix', trips: 37, revenue: 22150 },
  { route: 'Boston to Washington DC', trips: 32, revenue: 18900 },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const MonthlyStatistics: React.FC = () => {
  const [period, setPeriod] = useState('year');
  const [year, setYear] = useState('2025');
  const [summaryStats, setSummaryStats] = useState({
    totalDeliveries: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    avgMargin: 0,
    deliveryGrowth: 0,
    revenueGrowth: 0
  });

  // Calculate summary statistics
  useEffect(() => {

    // Simulating API call delay
    setTimeout(() => {
      const total = monthlyData.reduce((acc, curr) => ({
        deliveries: acc.deliveries + curr.deliveries,
        revenue: acc.revenue + curr.revenue,
        expenses: acc.expenses + curr.expenses
      }), { deliveries: 0, revenue: 0, expenses: 0 });

      const avgMargin = ((total.revenue - total.expenses) / total.revenue * 100).toFixed(2);

      // Calculate YoY growth (mock data)
      const deliveryGrowth = 12.5;
      const revenueGrowth = 15.3;

      setSummaryStats({
        totalDeliveries: total.deliveries,
        totalRevenue: total.revenue,
        totalExpenses: total.expenses,
        avgMargin: parseFloat(avgMargin),
        deliveryGrowth,
        revenueGrowth
      });

    }, 800);
  }, [period, year]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
        <BarChartIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Monthly Statistics</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Period:</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Year:</span>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Deliveries
            </CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalDeliveries}</div>
            <div className="flex items-center pt-1">
              {summaryStats.deliveryGrowth > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{summaryStats.deliveryGrowth}% from previous year</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">{Math.abs(summaryStats.deliveryGrowth)}% from previous year</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</div>
            <div className="flex items-center pt-1">
              {summaryStats.revenueGrowth > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{summaryStats.revenueGrowth}% from previous year</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">{Math.abs(summaryStats.revenueGrowth)}% from previous year</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Expenses
            </CardTitle>
            <Clipboard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalExpenses)}</div>
            <div className="flex items-center pt-1">
              <span className="text-sm text-gray-500">
                {((summaryStats.totalExpenses / summaryStats.totalRevenue) * 100).toFixed(1)}% of revenue
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Margin
            </CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgMargin}%</div>
            <div className="flex items-center pt-1">
              <span className="text-sm text-gray-500">
                Profit: {formatCurrency(summaryStats.totalRevenue - summaryStats.totalExpenses)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue & Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deliveries by Month Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Deliveries by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="deliveries"
                  fill="#3b82f6"
                  name="Deliveries"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cargo Type Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cargo Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={cargoTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                    >
                      {cargoTypeData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} shipments`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 font-medium">Route</th>
                  <th className="py-3 px-4 font-medium text-right">Trips</th>
                  <th className="py-3 px-4 font-medium text-right">Revenue</th>
                  <th className="py-3 px-4 font-medium text-right">Avg Revenue/Trip</th>
                </tr>
              </thead>
              <tbody>
                {topRoutesData.map((route, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{route.route}</td>
                    <td className="py-4 px-4 text-right">{route.trips}</td>
                    <td className="py-4 px-4 text-right">{formatCurrency(route.revenue)}</td>
                    <td className="py-4 px-4 text-right">
                      {formatCurrency(route.revenue / route.trips)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyStatistics;