import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Settings,
  Plus,
  Edit,
  Save,
  Trash2,
  Building,
  Shield,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ControlProcessManagementProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  currentUser: any;
}

interface ControlProcess {
  id: string;
  riskCategory: string;
  riskFactor: string;
  lob: string;
  controlName: string;
  description: string;
  frequency: string;
  effectiveness: 'high' | 'medium' | 'low';
  owner: string;
  lastUpdated: string;
  status: 'active' | 'deprecated' | 'pending';
}

export function ControlProcessManagement({ 
  userRole, 
  currentUser 
}: ControlProcessManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lobFilter, setLobFilter] = useState("all-lobs");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [controlProcesses, setControlProcesses] = useState<ControlProcess[]>([
    {
      id: "1",
      riskCategory: "Geography",
      riskFactor: "High-Risk Jurisdiction",
      lob: "Investment Banking",
      controlName: "Enhanced Due Diligence (EDD)",
      description: "Annual enhanced due diligence review including beneficial ownership verification, source of funds validation, and regulatory compliance assessment for clients in high-risk jurisdictions.",
      frequency: "Annual",
      effectiveness: "high",
      owner: "Compliance Team",
      lastUpdated: "2024-05-15",
      status: "active"
    },
    {
      id: "2",
      riskCategory: "Product",
      riskFactor: "Prime Brokerage Services",
      lob: "Investment Banking",
      controlName: "Transaction Monitoring",
      description: "Real-time transaction monitoring with enhanced thresholds for prime brokerage activities, including daily reconciliation and exception reporting.",
      frequency: "Real-time",
      effectiveness: "high",
      owner: "Operations Team",
      lastUpdated: "2024-06-01",
      status: "active"
    },
    {
      id: "3",
      riskCategory: "Customer Attributes",
      riskFactor: "PEP Status",
      lob: "Wealth Management",
      controlName: "Ongoing PEP Monitoring",
      description: "Continuous screening against global PEP databases with quarterly review of political exposure and family connections.",
      frequency: "Quarterly",
      effectiveness: "medium",
      owner: "AML Team",
      lastUpdated: "2024-04-20",
      status: "active"
    },
    {
      id: "4",
      riskCategory: "Bank Intelligence",
      riskFactor: "GFC Intelligence",
      lob: "All LOBs",
      controlName: "Intelligence Review Committee",
      description: "Monthly review by GFC Intelligence team with escalation protocols for any new intelligence or changes in risk profile.",
      frequency: "Monthly",
      effectiveness: "high",
      owner: "GFC Team",
      lastUpdated: "2024-06-10",
      status: "active"
    },
    {
      id: "5",
      riskCategory: "Industry",
      riskFactor: "High-Risk Industry (Crypto)",
      lob: "Commercial Banking",
      controlName: "Enhanced Transaction Review",
      description: "Manual review of all transactions exceeding threshold amounts with additional documentation requirements for cryptocurrency-related businesses.",
      frequency: "Per Transaction",
      effectiveness: "medium",
      owner: "Commercial Banking AML",
      lastUpdated: "2024-03-15",
      status: "deprecated"
    }
  ]);

  const [newProcess, setNewProcess] = useState<Partial<ControlProcess>>({
    riskCategory: "",
    riskFactor: "",
    lob: "",
    controlName: "",
    description: "",
    frequency: "",
    effectiveness: "medium",
    owner: "",
    status: "active"
  });

  const riskCategories = [
    "Customer Attributes",
    "Geography",
    "Industry", 
    "Product",
    "Bank Intelligence",
    "SPF/PEP Status"
  ];

  const lobOptions = [
    "Investment Banking",
    "Wealth Management",
    "Private Banking",
    "Commercial Banking",
    "Global Markets",
    "All LOBs"
  ];

  const frequencyOptions = [
    "Real-time",
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Semi-Annual",
    "Annual",
    "Per Transaction",
    "As Needed"
  ];

  const filteredProcesses = controlProcesses.filter(process => {
    const matchesSearch = !searchTerm || 
      process.controlName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.riskFactor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLob = lobFilter === "all-lobs" || process.lob === lobFilter;
    const matchesCategory = categoryFilter === "all-categories" || process.riskCategory === categoryFilter;
    const matchesStatus = statusFilter === "all-statuses" || process.status === statusFilter;
    
    return matchesSearch && matchesLob && matchesCategory && matchesStatus;
  });

  const handleAddProcess = () => {
    if (newProcess.controlName && newProcess.riskCategory && newProcess.riskFactor && newProcess.lob) {
      const process: ControlProcess = {
        id: Date.now().toString(),
        riskCategory: newProcess.riskCategory!,
        riskFactor: newProcess.riskFactor!,
        lob: newProcess.lob!,
        controlName: newProcess.controlName!,
        description: newProcess.description || "",
        frequency: newProcess.frequency || "Monthly",
        effectiveness: newProcess.effectiveness as 'high' | 'medium' | 'low' || "medium",
        owner: newProcess.owner || currentUser.name,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: newProcess.status as 'active' | 'deprecated' | 'pending' || "active"
      };
      
      setControlProcesses([...controlProcesses, process]);
      setNewProcess({
        riskCategory: "",
        riskFactor: "",
        lob: "",
        controlName: "",
        description: "",
        frequency: "",
        effectiveness: "medium",
        owner: "",
        status: "active"
      });
      setShowAddForm(false);
      toast.success("Control process added successfully");
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleDeleteProcess = (id: string) => {
    setControlProcesses(controlProcesses.filter(p => p.id !== id));
    toast.success("Control process deleted");
  };

  const handleEditProcess = (id: string, updates: Partial<ControlProcess>) => {
    setControlProcesses(controlProcesses.map(p => 
      p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p
    ));
    setIsEditing(null);
    toast.success("Control process updated");
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "secondary", class: "text-green-700 bg-green-100" },
      deprecated: { variant: "destructive", class: "text-red-700 bg-red-100" },
      pending: { variant: "outline", class: "text-orange-700 bg-orange-100" }
    };
    
    const statusConfig = config[status as keyof typeof config];
    return (
      <Badge variant={statusConfig.variant as any} className={statusConfig.class}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEffectivenessBadge = (effectiveness: string) => {
    const config = {
      high: { variant: "secondary", class: "text-green-700 bg-green-100" },
      medium: { variant: "outline", class: "text-orange-700 bg-orange-100" },
      low: { variant: "destructive", class: "text-red-700 bg-red-100" }
    };
    
    const effectConfig = config[effectiveness as keyof typeof config];
    return (
      <Badge variant={effectConfig.variant as any} className={effectConfig.class}>
        {effectiveness.charAt(0).toUpperCase() + effectiveness.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium">Control Process Management</h3>
          <p className="text-muted-foreground">
            Manage control process definitions used in risk mitigant sections
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Control Process
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Controls</p>
                <p className="font-medium">{controlProcesses.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="font-medium">{controlProcesses.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Effectiveness</p>
                <p className="font-medium">{controlProcesses.filter(p => p.effectiveness === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total LOBs</p>
                <p className="font-medium">{new Set(controlProcesses.map(p => p.lob)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search control processes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={lobFilter} onValueChange={setLobFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by LOB" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-lobs">All LOBs</SelectItem>
                {lobOptions.map(lob => (
                  <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {riskCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add New Process Form */}
      {showAddForm && (
        <Card className="border-dashed border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Add New Control Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Risk Category *</Label>
                <Select
                  value={newProcess.riskCategory}
                  onValueChange={(value) => setNewProcess({...newProcess, riskCategory: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-lob">Line of Business *</Label>
                <Select
                  value={newProcess.lob}
                  onValueChange={(value) => setNewProcess({...newProcess, lob: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LOB" />
                  </SelectTrigger>
                  <SelectContent>
                    {lobOptions.map(lob => (
                      <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-frequency">Frequency</Label>
                <Select
                  value={newProcess.frequency}
                  onValueChange={(value) => setNewProcess({...newProcess, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(freq => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-risk-factor">Risk Factor *</Label>
                <Input
                  id="new-risk-factor"
                  placeholder="Enter risk factor"
                  value={newProcess.riskFactor}
                  onChange={(e) => setNewProcess({...newProcess, riskFactor: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-control-name">Control Name *</Label>
                <Input
                  id="new-control-name"
                  placeholder="Enter control name"
                  value={newProcess.controlName}
                  onChange={(e) => setNewProcess({...newProcess, controlName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                placeholder="Describe the control process..."
                value={newProcess.description}
                onChange={(e) => setNewProcess({...newProcess, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-owner">Process Owner</Label>
                <Input
                  id="new-owner"
                  placeholder="Enter owner"
                  value={newProcess.owner}
                  onChange={(e) => setNewProcess({...newProcess, owner: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-effectiveness">Effectiveness</Label>
                <Select
                  value={newProcess.effectiveness}
                  onValueChange={(value) => setNewProcess({...newProcess, effectiveness: value as 'high' | 'medium' | 'low'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select
                  value={newProcess.status}
                  onValueChange={(value) => setNewProcess({...newProcess, status: value as 'active' | 'deprecated' | 'pending'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddProcess}>
                <Plus className="h-4 w-4 mr-2" />
                Add Process
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Processes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Control Processes ({filteredProcesses.length} processes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Control Name</TableHead>
                  <TableHead>Risk Category</TableHead>
                  <TableHead>Risk Factor</TableHead>
                  <TableHead>LOB</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Effectiveness</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{process.controlName}</p>
                        <p className="text-sm text-muted-foreground">Owner: {process.owner}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {process.riskCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{process.riskFactor}</p>
                      {process.description && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                          {process.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{process.lob}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {process.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getEffectivenessBadge(process.effectiveness)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(process.status)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(process.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProcess(process.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProcesses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No control processes found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}