'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, Users, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { exportToCSV } from "@/lib/utils"
import { mockCampaignData, mockRevenueData } from "@/lib/mock-data"

// Report types available
const reportTypes = [
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Comprehensive campaign performance analysis',
    icon: TrendingUp,
    status: 'available',
    color: 'text-green-600'
  },
  {
    id: 'revenue',
    title: 'Revenue Report',
    description: 'Financial performance and ROI analysis',
    icon: DollarSign,
    status: 'available',
    color: 'text-blue-600'
  },
  {
    id: 'audience',
    title: 'Audience Report',
    description: 'User demographics and behavior insights',
    icon: Users,
    status: 'coming-soon',
    color: 'text-purple-600'
  },
  {
    id: 'conversion',
    title: 'Conversion Report',
    description: 'Conversion funnel and optimization insights',
    icon: Target,
    status: 'coming-soon',
    color: 'text-orange-600'
  }
]

// Recent reports
const recentReports = [
  {
    id: 1,
    name: 'Q4 2024 Performance Summary',
    type: 'Performance Report',
    generatedAt: '2024-12-15',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 2,
    name: 'November Revenue Analysis',
    type: 'Revenue Report',
    generatedAt: '2024-12-01',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: 3,
    name: 'Campaign ROI Report',
    type: 'Performance Report',
    generatedAt: '2024-11-28',
    size: '3.1 MB',
    format: 'PDF'
  }
]
const generateReport = (reportId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (reportId) {
      case 'performance':
        // Generate performance report with campaign data
        exportToCSV(
          mockCampaignData,
          `performance_report_${today}`,
          {
            id: 'ID',
            campaign: 'Campaign Name',
            impressions: 'Impressions',
            clicks: 'Clicks',
            conversions: 'Conversions',
            cost: 'Cost ($)',
            revenue: 'Revenue ($)',
            roas: 'ROAS',
            date: 'Date',
            status: 'Status'
          }
        );
        break;
        
      case 'revenue':
        // Generate revenue report with revenue data
        exportToCSV(
          mockRevenueData,
          `revenue_report_${today}`,
          {
            id: 'ID',
            name: 'Date',
            date: 'Full Date',
            value: 'Revenue ($)',
            previousValue: 'Previous Revenue ($)',
            category: 'Category'
          }
        );
        break;
        
      default:
        console.error(`Report type ${reportId} not implemented yet`);
    }
  };
function ReportTypeCard({ report }: { report: typeof reportTypes[0] }) {
  const Icon = report.icon
  const isAvailable = report.status === 'available'

  return (
    <Card className={`transition-all duration-200 ${isAvailable ? 'hover:shadow-md cursor-pointer' : 'opacity-60'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg bg-muted ${report.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant={isAvailable ? 'default' : 'secondary'}>
            {isAvailable ? 'Available' : 'Coming Soon'}
          </Badge>
        </div>
        <CardTitle className="text-lg">{report.title}</CardTitle>
        <CardDescription>{report.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full" 
          disabled={!isAvailable}
          variant={isAvailable ? 'default' : 'outline'}
          onClick={() => isAvailable && generateReport(report.id)}
        >
          {isAvailable ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </>
          ) : (
            'Coming Soon'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  // Function to generate and download report based on report type
  

  const handleDownloadReport = (reportId: number) => {
    // Find the report in recentReports
    const report = recentReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Determine which data to use based on report type
    if (report.type === 'Performance Report') {
      generateReport('performance');
    } else if (report.type === 'Revenue Report') {
      generateReport('revenue');
    } else {
      console.log(`Downloading report ${reportId} - Not implemented yet`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate comprehensive reports and export your analytics data.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report) => (
            <ReportTypeCard key={report.id} report={report} />
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Reports</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.generatedAt}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.format}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>
              Create custom reports with specific metrics and date ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <FileText className="mr-2 h-4 w-4" />
              Build Custom Report
              <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>
              Set up automated report generation and delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Calendar className="mr-2 h-4 w-4" />
              Manage Schedules
              <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}