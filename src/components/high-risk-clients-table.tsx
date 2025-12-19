import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertTriangle, Eye, FileText, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const highRiskClients = [
  {
    id: "CL-001",
    name: "Oceanic Holdings Ltd",
    type: "Corporate",
    riskScore: 95,
    jurisdiction: "Cayman Islands",
    lastReview: "2024-09-15",
    alerts: 8,
    status: "Under Investigation"
  },
  {
    id: "CL-002",
    name: "Global Trade Solutions",
    type: "Corporate",
    riskScore: 92,
    jurisdiction: "Panama",
    lastReview: "2024-09-20",
    alerts: 6,
    status: "Enhanced Monitoring"
  },
  {
    id: "CL-003",
    name: "Pacific Investment Group",
    type: "Investment",
    riskScore: 89,
    jurisdiction: "British Virgin Islands",
    lastReview: "2024-09-18",
    alerts: 12,
    status: "Under Investigation"
  },
  {
    id: "CL-004",
    name: "Alexander Petrov",
    type: "Retail",
    riskScore: 87,
    jurisdiction: "Cyprus",
    lastReview: "2024-09-22",
    alerts: 4,
    status: "Enhanced Monitoring"
  },
  {
    id: "CL-005",
    name: "Dragon Capital Bank",
    type: "Banking",
    riskScore: 85,
    jurisdiction: "Luxembourg",
    lastReview: "2024-09-25",
    alerts: 3,
    status: "Active Monitoring"
  },
  {
    id: "CL-006",
    name: "Emirates Trading Co",
    type: "Corporate",
    riskScore: 84,
    jurisdiction: "UAE",
    lastReview: "2024-09-21",
    alerts: 7,
    status: "Enhanced Monitoring"
  },
  {
    id: "CL-007",
    name: "Sophia Chen",
    type: "Retail",
    riskScore: 82,
    jurisdiction: "Hong Kong",
    lastReview: "2024-09-19",
    alerts: 5,
    status: "Active Monitoring"
  },
  {
    id: "CL-008",
    name: "Nordic Investment Fund",
    type: "Investment",
    riskScore: 81,
    jurisdiction: "Switzerland",
    lastReview: "2024-09-23",
    alerts: 2,
    status: "Active Monitoring"
  }
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Under Investigation": return "destructive";
    case "Enhanced Monitoring": return "default";
    case "Active Monitoring": return "secondary";
    default: return "outline";
  }
};

const getRiskScoreColor = (score: number) => {
  if (score >= 90) return "text-red-600";
  if (score >= 80) return "text-orange-600";
  return "text-yellow-600";
};

export function HighRiskClientsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>High Risk Clients (Score ≥ 80)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Last Review</TableHead>
              <TableHead>Alerts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {highRiskClients.map((client, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{client.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${getRiskScoreColor(client.riskScore)}`}>
                      {client.riskScore}
                    </span>
                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          client.riskScore >= 90 ? 'bg-red-500' :
                          client.riskScore >= 80 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${client.riskScore}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.jurisdiction}</TableCell>
                <TableCell>{client.lastReview}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {client.alerts > 5 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span>{client.alerts}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(client.status)}>
                    {client.status}
                  </Badge>
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
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Update Risk Score
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