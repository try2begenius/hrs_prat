import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { CheckCircle, Clock, AlertTriangle, RefreshCw, MoreHorizontal, Eye, FileText, Users, Calendar } from "lucide-react";

const hraCases = [
  {
    caseId: "HRA-2024-001",
    clientName: "Global Investment Holdings LLC",
    clientId: "GCI-789456123",
    businessLine: "GBGM",
    refreshDate: "2024-01-15",
    camDate: "2024-01-12",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Johnson",
    daysOpen: 5,
    completionPercent: 65,
    riskScore: 8.7,
    escalated: false
  },
  {
    caseId: "HRA-2024-002", 
    clientName: "International Trade Corp",
    clientId: "COP-456789321",
    businessLine: "Consumer",
    refreshDate: "2024-01-18",
    camDate: "2024-01-18",
    status: "Completed",
    priority: "Medium",
    assignee: "Mike Chen",
    daysOpen: 2,
    completionPercent: 100,
    riskScore: 7.2,
    escalated: false
  },
  {
    caseId: "HRA-2024-003",
    clientName: "Sovereign Wealth Fund Alpha",
    clientId: "PTY-123789456",
    businessLine: "Private Bank",
    refreshDate: "2024-01-20",
    camDate: "Pending",
    status: "Waiting CAM",
    priority: "Critical",
    assignee: "Lisa Rodriguez",
    daysOpen: 3,
    completionPercent: 25,
    riskScore: 9.1,
    escalated: true
  },
  {
    caseId: "HRA-2024-004",
    clientName: "Tech Startup Ventures",
    clientId: "GCI-987654321",
    businessLine: "Merrill Lynch",
    refreshDate: "2024-01-22",
    camDate: "2024-01-20",
    status: "Review Required",
    priority: "High",
    assignee: "David Park",
    daysOpen: 1,
    completionPercent: 80,
    riskScore: 6.8,
    escalated: false
  },
  {
    caseId: "HRA-2024-005",
    clientName: "Emerging Markets Fund",
    clientId: "COP-654321987",
    businessLine: "GBGM",
    refreshDate: "2024-01-25",
    camDate: "2024-01-23",
    status: "Failed",
    priority: "Critical",
    assignee: "Emma Wilson",
    daysOpen: 8,
    completionPercent: 0,
    riskScore: 8.9,
    escalated: true
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "In Progress": return <RefreshCw className="h-4 w-4 text-blue-500" />;
    case "Waiting CAM": return <Clock className="h-4 w-4 text-orange-500" />;
    case "Review Required": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "Failed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Completed": return "default";
    case "In Progress": return "secondary";
    case "Waiting CAM": return "outline";
    case "Review Required": return "secondary";
    case "Failed": return "destructive";
    default: return "outline";
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "Critical": return "bg-red-100 text-red-800 border-red-200";
    case "High": return "bg-orange-100 text-orange-800 border-orange-200";  
    case "Medium": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRiskScoreColor = (score: number) => {
  if (score >= 8.5) return "text-red-600 font-medium";
  if (score >= 7.0) return "text-orange-600 font-medium";
  if (score >= 5.0) return "text-blue-600 font-medium";
  return "text-green-600 font-medium";
};

export function HRACaseTracking() {
  const totalCases = hraCases.length;
  const completedCases = hraCases.filter(c => c.status === "Completed").length;
  const inProgressCases = hraCases.filter(c => c.status === "In Progress").length;
  const escalatedCases = hraCases.filter(c => c.escalated).length;
  const avgCompletionTime = 3.2; // days

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>HRA Case Tracking</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Avg: {avgCompletionTime} days</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Cases</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{totalCases}</div>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">{completedCases}</div>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-orange-900 mt-1">{inProgressCases}</div>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Escalated</span>
            </div>
            <div className="text-2xl font-bold text-red-900 mt-1">{escalatedCases}</div>
          </div>
        </div>

        {/* Cases Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Business Line</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Days Open</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hraCases.map((hrCase, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {hrCase.caseId}
                    </Badge>
                    {hrCase.escalated && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{hrCase.clientName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{hrCase.clientId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {hrCase.businessLine}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(hrCase.status)}
                    <Badge variant={getStatusBadgeVariant(hrCase.status)} className="text-xs">
                      {hrCase.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${getPriorityBadgeColor(hrCase.priority)}`}>
                    {hrCase.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={hrCase.completionPercent} className="h-1" />
                    <span className="text-xs font-medium">{hrCase.completionPercent}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${getRiskScoreColor(hrCase.riskScore)}`}>
                    {hrCase.riskScore}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {hrCase.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{hrCase.assignee}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${
                    hrCase.daysOpen > 5 ? 'text-red-600' : 
                    hrCase.daysOpen > 3 ? 'text-orange-600' : 
                    'text-green-600'
                  }`}>
                    {hrCase.daysOpen}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reassign Case
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}