import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { MoreHorizontal, Eye, Settings, RefreshCw, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const tradeAllocations = [
  {
    tradeId: "TRD-001",
    instrument: "AAPL",
    totalQuantity: 10000,
    allocated: 9850,
    algorithm: "Pro-Rata",
    scenario: "Standard",
    status: "Completed",
    accounts: 12,
    avgFillPrice: 175.25,
    timestamp: "09:15:32",
    allocatedPercentage: 98.5
  },
  {
    tradeId: "TRD-002",
    instrument: "MSFT",
    totalQuantity: 7500,
    allocated: 7500,
    algorithm: "Priority-Based",
    scenario: "High Priority",
    status: "Completed",
    accounts: 8,
    avgFillPrice: 338.50,
    timestamp: "09:18:45",
    allocatedPercentage: 100
  },
  {
    tradeId: "TRD-003",
    instrument: "GOOGL",
    totalQuantity: 5000,
    allocated: 4200,
    algorithm: "Size-Weighted",
    scenario: "Partial Fill",
    status: "Pending",
    accounts: 15,
    avgFillPrice: 2650.75,
    timestamp: "09:22:18",
    allocatedPercentage: 84
  },
  {
    tradeId: "TRD-004",
    instrument: "TSLA",
    totalQuantity: 12000,
    allocated: 11750,
    algorithm: "Custom Rules",
    scenario: "Block Trading",
    status: "Completed",
    accounts: 6,
    avgFillPrice: 245.80,
    timestamp: "09:25:12",
    allocatedPercentage: 97.9
  },
  {
    tradeId: "TRD-005",
    instrument: "NVDA",
    totalQuantity: 8000,
    allocated: 0,
    algorithm: "Pro-Rata",
    scenario: "Manual Review",
    status: "Failed",
    accounts: 0,
    avgFillPrice: 0,
    timestamp: "09:28:33",
    allocatedPercentage: 0
  },
  {
    tradeId: "TRD-006",
    instrument: "JPM",
    totalQuantity: 15000,
    allocated: 14850,
    algorithm: "Priority-Based",
    scenario: "Institution Priority",
    status: "Completed",
    accounts: 20,
    avgFillPrice: 148.90,
    timestamp: "09:30:45",
    allocatedPercentage: 99
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Pending": return <Clock className="h-4 w-4 text-orange-500" />;
    case "Failed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Completed": return "default";
    case "Pending": return "secondary";
    case "Failed": return "destructive";
    default: return "outline";
  }
};

const getScenarioBadgeColor = (scenario: string) => {
  switch (scenario) {
    case "High Priority": return "bg-red-100 text-red-800 border-red-200";
    case "Block Trading": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Manual Review": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Institution Priority": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Partial Fill": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function TradeAllocationTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Trade Allocation Details</span>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trade ID</TableHead>
              <TableHead>Instrument</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Algorithm</TableHead>
              <TableHead>Scenario</TableHead>
              <TableHead>Allocation %</TableHead>
              <TableHead>Accounts</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeAllocations.map((trade, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{trade.tradeId}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {trade.instrument}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{trade.allocated.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      of {trade.totalQuantity.toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {trade.algorithm}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getScenarioBadgeColor(trade.scenario)}>
                    {trade.scenario}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={trade.allocatedPercentage} className="h-2" />
                    <div className="text-sm font-medium">{trade.allocatedPercentage}%</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>{trade.accounts}</span>
                    <span className="text-muted-foreground text-sm">accounts</span>
                  </div>
                </TableCell>
                <TableCell>
                  {trade.avgFillPrice > 0 ? (
                    <span className="font-mono">${trade.avgFillPrice}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(trade.status)}
                    <Badge variant={getStatusBadgeVariant(trade.status)}>
                      {trade.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{trade.timestamp}</TableCell>
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
                        <Settings className="h-4 w-4 mr-2" />
                        Modify Allocation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reprocess
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