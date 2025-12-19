import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp,
  TrendingDown,
  Download,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Calendar,
  ArrowUpDown
} from "lucide-react";

interface OperationalReportingDashboardProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  selectedLob: string;
  dateRange: { from: Date; to: Date };
  availableLobs: string[];
  onExport: (reportType: string) => void;
}

export function OperationalReportingDashboard({ 
  userRole, 
  selectedLob, 
  dateRange, 
  availableLobs,
  onExport 
}: OperationalReportingDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState("case-volume");
  const [timeGranularity, setTimeGranularity] = useState("daily");

  // Mock data for charts - would be filtered by LOB and date range in real implementation
  const caseVolumeData = [
    { name: 'Mon', total: 12, completed: 8, pending: 4, escalated: 2 },
    { name: 'Tue', total: 15, completed: 11, pending: 3, escalated: 1 },
    { name: 'Wed', total: 18, completed: 13, pending: 4, escalated: 3 },
    { name: 'Thu', total: 22, completed: 16, pending: 5, escalated: 4 },
    { name: 'Fri', total: 20, completed: 14, pending: 6, escalated: 2 },
    { name: 'Sat', total: 8, completed: 6, pending: 2, escalated: 1 },
    { name: 'Sun', total: 5, completed: 4, pending: 1, escalated: 0 }
  ];

  const processingTimeData = [
    { name: 'Week 1', avgTime: 3.2, target: 4.0 },
    { name: 'Week 2', avgTime: 4.1, target: 4.0 },
    { name: 'Week 3', avgTime: 3.8, target: 4.0 },
    { name: 'Week 4', avgTime: 4.5, target: 4.0 },
    { name: 'Current', avgTime: 4.2, target: 4.0 }
  ];

  const outcomeDistributionData = [
    { name: 'Retain', value: 65, color: '#22c55e' },
    { name: 'Escalate to FLU', value: 20, color: '#f59e0b' },
    { name: 'Escalate to GFC', value: 10, color: '#ef4444' },
    { name: 'Exit', value: 3, color: '#dc2626' },
    { name: 'Rejected', value: 2, color: '#6b7280' }
  ];

  const lobPerformanceData = availableLobs.map(lob => ({
    lob: lob.split(' ')[0], // Shortened name for chart
    totalCases: Math.floor(Math.random() * 50) + 20,
    avgTime: (Math.random() * 2 + 3).toFixed(1),
    escalationRate: (Math.random() * 15 + 10).toFixed(1)
  }));

  const workflowMetrics = {
    hraTotalCases: 234,
    hraCompletedCases: 198,
    hraPendingCases: 36,
    fluAmlCases: 45,
    fluAmlResolved: 38,
    fluAmlPending: 7,
    gfcCases: 18,
    gfcResolved: 14,
    gfcPending: 4,
    avgHraTime: "3.2 days",
    avgFluTime: "2.1 days", 
    avgGfcTime: "1.8 days"
  };

  const getFilteredLobText = () => {
    if (userRole === 'flu-aml') {
      return ` (${selectedLob})`;
    }
    return selectedLob === "all-lobs" ? " (All LOBs)" : ` (${selectedLob})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium">Operational Reporting Dashboard</h3>
          <p className="text-muted-foreground">
            Case management and workflow outcomes{getFilteredLobText()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeGranularity} onValueChange={setTimeGranularity}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onExport('Operational Dashboard')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Workflow Stage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>HRA Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Cases</span>
              <Badge variant="outline">{workflowMetrics.hraTotalCases}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <Badge variant="secondary">{workflowMetrics.hraCompletedCases}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Badge variant="outline">{workflowMetrics.hraPendingCases}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Processing Time</span>
              <Badge variant="outline">{workflowMetrics.avgHraTime}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Building className="h-5 w-5 text-orange-600" />
              <span>FLU AML Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Cases</span>
              <Badge variant="outline">{workflowMetrics.fluAmlCases}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <Badge variant="secondary">{workflowMetrics.fluAmlResolved}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Badge variant="outline">{workflowMetrics.fluAmlPending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Processing Time</span>
              <Badge variant="outline">{workflowMetrics.avgFluTime}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>GFC Stage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Cases</span>
              <Badge variant="outline">{workflowMetrics.gfcCases}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <Badge variant="secondary">{workflowMetrics.gfcResolved}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Badge variant="outline">{workflowMetrics.gfcPending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Processing Time</span>
              <Badge variant="outline">{workflowMetrics.avgGfcTime}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Case Volume Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caseVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                <Bar dataKey="escalated" stackId="a" fill="#ef4444" name="Escalated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Processing Time Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} name="Avg Time (days)" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target (days)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Case Outcome Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={outcomeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {outcomeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {availableLobs.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>LOB Performance Comparison</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lobPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="lob" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="totalCases" fill="#3b82f6" name="Total Cases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpDown className="h-5 w-5" />
            <span>Detailed Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-gray-200 p-3 text-left">Metric</th>
                  <th className="border border-gray-200 p-3 text-left">Current Period</th>
                  <th className="border border-gray-200 p-3 text-left">Previous Period</th>
                  <th className="border border-gray-200 p-3 text-left">Change</th>
                  <th className="border border-gray-200 p-3 text-left">Target</th>
                  <th className="border border-gray-200 p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Total Cases Processed</td>
                  <td className="border border-gray-200 p-3">234</td>
                  <td className="border border-gray-200 p-3">198</td>
                  <td className="border border-gray-200 p-3 text-green-600">+18.2%</td>
                  <td className="border border-gray-200 p-3">220</td>
                  <td className="border border-gray-200 p-3">
                    <Badge variant="secondary">Above Target</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Average Processing Time</td>
                  <td className="border border-gray-200 p-3">4.2 days</td>
                  <td className="border border-gray-200 p-3">3.8 days</td>
                  <td className="border border-gray-200 p-3 text-red-600">+10.5%</td>
                  <td className="border border-gray-200 p-3">4.0 days</td>
                  <td className="border border-gray-200 p-3">
                    <Badge variant="destructive">Above Target</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Escalation Rate</td>
                  <td className="border border-gray-200 p-3">18.5%</td>
                  <td className="border border-gray-200 p-3">22.1%</td>
                  <td className="border border-gray-200 p-3 text-green-600">-16.3%</td>
                  <td className="border border-gray-200 p-3">20.0%</td>
                  <td className="border border-gray-200 p-3">
                    <Badge variant="secondary">Below Target</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Auto-Close Rate</td>
                  <td className="border border-gray-200 p-3">62.3%</td>
                  <td className="border border-gray-200 p-3">58.7%</td>
                  <td className="border border-gray-200 p-3 text-green-600">+6.1%</td>
                  <td className="border border-gray-200 p-3">60.0%</td>
                  <td className="border border-gray-200 p-3">
                    <Badge variant="secondary">Above Target</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 font-medium">Manual Review Rate</td>
                  <td className="border border-gray-200 p-3">37.7%</td>
                  <td className="border border-gray-200 p-3">41.3%</td>
                  <td className="border border-gray-200 p-3 text-green-600">-8.7%</td>
                  <td className="border border-gray-200 p-3">40.0%</td>
                  <td className="border border-gray-200 p-3">
                    <Badge variant="secondary">Below Target</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export and Data Feed Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Download className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Export & Data Integration</p>
              <p className="text-sm text-blue-700 mt-1">
                Operational reporting data can be exported to Excel for further analysis. 
                All metrics are calculated in real-time from case management and workflow data.
              </p>
              <div className="mt-3">
                <p className="text-xs text-blue-600">
                  <strong>Available Exports:</strong> Excel (.xlsx), PDF Report, CSV Data
                </p>
                <p className="text-xs text-blue-600">
                  <strong>Update Frequency:</strong> Real-time as cases are processed and saved
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}