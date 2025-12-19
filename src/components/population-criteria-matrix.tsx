import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { CheckCircle, Clock, XCircle, AlertTriangle, RefreshCw, Shield, Users, FileCheck } from "lucide-react";

const criteriaData = [
  {
    criteria: "High Risk Rating",
    description: "Client has been classified as high risk",
    status: "Active",
    compliance: 98.7,
    totalClients: 2847,
    icon: Shield,
    priority: "Critical"
  },
  {
    criteria: "Refresh Completion",
    description: "Client refresh process has been completed",
    status: "Active", 
    compliance: 94.5,
    totalClients: 2691,
    icon: RefreshCw,
    priority: "High"
  },
  {
    criteria: "Customer Risk Assessment",
    description: "CRR assessment completed based on business line rules",
    status: "Active",
    compliance: 96.8,
    totalClients: 2756,
    icon: FileCheck,
    priority: "High"
  },
  {
    criteria: "CAM Completion",
    description: "Customer Acceptance Model (CAM 2.0) completed",
    status: "Conditional",
    compliance: 89.2,
    totalClients: 2541,
    icon: CheckCircle,
    priority: "Medium"
  },
  {
    criteria: "Active Status",
    description: "Client not in exit/closure status",
    status: "Active",
    compliance: 99.1,
    totalClients: 2823,
    icon: Users,
    priority: "Critical"
  }
];

const businessLineRules = [
  {
    businessLine: "GBGM",
    crr: "Refresh Initiation Date",
    camAlignment: "Most Recent CAM",
    specialRules: "Complex entity structures",
    eligibleClients: 1247,
    completionRate: 96.2
  },
  {
    businessLine: "Consumer",
    crr: "Refresh Completion Date", 
    camAlignment: "Aligned with Refresh",
    specialRules: "Simplified assessment",
    eligibleClients: 856,
    completionRate: 98.1
  },
  {
    businessLine: "Private Bank",
    crr: "Refresh Completion Date",
    camAlignment: "Most Recent CAM",
    specialRules: "Enhanced due diligence",
    eligibleClients: 492,
    completionRate: 94.8
  },
  {
    businessLine: "Merrill Lynch",
    crr: "Refresh Completion Date",
    camAlignment: "Aligned with Refresh", 
    specialRules: "Investment advisory focus",
    eligibleClients: 252,
    completionRate: 97.3
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Conditional": return <Clock className="h-4 w-4 text-orange-500" />;
    case "Inactive": return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
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

export function PopulationCriteriaMatrix() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Eligibility Criteria Matrix</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criteriaData.map((criteria, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <criteria.icon className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{criteria.criteria}</h4>
                      <p className="text-sm text-muted-foreground">{criteria.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(criteria.status)}
                    <Badge variant="outline" className={getPriorityBadgeColor(criteria.priority)}>
                      {criteria.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance Rate</span>
                    <span className="text-sm font-medium">{criteria.compliance}%</span>
                  </div>
                  <Progress value={criteria.compliance} className="h-2" />
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{criteria.totalClients.toLocaleString()} clients eligible</span>
                    <span>{Math.round(criteria.totalClients * criteria.compliance / 100).toLocaleString()} compliant</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <span>Business Line Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Line</TableHead>
                <TableHead>CRR Basis</TableHead>
                <TableHead>CAM Strategy</TableHead>
                <TableHead>Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessLineRules.map((rule, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.businessLine}</p>
                      <p className="text-xs text-muted-foreground">{rule.eligibleClients} clients</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {rule.crr}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{rule.camAlignment}</p>
                      <p className="text-xs text-muted-foreground">{rule.specialRules}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Progress value={rule.completionRate} className="h-1 flex-1" />
                        <span className="text-xs font-medium">{rule.completionRate}%</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">CAM 2.0 Strategy Notes</p>
                <ul className="text-blue-700 mt-1 space-y-1">
                  <li>• <strong>Refresh date and CAM date NOT aligned:</strong> System aligns to most recent CAM completion based on HRS case initiation date within last 12 months. Need consideration for missing CAM in initial stage.</li>
                  <li>• <strong>Refresh date and CAM date aligned:</strong> HRS case waits until CAM has been completed before proceeding.</li>
                  <li>• <strong>Consumer & Consumer Investment FLUs:</strong> CAM completed post-refresh required.</li>
                  <li>• <strong>Merrill Lynch, Private Bank, Global Banking Global Markets FLUs:</strong> CAM completed as part of the refresh process.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}