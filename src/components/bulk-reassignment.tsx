import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  UserPlus, 
  Search, 
  Users,
  Building,
  Calendar,
  ArrowRight,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BulkReassignmentProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  currentUser: any;
}

interface BulkCase {
  caseId: string;
  clientName: string;
  clientType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'dispositioned' | 'in-flight' | 'assigned' | 'completed';
  currentAssignee?: string;
  disposition?: string;
  dueDate: string;
  lob: string;
  riskRating: 'Low' | 'Medium' | 'High';
}

interface BulkUser {
  id: string;
  name: string;
  role: string;
  lob: string;
  activeCase: number;
  capacity: number;
  availability: 'available' | 'busy' | 'unavailable';
}

export function BulkReassignment({ userRole, currentUser }: BulkReassignmentProps) {
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [lobFilter, setLobFilter] = useState("all-lobs");
  const [targetUser, setTargetUser] = useState("");
  const [reassignmentReason, setReassignmentReason] = useState("");
  const [reassignmentType, setReassignmentType] = useState<'individual' | 'bulk'>('bulk');

  // Mock bulk cases data
  const bulkCases: BulkCase[] = [
    {
      caseId: 'HRA-2024-0501',
      clientName: 'Global Dynamics Corp',
      clientType: 'Corporate',
      priority: 'high',
      status: 'dispositioned',
      currentAssignee: 'Sarah Johnson',
      disposition: 'No factors impacting decision to retain client',
      dueDate: '2024-06-25',
      lob: 'Investment Banking',
      riskRating: 'High'
    },
    {
      caseId: 'HRA-2024-0502',
      clientName: 'Sterling Investment Group',
      clientType: 'Investment',
      priority: 'critical',
      status: 'in-flight',
      currentAssignee: 'Michael Chen',
      dueDate: '2024-06-24',
      lob: 'Investment Banking',
      riskRating: 'High'
    },
    {
      caseId: 'HRA-2024-0503',
      clientName: 'Pacific Holdings Ltd',
      clientType: 'Investment',
      priority: 'medium',
      status: 'assigned',
      currentAssignee: 'Emily Rodriguez',
      dueDate: '2024-06-28',
      lob: 'Wealth Management',
      riskRating: 'Medium'
    },
    {
      caseId: 'HRA-2024-0504',
      clientName: 'Oceanic Trading LLC',
      clientType: 'Corporate',
      priority: 'medium',
      status: 'dispositioned',
      currentAssignee: 'Alex Thompson',
      disposition: 'Escalate to FLU AML Representative',
      dueDate: '2024-06-30',
      lob: 'Commercial Banking',
      riskRating: 'Medium'
    },
    {
      caseId: 'HRA-2024-0505',
      clientName: 'Alpine Asset Management',
      clientType: 'Investment',
      priority: 'high',
      status: 'completed',
      currentAssignee: 'Sarah Johnson',
      disposition: 'No factors impacting decision to retain client',
      dueDate: '2024-06-22',
      lob: 'Investment Banking',
      riskRating: 'High'
    }
  ];

  // Mock available users for reassignment
  const availableUsers: BulkUser[] = [
    { id: 'analyst1', name: 'Sarah Johnson', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20, availability: 'available' },
    { id: 'analyst2', name: 'Michael Chen', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 8, capacity: 20, availability: 'available' },
    { id: 'analyst3', name: 'Emily Rodriguez', role: 'HRA Analyst', lob: 'Private Banking', activeCase: 15, capacity: 20, availability: 'busy' },
    { id: 'analyst4', name: 'Alex Thompson', role: 'HRA Analyst', lob: 'Commercial Banking', activeCase: 6, capacity: 20, availability: 'available' },
    { id: 'analyst5', name: 'Jennifer Liu', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 4, capacity: 20, availability: 'available' },
    { id: 'analyst6', name: 'Marcus Williams', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 18, capacity: 20, availability: 'busy' }
  ];

  const filteredCases = bulkCases.filter(caseItem => {
    const matchesSearch = !searchTerm || 
      caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all-statuses" || caseItem.status === statusFilter;
    const matchesLob = lobFilter === "all-lobs" || caseItem.lob === lobFilter;
    
    return matchesSearch && matchesStatus && matchesLob;
  });

  const handleSelectCase = (caseId: string) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(c => c.caseId));
    }
  };

  const handleBulkReassignment = () => {
    if (selectedCases.length === 0) {
      toast.error("Please select at least one case");
      return;
    }

    if (!targetUser) {
      toast.error("Please select a user to reassign cases to");
      return;
    }

    const user = availableUsers.find(u => u.id === targetUser);
    toast.success(`${selectedCases.length} cases reassigned to ${user?.name}`);
    
    // Reset form
    setSelectedCases([]);
    setTargetUser("");
    setReassignmentReason("");
  };

  const getStatusBadge = (status: string, disposition?: string) => {
    const statusConfig: Record<string, { variant: any, color: string, icon: any }> = {
      'dispositioned': { variant: 'secondary', color: 'text-green-700 bg-green-100', icon: CheckCircle },
      'in-flight': { variant: 'outline', color: 'text-orange-700 bg-orange-100', icon: Clock },
      'assigned': { variant: 'outline', color: 'text-blue-700 bg-blue-100', icon: User },
      'completed': { variant: 'secondary', color: 'text-green-700 bg-green-100', icon: CheckCircle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className="space-y-1">
        <Badge variant={config.variant} className={`${config.color} flex items-center space-x-1`}>
          <Icon className="h-3 w-3" />
          <span>{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</span>
        </Badge>
        {disposition && (
          <p className="text-xs text-muted-foreground">{disposition}</p>
        )}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, string> = {
      'low': 'text-gray-700 bg-gray-100',
      'medium': 'text-blue-700 bg-blue-100',
      'high': 'text-orange-700 bg-orange-100',
      'critical': 'text-red-700 bg-red-100'
    };
    
    return (
      <Badge variant="outline" className={priorityConfig[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-orange-600';
      case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCapacityColor = (activeCase: number, capacity: number) => {
    const percentage = (activeCase / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 min-w-[300px]"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="dispositioned">Dispositioned</SelectItem>
                  <SelectItem value="in-flight">In-Flight</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={lobFilter} onValueChange={setLobFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by LOB" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-lobs">All LOBs</SelectItem>
                  <SelectItem value="Investment Banking">Investment Banking</SelectItem>
                  <SelectItem value="Wealth Management">Wealth Management</SelectItem>
                  <SelectItem value="Private Banking">Private Banking</SelectItem>
                  <SelectItem value="Commercial Banking">Commercial Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCases.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedCases.length} cases selected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cases for Bulk Reassignment ({filteredCases.length} cases)</span>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedCases.length === filteredCases.length && filteredCases.length > 0 ? 'Deselect All' : 'Select All'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>LOB</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((caseItem) => (
                      <TableRow key={caseItem.caseId}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCases.includes(caseItem.caseId)}
                            onCheckedChange={() => handleSelectCase(caseItem.caseId)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{caseItem.caseId}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{caseItem.clientName}</p>
                              <p className="text-sm text-muted-foreground">{caseItem.clientType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(caseItem.status, caseItem.disposition)}
                        </TableCell>
                        <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                        <TableCell>{caseItem.currentAssignee || 'Unassigned'}</TableCell>
                        <TableCell>{caseItem.lob}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(caseItem.dueDate).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredCases.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No cases found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reassignment Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Bulk Reassignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCases.length > 0 ? (
              <>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="font-medium text-primary">Selected Cases</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCases.length} case{selectedCases.length !== 1 ? 's' : ''} selected for reassignment
                  </p>
                </div>

                <div>
                  <Label htmlFor="target-user">Reassign To</Label>
                  <Select value={targetUser} onValueChange={setTargetUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analyst" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id} disabled={user.availability === 'unavailable'}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">({user.lob})</span>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`text-xs ${getCapacityColor(user.activeCase, user.capacity)}`}>
                                {user.activeCase}/{user.capacity}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getAvailabilityColor(user.availability)}`}
                              >
                                {user.availability}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reassignment-reason">Reassignment Reason</Label>
                  <Textarea
                    id="reassignment-reason"
                    placeholder="Explain the reason for bulk reassignment..."
                    value={reassignmentReason}
                    onChange={(e) => setReassignmentReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <Separator />

                <Button onClick={handleBulkReassignment} className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Reassign {selectedCases.length} Case{selectedCases.length !== 1 ? 's' : ''}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No cases selected</p>
                <p className="text-sm text-muted-foreground">
                  Select one or more cases from the table to begin bulk reassignment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  );
}