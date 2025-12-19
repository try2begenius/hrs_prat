import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { 
  UserCheck, 
  Search, 
  User, 
  Building,
  Calendar,
  AlertTriangle,
  Clock,
  Users,
  ArrowRight,
  RotateCcw,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CaseAssignmentProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  currentUser: any;
}

interface AssignmentCase {
  caseId: string;
  clientName: string;
  clientType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskRating: 'Low' | 'Medium' | 'High';
  currentAssignee?: string;
  dueDate: string;
  lob: string;
  status: string;
}

interface UserInfo {
  id: string;
  name: string;
  role: string;
  lob: string;
  activeCase: number;
  capacity: number;
}

export function CaseAssignment({ userRole, currentUser }: CaseAssignmentProps) {
  const [selectedCase, setSelectedCase] = useState<AssignmentCase | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentType, setAssignmentType] = useState<'assign' | 'reassign' | 'return'>('assign');
  const [targetUser, setTargetUser] = useState("");
  const [assignmentReason, setAssignmentReason] = useState("");
  const [returnReason, setReturnReason] = useState("");

  // Mock case data
  const availableCases: AssignmentCase[] = [
    {
      caseId: 'HRA-2024-0301',
      clientName: 'Global Dynamics Corp',
      clientType: 'Corporate',
      priority: 'high',
      riskRating: 'High',
      currentAssignee: userRole === 'hra-manager' ? 'Sarah Johnson' : undefined,
      dueDate: '2024-06-25',
      lob: 'Investment Banking',
      status: 'unassigned'
    },
    {
      caseId: 'HRA-2024-0302',
      clientName: 'Sterling Investment Group',
      clientType: 'Investment',
      priority: 'critical',
      riskRating: 'High',
      currentAssignee: 'Michael Chen',
      dueDate: '2024-06-24',
      lob: 'Investment Banking',
      status: 'assigned'
    },
    {
      caseId: 'HRA-2024-0303',
      clientName: 'Pacific Holdings Ltd',
      clientType: 'Investment',
      priority: 'medium',
      riskRating: 'Medium',
      dueDate: '2024-06-28',
      lob: 'Wealth Management',
      status: 'unassigned'
    }
  ];

  // Mock user data based on role
  const getAvailableUsers = (): UserInfo[] => {
    if (userRole === 'hra-analyst') {
      return []; // Analysts can only assign to themselves
    } else if (userRole === 'hra-manager') {
      return [
        { id: 'analyst1', name: 'Sarah Johnson', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20 },
        { id: 'analyst2', name: 'Michael Chen', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 8, capacity: 20 },
        { id: 'analyst3', name: 'Emily Rodriguez', role: 'HRA Analyst', lob: 'Private Banking', activeCase: 15, capacity: 20 },
        { id: 'analyst4', name: 'Alex Thompson', role: 'HRA Analyst', lob: 'Commercial Banking', activeCase: 6, capacity: 20 },
        { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs', activeCase: 5, capacity: 10 }
      ];
    } else if (userRole === 'flu-aml') {
      return [
        { id: 'analyst1', name: 'Sarah Johnson', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20 },
        { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs', activeCase: 5, capacity: 10 }
      ];
    } else if (userRole === 'gfc') {
      return [
        { id: 'analyst1', name: 'Sarah Johnson', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20 },
        { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs', activeCase: 5, capacity: 10 }
      ];
    }
    return [];
  };

  const availableUsers = getAvailableUsers();

  const filteredCases = availableCases.filter(caseItem => 
    !searchTerm || 
    caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignCase = () => {
    if (!selectedCase) {
      toast.error("Please select a case");
      return;
    }

    if (assignmentType === 'return') {
      if (!returnReason.trim()) {
        toast.error("Please provide a reason for returning the case");
        return;
      }
      toast.success(`Case ${selectedCase.caseId} returned to HRA Analyst with reason: ${returnReason}`);
    } else {
      if (!targetUser) {
        toast.error("Please select a user to assign the case to");
        return;
      }
      const user = availableUsers.find(u => u.id === targetUser);
      toast.success(`Case ${selectedCase.caseId} ${assignmentType === 'assign' ? 'assigned' : 'reassigned'} to ${user?.name}`);
    }

    // Reset form
    setSelectedCase(null);
    setTargetUser("");
    setAssignmentReason("");
    setReturnReason("");
  };

  const handleSelfAssign = () => {
    if (!selectedCase) {
      toast.error("Please select a case");
      return;
    }
    toast.success(`Case ${selectedCase.caseId} assigned to you`);
    setSelectedCase(null);
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

  const getCapacityColor = (activeCase: number, capacity: number) => {
    const percentage = (activeCase / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Select Case for Assignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="case-search">Search Cases</Label>
              <Input
                id="case-search"
                placeholder="Search by case ID or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredCases.map((caseItem) => (
                <div
                  key={caseItem.caseId}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCase?.caseId === caseItem.caseId 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{caseItem.caseId}</p>
                      <p className="text-sm text-muted-foreground">{caseItem.clientName}</p>
                      <p className="text-xs text-muted-foreground">{caseItem.clientType} • {caseItem.lob}</p>
                    </div>
                    <div className="text-right space-y-1">
                      {getPriorityBadge(caseItem.priority)}
                      <Badge 
                        variant={caseItem.riskRating === 'High' ? 'destructive' : 'outline'}
                        className="text-xs block"
                      >
                        {caseItem.riskRating}
                      </Badge>
                      {caseItem.currentAssignee && (
                        <p className="text-xs text-muted-foreground">Assigned: {caseItem.currentAssignee}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Assignment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCase ? (
              <>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Case</h4>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedCase.caseId}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCase.clientName} • {selectedCase.clientType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(selectedCase.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="assignment-type">Assignment Type</Label>
                  <Select value={assignmentType} onValueChange={(value: any) => setAssignmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assign">Assign Case</SelectItem>
                      <SelectItem value="reassign">Reassign Case</SelectItem>
                      {(userRole === 'flu-aml' || userRole === 'gfc') && (
                        <SelectItem value="return">Return to HRA Analyst</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {assignmentType === 'return' ? (
                  <div>
                    <Label htmlFor="return-reason">Return Reason</Label>
                    <Textarea
                      id="return-reason"
                      placeholder="Explain why the case is being returned..."
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    {userRole === 'hra-analyst' ? (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          As an HRA Analyst, you can assign cases to yourself using the "Assign to Me" button below.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="target-user">Assign To</Label>
                        <Select value={targetUser} onValueChange={setTargetUser}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{user.name} - {user.role}</span>
                                  <span className={`ml-2 text-xs ${getCapacityColor(user.activeCase, user.capacity)}`}>
                                    ({user.activeCase}/{user.capacity})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="assignment-reason">Assignment Notes (Optional)</Label>
                      <Textarea
                        id="assignment-reason"
                        placeholder="Add any relevant notes for the assignment..."
                        value={assignmentReason}
                        onChange={(e) => setAssignmentReason(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center space-x-2">
                  {userRole === 'hra-analyst' && assignmentType !== 'return' ? (
                    <Button onClick={handleSelfAssign} className="flex-1">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Assign to Me
                    </Button>
                  ) : (
                    <Button onClick={handleAssignCase} className="flex-1">
                      {assignmentType === 'return' ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Return Case
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          {assignmentType === 'assign' ? 'Assign Case' : 'Reassign Case'}
                        </>
                      )}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedCase(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a case from the list to begin assignment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Capacity Overview */}
      {userRole !== 'hra-analyst' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Capacity Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                      <p className="text-xs text-muted-foreground">{user.lob}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Active Cases</span>
                      <span className={getCapacityColor(user.activeCase, user.capacity)}>
                        {user.activeCase} / {user.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (user.activeCase / user.capacity) * 100 >= 90 ? 'bg-red-500' :
                          (user.activeCase / user.capacity) * 100 >= 75 ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((user.activeCase / user.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Capacity: {Math.round((user.activeCase / user.capacity) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}