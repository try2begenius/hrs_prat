import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { 
  TrendingUp,
  Target,
  Clock,
  Database,
  Download,
  AlertTriangle,
  CheckCircle,
  Activity,
  Gauge,
  FileText
} from "lucide-react";

interface SpiPerformanceReportingProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  selectedLob: string;
  dateRange: { from: Date; to: Date };
  availableLobs: string[];
  onExport: (reportType: string) => void;
}

export function SpiPerformanceReporting({ 
  userRole, 
  selectedLob, 
  dateRange, 
  availableLobs,
  onExport 
}: SpiPerformanceReportingProps) {
  const [selectedSpi, setSelectedSpi] = useState("all-spis");
  const [viewType, setViewType] = useState("summary");

  // Mock SPI data - in real implementation, this would come from the reporting database
  const spiMetrics = {
    processingTimeCompliance: {
      target: 4.0,
      actual: 4.2,
      compliance: 94.5,
      trend: "improving"
    },
    volumeProcessing: {
      target: 200,
      actual: 234,
      compliance: 117.0,
      trend: "improving"
    },
    qualityMetrics: {
      accuracyRate: 96.8,
      completenessRate: 98.2,
      reworkRate: 3.2,
      escalationAccuracy: 94.1
    },
    automationMetrics: {
      autoCloseRate: 62.3,
      straightThroughProcessing: 45.7,
      manualInterventionRate: 37.7,
      exceptionRate: 16.6
    }
  };

  const spiTrendData = [
    { period: 'Jan', processingTime: 4.5, volumeCompliance: 92, qualityScore: 94.2, automation: 58.1 },
    { period: 'Feb', processingTime: 4.3, volumeCompliance: 96, qualityScore: 95.1, automation: 59.8 },
    { period: 'Mar', processingTime: 4.1, volumeCompliance: 89, qualityScore: 93.7, automation: 61.2 },
    { period: 'Apr', processingTime: 4.4, volumeCompliance: 103, qualityScore: 95.8, automation: 60.5 },
    { period: 'May', processingTime: 4.0, volumeCompliance: 108, qualityScore: 96.3, automation: 62.1 },
    { period: 'Jun', processingTime: 4.2, volumeCompliance: 117, qualityScore: 96.8, automation: 62.3 }
  ];

  const processPerformanceData = [
    { process: 'Case Creation', volume: 245, avgTime: '2.1 hrs', sla: '4 hrs', compliance: 98.2 },
    { process: 'Initial Review', volume: 234, avgTime: '1.8 days', sla: '2 days', compliance: 94.5 },
    { process: 'Risk Assessment', volume: 156, avgTime: '3.2 days', sla: '4 days', compliance: 92.1 },
    { process: 'Escalation Review', volume: 45, avgTime: '1.5 days', sla: '2 days', compliance: 96.7 },
    { process: 'Final Decision', volume: 198, avgTime: '0.8 days', sla: '1 day', compliance: 99.1 }
  ];

  const dataQualityMetrics = [
    { attribute: 'Customer Information', completeness: 99.2, accuracy: 98.1, timeliness: 97.8 },
    { attribute: 'Risk Factors', completeness: 96.8, accuracy: 94.2, timeliness: 95.1 },
    { attribute: 'Risk Mitigants', completeness: 94.5, accuracy: 92.8, timeliness: 93.4 },
    { attribute: 'Comments & Decisions', completeness: 98.7, accuracy: 96.5, timeliness: 98.9 },
    { attribute: 'Attachments', completeness: 91.3, accuracy: 97.2, timeliness: 94.6 }
  ];

  const systemicIssueData = [
    { issue: 'Data Integration Delays', frequency: 12, avgResolutionTime: '4.2 hrs', impact: 'Medium' },
    { issue: 'Manual Process Bottlenecks', frequency: 8, avgResolutionTime: '2.1 days', impact: 'High' },
    { issue: 'Workflow Routing Errors', frequency: 5, avgResolutionTime: '6.3 hrs', impact: 'Low' },
    { issue: 'User Access Issues', frequency: 3, avgResolutionTime: '1.5 hrs', impact: 'Low' }
  ];

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return "text-green-600";
    if (compliance >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "improving" ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium">SPI/Process Performance Reporting</h3>
          <p className="text-muted-foreground">
            Comprehensive performance analytics for HRA operations and data quality
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedSpi} onValueChange={setSelectedSpi}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select SPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-spis">All SPIs</SelectItem>
              <SelectItem value="processing-time">Processing Time</SelectItem>
              <SelectItem value="volume-processing">Volume Processing</SelectItem>
              <SelectItem value="quality-metrics">Quality Metrics</SelectItem>
              <SelectItem value="automation">Automation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="trends">Trends</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onExport('SPI Performance')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key SPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Processing Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Target</span>
              <Badge variant="outline">{spiMetrics.processingTimeCompliance.target} days</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Actual</span>
              <Badge variant="secondary">{spiMetrics.processingTimeCompliance.actual} days</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${getComplianceColor(spiMetrics.processingTimeCompliance.compliance)}`}>
                    {spiMetrics.processingTimeCompliance.compliance}%
                  </span>
                  {getTrendIcon(spiMetrics.processingTimeCompliance.trend)}
                </div>
              </div>
              <Progress value={spiMetrics.processingTimeCompliance.compliance} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Volume Processing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Target</span>
              <Badge variant="outline">{spiMetrics.volumeProcessing.target} cases</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Actual</span>
              <Badge variant="secondary">{spiMetrics.volumeProcessing.actual} cases</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Achievement</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-green-600">
                    {spiMetrics.volumeProcessing.compliance}%
                  </span>
                  {getTrendIcon(spiMetrics.volumeProcessing.trend)}
                </div>
              </div>
              <Progress value={Math.min(spiMetrics.volumeProcessing.compliance, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span>Quality Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="font-medium">{spiMetrics.qualityMetrics.accuracyRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completeness</p>
                <p className="font-medium">{spiMetrics.qualityMetrics.completenessRate}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Rework Rate</p>
                <p className="font-medium text-orange-600">{spiMetrics.qualityMetrics.reworkRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Escalation Accuracy</p>
                <p className="font-medium">{spiMetrics.qualityMetrics.escalationAccuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span>Automation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Auto-Close</p>
                <p className="font-medium">{spiMetrics.automationMetrics.autoCloseRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">STP Rate</p>
                <p className="font-medium">{spiMetrics.automationMetrics.straightThroughProcessing}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Manual Rate</p>
                <p className="font-medium text-orange-600">{spiMetrics.automationMetrics.manualInterventionRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Exception Rate</p>
                <p className="font-medium text-red-600">{spiMetrics.automationMetrics.exceptionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SPI Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>SPI Performance Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={spiTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="volumeCompliance" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Volume Compliance %" />
              <Area type="monotone" dataKey="qualityScore" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Quality Score %" />
              <Area type="monotone" dataKey="automation" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Automation %" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Process Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Process Performance Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-gray-200 p-3 text-left">Process</th>
                  <th className="border border-gray-200 p-3 text-left">Volume</th>
                  <th className="border border-gray-200 p-3 text-left">Avg Time</th>
                  <th className="border border-gray-200 p-3 text-left">SLA</th>
                  <th className="border border-gray-200 p-3 text-left">Compliance</th>
                  <th className="border border-gray-200 p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {processPerformanceData.map((process, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 p-3 font-medium">{process.process}</td>
                    <td className="border border-gray-200 p-3">{process.volume}</td>
                    <td className="border border-gray-200 p-3">{process.avgTime}</td>
                    <td className="border border-gray-200 p-3">{process.sla}</td>
                    <td className="border border-gray-200 p-3">
                      <span className={getComplianceColor(process.compliance)}>
                        {process.compliance}%
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3">
                      <Badge variant={process.compliance >= 95 ? "secondary" : process.compliance >= 90 ? "outline" : "destructive"}>
                        {process.compliance >= 95 ? "Good" : process.compliance >= 90 ? "Acceptable" : "At Risk"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Quality Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {dataQualityMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{metric.attribute}</span>
                    <span className="text-sm text-muted-foreground">
                      Avg: {((metric.completeness + metric.accuracy + metric.timeliness) / 3).toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Completeness</p>
                      <p className="font-medium text-sm">{metric.completeness}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="font-medium text-sm">{metric.accuracy}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Timeliness</p>
                      <p className="font-medium text-sm">{metric.timeliness}%</p>
                    </div>
                  </div>
                  <Progress value={(metric.completeness + metric.accuracy + metric.timeliness) / 3} className="h-1" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Systemic Issues & Impacts</h4>
              <div className="space-y-3">
                {systemicIssueData.map((issue, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{issue.issue}</span>
                      <Badge variant={issue.impact === 'High' ? 'destructive' : issue.impact === 'Medium' ? 'outline' : 'secondary'}>
                        {issue.impact}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span>Frequency: </span>
                        <span className="font-medium">{issue.frequency} times</span>
                      </div>
                      <div>
                        <span>Avg Resolution: </span>
                        <span className="font-medium">{issue.avgResolutionTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Integration Information */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Database className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-purple-800">SPI Database Integration</p>
              <p className="text-sm text-purple-700 mt-1">
                All attributes captured in the HRA user interface are automatically submitted to the reporting database for comprehensive SPI analysis. 
                This includes real-time performance monitoring, data quality assessment, and process optimization metrics.
              </p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-purple-600">
                <div>
                  <p><strong>Data Points Captured:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All customer information attributes</li>
                    <li>Risk factor assessments and changes</li>
                    <li>Processing timestamps and durations</li>
                    <li>User actions and decision points</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Reporting Capabilities:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Real-time SPI monitoring</li>
                    <li>Process bottleneck identification</li>
                    <li>Data quality trend analysis</li>
                    <li>Automated exception reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}