import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertTriangle, MapPin } from "lucide-react";

const jurisdictionData = [
  { country: "United States", riskLevel: "Low", clients: 4234, highRiskClients: 23, riskScore: 15 },
  { country: "United Kingdom", riskLevel: "Low", clients: 2847, highRiskClients: 12, riskScore: 18 },
  { country: "Switzerland", riskLevel: "Medium", clients: 1523, highRiskClients: 45, riskScore: 42 },
  { country: "Cayman Islands", riskLevel: "High", clients: 892, highRiskClients: 67, riskScore: 78 },
  { country: "Panama", riskLevel: "High", clients: 634, highRiskClients: 89, riskScore: 85 },
  { country: "British Virgin Islands", riskLevel: "High", clients: 423, highRiskClients: 34, riskScore: 82 },
  { country: "Luxembourg", riskLevel: "Medium", clients: 1205, highRiskClients: 28, riskScore: 38 },
  { country: "Singapore", riskLevel: "Low", clients: 1689, highRiskClients: 19, riskScore: 22 }
];

const getRiskBadgeVariant = (riskLevel: string) => {
  switch (riskLevel) {
    case "High": return "destructive";
    case "Medium": return "default";
    case "Low": return "secondary";
    default: return "outline";
  }
};

export function JurisdictionRiskMap() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Jurisdiction Risk Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country/Jurisdiction</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Total Clients</TableHead>
                <TableHead>High Risk Clients</TableHead>
                <TableHead>Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jurisdictionData.map((jurisdiction, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{jurisdiction.country}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(jurisdiction.riskLevel)}>
                      {jurisdiction.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{jurisdiction.clients.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {jurisdiction.highRiskClients > 50 && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{jurisdiction.highRiskClients}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div 
                          className={`h-full ${
                            jurisdiction.riskScore >= 70 ? 'bg-red-500' :
                            jurisdiction.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${jurisdiction.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm">{jurisdiction.riskScore}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>High Risk Alerts by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-900">Caribbean</p>
                <p className="text-sm text-red-700">23 jurisdictions</p>
              </div>
              <Badge variant="destructive">156 alerts</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-900">Eastern Europe</p>
                <p className="text-sm text-blue-700">12 jurisdictions</p>
              </div>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">89 alerts</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-900">Middle East</p>
                <p className="text-sm text-blue-700">8 jurisdictions</p>
              </div>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">67 alerts</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg border border-blue-300">
              <div>
                <p className="font-medium text-blue-900">North America</p>
                <p className="text-sm text-blue-700">3 jurisdictions</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">34 alerts</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}