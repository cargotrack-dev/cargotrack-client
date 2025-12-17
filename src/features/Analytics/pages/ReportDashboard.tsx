// src/features/Analytics/pages/ReportDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';
import { formatDate } from '../utils/chartUtils';

interface ReportData {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'performance';
  lastRun: string;
  createdBy: string;
  isScheduled: boolean;
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly';
}

interface ReportMetric {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

const ReportDashboard: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await fetch('/api/reports');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockReports: ReportData[] = [
          {
            id: '1',
            name: 'Monthly Revenue Report',
            type: 'financial',
            lastRun: '2025-04-01T10:00:00',
            createdBy: 'Admin User',
            isScheduled: true,
            scheduleFrequency: 'monthly'
          },
          {
            id: '2',
            name: 'Driver Performance Analysis',
            type: 'performance',
            lastRun: '2025-04-15T14:30:00',
            createdBy: 'Operations Manager',
            isScheduled: false
          },
          {
            id: '3',
            name: 'Fleet Utilization Report',
            type: 'operational',
            lastRun: '2025-04-10T09:15:00',
            createdBy: 'Fleet Manager',
            isScheduled: true,
            scheduleFrequency: 'weekly'
          },
          {
            id: '4',
            name: 'Customer Satisfaction Survey',
            type: 'performance',
            lastRun: '2025-04-05T16:45:00',
            createdBy: 'Customer Relations',
            isScheduled: true,
            scheduleFrequency: 'monthly'
          },
          {
            id: '5',
            name: 'Route Efficiency Analysis',
            type: 'operational',
            lastRun: '2025-04-12T11:20:00',
            createdBy: 'Operations Manager',
            isScheduled: false
          }
        ];

        const mockMetrics: ReportMetric[] = [
          {
            name: 'Generated Reports',
            value: 28,
            change: 12.5,
            changeType: 'increase'
          },
          {
            name: 'Scheduled Reports',
            value: 15,
            change: 7.2,
            changeType: 'increase'
          },
          {
            name: 'Average Generation Time',
            value: 4.2, // seconds
            change: -0.8,
            changeType: 'decrease'
          },
          {
            name: 'Reports Viewed',
            value: 142,
            change: 23.6,
            changeType: 'increase'
          }
        ];
        
        setReports(mockReports);
        setMetrics(mockMetrics);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report ${reportId}`);
    // Implement report generation logic
  };

  const handleViewReport = (reportId: string) => {
    console.log(`Viewing report ${reportId}`);
    // Navigate to report viewer
  };

  const filteredReports = reports.filter(report => {
    // Filter by type if not "all"
    if (activeTab !== 'all' && report.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !report.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Report Dashboard</h1>
          <p className="text-gray-500">Manage and generate analytical reports</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>Create New Report</Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <h3 className="text-gray-500 font-medium">{metric.name}</h3>
            <div className="flex items-end mt-2">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className={`ml-2 text-sm ${
                metric.changeType === 'increase' ? 'text-green-500' : 
                metric.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Tabs 
          defaultValue="all" 
          className="w-full md:w-auto mb-4 md:mb-0"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="w-full md:w-64">
          <Input 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-4">
            <div className="col-span-4">Report Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Last Run</div>
            <div className="col-span-2">Schedule</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          <div className="bg-white divide-y divide-gray-200">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div key={report.id} className="px-6 py-4 grid grid-cols-12 gap-4 hover:bg-gray-50">
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">Created by {report.createdBy}</div>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.type === 'financial' ? 'bg-blue-100 text-blue-800' :
                      report.type === 'operational' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {formatDate(new Date(report.lastRun))}
                  </div>
                  <div className="col-span-2">
                    {report.isScheduled ? (
                      <span className="text-sm text-gray-500">
                        {report.scheduleFrequency && 
                         (report.scheduleFrequency.charAt(0).toUpperCase() + 
                          report.scheduleFrequency.slice(1))}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not scheduled</span>
                    )}
                  </div>
                  <div className="col-span-2 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewReport(report.id)}
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport(report.id)}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No reports found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;