import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { 
  FileText,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowUpDown
} from "lucide-react";

interface HraReportsTableProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  selectedLob: string;
  dateRange: { from: Date; to: Date };
  searchTerm: string;
  availableLobs: string[];
  onExport: (reportType: string) => void;
}

interface CaseRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientType: 'Individual' | 'Corporate' | 'Investment' | 'Banking';
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAnalyst: string;
  lob: string;
  riskRating: string;
  jurisdiction: string;
  caseType: string;
  creationDate: string;
  dueDate: string;
  completionDate: string | null;
  daysInQueue: number;
  lastActivity: string;
  recommendation: string;
  escalationReason?: string;
  fluAmlOutcome?: string;
  gfcOutcome?: string;
  processingTime: number;
  trmsCount: number;
  manualReviewReasons?: string[];
}

export function HraReportsTable({ 
  userRole, 
  selectedLob, 
  dateRange, 
  searchTerm,
  availableLobs,
  onExport 
}: HraReportsTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("creationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Mock case data - in real implementation, this would be filtered by user's LOB entitlements
  const allCaseData: CaseRecord[] = [
    {
      id: "HRA-2024-0601",
      clientId: "CID123456789",
      clientName: "Global Dynamics Corporation",
      clientType: "Corporate",
      status: "In Review",
      priority: "high",
      assignedAnalyst: "Sarah Johnson",
      lob: "Investment Banking",
      riskRating: "High",
      jurisdiction: "United States, Cayman Islands",
      caseType: "Manual Review",
      creationDate: "2024-06-15",
      dueDate: "2024-06-20",
      completionDate: null,
      daysInQueue: 5,
      lastActivity: "2024-06-16",
      recommendation: "Escalate to FLU AML",
      escalationReason: "High Number of Risk attributes",
      processingTime: 2,
      trmsCount: 1
    },
    {
      id: "HRA-2024-0602",
      clientId: "CID234567890",
      clientName: "Meridian Investment Holdings",
      clientType: "LLC",
      status: "Completed",
      priority: "medium",
      assignedAnalyst: "Michael Chen",
      lob: "Wealth Management",
      riskRating: "Medium",
      jurisdiction: "United States",
      caseType: "Auto-close",
      creationDate: "2024-06-10",
      dueDate: "2024-06-12",
      completionDate: "2024-06-12",
      daysInQueue: 2,
      lastActivity: "2024-06-12",
      recommendation: "No factors impacting decision",
      processingTime: 2,
      trmsCount: 0
    },
    {
      id: "HRA-2024-0603",
      clientId: "CID345678901",
      clientName: "Phoenix Energy Trading Ltd",
      clientType: "Corporate",
      status: "FLU AML Review",
      priority: "high",
      assignedAnalyst: "Jennifer Liu",
      lob: "Global Markets",
      riskRating: "High",
      jurisdiction: "United Kingdom, Singapore",
      caseType: "Manual Review",
      creationDate: "2024-06-08",
      dueDate: "2024-06-15",
      completionDate: null,
      daysInQueue: 7,
      lastActivity: "2024-06-15",
      recommendation: "Escalate to FLU AML",
      escalationReason: "Specific Combination of Risk Attributes",
      fluAmlOutcome: "Under Review",
      processingTime: 8,
      trmsCount: 2
    },
    {
      id: "HRA-2024-0604",
      clientId: "CID456789012",
      clientName: "Silverstone Capital Management",
      clientType: "Partnership",
      status: "GFC Review",
      priority: "high",
      assignedAnalyst: "David Rodriguez",
      lob: "Investment Banking",
      riskRating: "High",
      jurisdiction: "United States, Luxembourg",
      caseType: "Manual Review",
      creationDate: "2024-06-05",
      dueDate: "2024-06-14",
      completionDate: null,
      daysInQueue: 9,
      lastActivity: "2024-06-14",
      recommendation: "Escalate to GFC",
      escalationReason: "Additional Risk Factors Present",
      fluAmlOutcome: "Escalate to GFC",
      gfcOutcome: "Under Review",
      processingTime: 10,
      trmsCount: 1
    },
    {
      id: "HRA-2024-0605",
      clientId: "CID567890123",
      clientName: "Atlantic Research Institute",
      clientType: "Non-Profit",
      status: "Completed",
      priority: "low",
      assignedAnalyst: "Emily Watson",
      lob: "Commercial Banking",
      riskRating: "Low",
      jurisdiction: "United States",
      caseType: "Auto-close",
      creationDate: "2024-06-03",
      dueDate: "2024-06-04",
      completionDate: "2024-06-04",
      daysInQueue: 1,
      lastActivity: "2024-06-04",
      recommendation: "No factors impacting decision",
      processingTime: 1,
      trmsCount: 0
    }
  ];

  // Filter data based on user access and filters
  const getFilteredData = () => {
    let filtered = allCaseData;

    // Apply LOB filtering for FLU AML users
    if (userRole === 'flu-aml') {
      filtered = filtered.filter(record => record.lob === selectedLob);
    } else if (selectedLob !== "all-lobs") {
      filtered = filtered.filter(record => record.lob === selectedLob);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.clientName.toLowerCase().includes(searchLower) ||
        record.id.toLowerCase().includes(searchLower) ||
        record.clientId.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter(record => record.riskRating === riskFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortColumn as keyof CaseRecord];
      let bValue = b[sortColumn as keyof CaseRecord];
      
      if (sortColumn === "creationDate" || sortColumn === "completionDate" || sortColumn === "lastActivity") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      "Completed": { variant: "secondary", class: "text-green-700 bg-green-100" },
      "In Review": { variant: "outline", class: "text-blue-700 bg-blue-100" },
      "FLU AML Review": { variant: "outline", class: "text-orange-700 bg-orange-100" },
      "GFC Review": { variant: "destructive", class: "text-red-700 bg-red-100" },
      "Rejected": { variant: "destructive", class: "text-red-700 bg-red-100" }
    };
    
    const statusConfig = config[status as keyof typeof config] || { variant: "outline", class: "" };
    return (
      <Badge variant={statusConfig.variant as any} className={statusConfig.class}>
        {status}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const config = {
      "High": "destructive",
      "Medium": "outline",
      "Low": "secondary"
    };
    return (
      <Badge variant={config[risk as keyof typeof config] as any}>
        {risk}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      "low": "secondary",
      "medium": "outline",
      "high": "destructive",
      "critical": "destructive"
    };
    return (
      <Badge variant={config[priority as keyof typeof config] as any}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium">Case Details Report</h3>
          <p className="text-muted-foreground">
            Detailed case information with all captured HRA attributes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onExport('Case Details')}
            disabled={selectedRows.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected ({selectedRows.length})
          </Button>
          <Button variant="outline" onClick={() => onExport('All Case Details')}>
            <FileText className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="FLU AML Review">FLU AML Review</SelectItem>
                  <SelectItem value="GFC Review">GFC Review</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Rating</label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Page Size</label>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="text-sm text-muted-foreground pt-2">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center space-x-1">
                      <span>Case ID</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("clientName")}>
                    <div className="flex items-center space-x-1">
                      <span>Client</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("assignedAnalyst")}>
                    <div className="flex items-center space-x-1">
                      <span>Assigned To</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("lob")}>
                    <div className="flex items-center space-x-1">
                      <span>LOB</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Risk Rating</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("daysInQueue")}>
                    <div className="flex items-center space-x-1">
                      <span>Days in Queue</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("dueDate")}>
                    <div className="flex items-center space-x-1">
                      <span>Due Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRow(record.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium font-mono text-blue-600">
                      {record.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {record.clientType === 'Individual' ? 
                          <User className="h-4 w-4 text-muted-foreground" /> : 
                          <Building className="h-4 w-4 text-muted-foreground" />
                        }
                        <div>
                          <p className="font-medium">{record.clientName}</p>
                          <p className="text-xs text-muted-foreground">{record.clientType}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(record.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{record.assignedAnalyst}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{record.lob}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRiskBadge(record.riskRating)}
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        record.daysInQueue > 5 ? 'text-red-600' : 
                        record.daysInQueue > 2 ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {record.daysInQueue} days
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{new Date(record.dueDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedRows.length > 0 && `${selectedRows.length} of ${filteredData.length} row(s) selected`}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Information */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Exportable Data Fields</p>
              <p className="text-sm text-gray-700 mt-1">
                Export includes all HRA attributes captured in the system: customer information, risk factors, 
                mitigants, comments, decisions, and processing metadata.
              </p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <p><strong>Core Fields:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Legal Name, Customer Identifiers (GCI/PID/COPER)</li>
                    <li>Entity Type, Primary/Additional FLUs</li>
                    <li>Booking Jurisdictions, Regulatory Information</li>
                    <li>Risk Rating, Case Type, Processing Timestamps</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Assessment Data:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>CRR Risk Factors (Current/Previous)</li>
                    <li>Additional Risk Factors (CAM, TRMS, Escalations)</li>
                    <li>Risk Mitigants and Control Processes</li>
                    <li>Recommendations, Comments, Outcomes</li>
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