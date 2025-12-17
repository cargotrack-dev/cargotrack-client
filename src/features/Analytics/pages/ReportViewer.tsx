// src/features/Analytics/pages/ReportViewer.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../UI/components/ui/tabs';
import { formatDate } from '../utils/chartUtils';

// Properly define types instead of using 'any'
interface MetricData {
  label: string;
  value: string;
  change: string;
}

interface ChartData {
  chartType: 'pie' | 'line' | 'bar';
  data: {
    labels: string[];
    values?: number[];
    datasets?: Array<{
      label: string;
      values: number[];
    }>;
  };
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TextData {
  text: string;
}

interface SummaryData {
  text: string;
  metrics: MetricData[];
}

// Union type for section content
type SectionContent = SummaryData | ChartData | TableData | TextData | MetricData[];

interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'metric' | 'text';
  content: SectionContent;
}

interface ReportData {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'performance';
  lastRun: string;
  createdBy: string;
  timeRange: {
    start: string;
    end: string;
  };
  sections: ReportSection[];
}

const ReportViewer: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('view');
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        // const response = await fetch(`/api/reports/${reportId}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockReport: ReportData = {
          id: reportId || '1',
          name: 'Monthly Revenue Report - April 2025',
          description: 'Comprehensive analysis of revenue streams, expenses, and profit margins for April 2025.',
          type: 'financial',
          lastRun: '2025-04-15T14:30:00',
          createdBy: 'Finance Department',
          timeRange: {
            start: '2025-04-01',
            end: '2025-04-30'
          },
          sections: [
            {
              id: '1',
              title: 'Executive Summary',
              type: 'summary',
              content: {
                text: 'April 2025 showed a 12% increase in overall revenue compared to March, with the highest growth in the express delivery segment. Operating expenses increased by only 5%, resulting in improved profit margins across all business units.',
                metrics: [
                  { label: 'Total Revenue', value: '$1,245,000', change: '+12%' },
                  { label: 'Operating Expenses', value: '$850,000', change: '+5%' },
                  { label: 'Net Profit', value: '$395,000', change: '+31%' }
                ]
              }
            },
            {
              id: '2',
              title: 'Revenue by Service Type',
              type: 'chart',
              content: {
                chartType: 'pie',
                data: {
                  labels: ['Standard Delivery', 'Express Delivery', 'Special Handling', 'International Shipping'],
                  values: [450000, 380000, 215000, 200000]
                }
              }
            },
            {
              id: '3',
              title: 'Monthly Revenue Trend',
              type: 'chart',
              content: {
                chartType: 'line',
                data: {
                  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                  datasets: [
                    {
                      label: 'Revenue',
                      values: [980000, 1050000, 1110000, 1245000]
                    },
                    {
                      label: 'Expenses',
                      values: [750000, 780000, 810000, 850000]
                    }
                  ]
                }
              }
            },
            {
              id: '4',
              title: 'Revenue by Region',
              type: 'table',
              content: {
                headers: ['Region', 'Revenue', 'YoY Change', 'Contribution'],
                rows: [
                  ['North America', '$520,000', '+15%', '41.8%'],
                  ['Europe', '$350,000', '+10%', '28.1%'],
                  ['Asia-Pacific', '$275,000', '+18%', '22.1%'],
                  ['Rest of World', '$100,000', '+5%', '8.0%']
                ]
              }
            },
            {
              id: '5',
              title: 'Key Insights & Recommendations',
              type: 'text',
              content: {
                text: `
                  <h3>Key Insights:</h3>
                  <ul>
                    <li>Express delivery services showed the highest growth rate at 18%.</li>
                    <li>The Asia-Pacific region continues to be our fastest-growing market.</li>
                    <li>Fuel costs have increased by 7% but were offset by improved route optimization.</li>
                  </ul>
                  
                  <h3>Recommendations:</h3>
                  <ul>
                    <li>Increase marketing efforts for express delivery services in the North American market.</li>
                    <li>Evaluate pricing strategies in the Asia-Pacific region to maximize the growth trend.</li>
                    <li>Continue investments in route optimization to counteract rising fuel costs.</li>
                  </ul>
                `
              }
            }
          ]
        };
        
        setReport(mockReport);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch report:", err);
        setError("Failed to load report data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    } else {
      setError("Report ID is missing");
      setLoading(false);
    }
  }, [reportId]);

  const handleExport = () => {
    console.log(`Exporting report in ${exportFormat} format`);
    // Implement export functionality
  };

  const handlePrint = () => {
    console.log("Printing report");
    window.print();
  };

  const handleShare = () => {
    console.log("Sharing report");
    // Implement share functionality
  };

  const renderSectionContent = (section: ReportSection) => {
    switch (section.type) {
      case 'summary': {
        const summaryContent = section.content as SummaryData;
        return (
          <div className="space-y-4">
            <p className="text-gray-700">{summaryContent.text}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {summaryContent.metrics.map((metric, index) => (
                <Card key={index} className="p-4">
                  <div className="text-sm text-gray-500">{metric.label}</div>
                  <div className="flex items-end mt-1">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className={`ml-2 text-sm ${
                      metric.change.startsWith('+') ? 'text-green-500' : 
                      metric.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      }
        
      case 'chart': {
        const chartContent = section.content as ChartData;
        return (
          <div className="border rounded-md p-4 h-64 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">{chartContent.chartType.toUpperCase()} Chart</div>
              <p className="text-gray-500">
                {chartContent.chartType === 'pie' ? 
                  `Showing distribution across ${chartContent.data.labels.length} categories` :
                  `Showing trend data for ${chartContent.data.datasets?.length || 1} datasets`
                }
              </p>
            </div>
          </div>
        );
      }
        
      case 'table': {
        const tableContent = section.content as TableData;
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableContent.headers.map((header, index) => (
                    <th 
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableContent.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
        
      case 'text': {
        const textContent = section.content as TextData;
        return (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: textContent.text }}
          />
        );
      }
        
      default:
        return <div>Unsupported section type</div>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading report data...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!report) {
    return <div className="flex justify-center items-center h-64">Report not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{report.name}</h1>
          <p className="text-gray-500">{report.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>Generated on {formatDate(new Date(report.lastRun))}</span>
            <span className="mx-2">•</span>
            <span>Period: {formatDate(new Date(report.timeRange.start))} - {formatDate(new Date(report.timeRange.end))}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Format:</span>
            <select 
              className="text-sm border rounded-md p-1"
              value={exportFormat}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="view">View Report</TabsTrigger>
          <TabsTrigger value="settings">Report Settings</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="mt-6">
          <div className="space-y-8">
            {report.sections.map((section) => (
              <div key={section.id} className="border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h2 className="text-lg font-medium">{section.title}</h2>
                </div>
                <div className="p-6">
                  {renderSectionContent(section)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Report Settings</h2>
            <p className="text-gray-500">Configure report parameters, schedule, and notifications.</p>
            
            {/* Report settings form would go here */}
            <div className="text-center text-gray-500 my-8">
              Report settings interface not implemented in this demo
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Run History</h2>
            <p className="text-gray-500">View previous executions of this report.</p>
            
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Run By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-15 14:30:00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Automated Schedule</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12s</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Success
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-03-15 14:30:00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Automated Schedule</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">11s</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Success
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportViewer;