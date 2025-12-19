import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react@32.2.2";
import type { ColDef, GridApi, GridReadyEvent } from "ag-grid-community@32.2.2";
import { getAGGridIconsConfig } from "./ag-grid-icons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { BulkOperationsDialog } from "./bulk-operations-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { 
  Eye, 
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building,
  Calendar,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Pin,
  ScanLine,
  Settings,
  UserCheck,
  ArrowUpCircle,
  Activity,
  ArrowRight,
  UsersRound
} from "lucide-react";

// AG-Grid styles are imported globally in globals.css

interface WorkQueueRecord {
  caseId: string;
  clientId: string;
  clientName: string;
  clientType: 'Individual' | 'Corporate' | 'Investment' | 'Banking';
  status: 'new' | 'unassigned' | 'assigned' | 'in-progress' | 'escalated' | 'returned' | 'auto-completed' | 'manual-review' | 'completed' | 'reopened' | 'abandoned' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAnalyst: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  riskRating: 'Low' | 'Medium' | 'High';
  manualReviewReasons: string[];
  jurisdiction: string;
  lob: string;
  daysInQueue: number;
  escalationReason?: string;
  returnReason?: string;
}

interface WorkQueueTableProps {
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
  currentUser: any;
  onNavigateToRiskAssessment?: (caseData: any) => void;
}

// Custom cell renderers
const StatusCellRenderer = (params: any) => {
  const status = params.value;
  const getStatusStyle = () => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unassigned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'escalated':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'returned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'auto-completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'manual-review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reopened':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'abandoned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'new':
        return <Clock className="h-3 w-3" />;
      case 'unassigned':
        return <Clock className="h-3 w-3" />;
      case 'assigned':
        return <UserCheck className="h-3 w-3" />;
      case 'in-progress':
        return <Activity className="h-3 w-3" />;
      case 'escalated':
        return <ArrowUpCircle className="h-3 w-3" />;
      case 'returned':
        return <RotateCcw className="h-3 w-3" />;
      case 'auto-completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'manual-review':
        return <AlertTriangle className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'reopened':
        return <RotateCcw className="h-3 w-3" />;
      case 'abandoned':
        return <Clock className="h-3 w-3" />;
      case 'rejected':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyle()} capitalize flex items-center space-x-1`}>
      {getStatusIcon()}
      <span>{status.replace('-', ' ')}</span>
    </Badge>
  );
};

const PriorityCellRenderer = (params: any) => {
  const priority = params.value;
  const getPriorityIcon = () => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-3 w-3 text-orange-600" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      default:
        return null;
    }
  };

  const getPriorityStyle = () => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {getPriorityIcon()}
      <Badge variant="outline" className={`${getPriorityStyle()} capitalize`}>
        {priority}
      </Badge>
    </div>
  );
};

const ActionsCellRenderer: React.FC<any> = (props) => {
  const params = props;
  console.log("Work Queue ActionsCellRenderer rendered for case:", params.data?.caseId);
  
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'assign' | 'reassign' | 'return'>('assign');
  const [targetUser, setTargetUser] = useState("");
  const [assignmentReason, setAssignmentReason] = useState("");
  
  // Get user role from params (passed from parent)
  const userRole = params.context?.userRole || 'hrs-analyst';
  const record = params.data;
  
  // Available users based on role
  const getAvailableUsers = () => {
    if (userRole === 'hrs-manager') {
      return [
        { id: 'analyst1', name: 'Sarah Johnson', role: 'HRS Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20 },
        { id: 'analyst2', name: 'Michael Chen', role: 'HRS Analyst', lob: 'Wealth Management', activeCase: 8, capacity: 20 },
        { id: 'analyst3', name: 'Emily Rodriguez', role: 'HRS Analyst', lob: 'Private Banking', activeCase: 15, capacity: 20 }
      ];
    } else if (userRole === 'flu-aml') {
      return [
        { id: 'analyst1', name: 'Sarah Johnson', role: 'HRS Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20 },
        { id: 'manager1', name: 'David Kim', role: 'HRS Manager', lob: 'All LOBs', activeCase: 5, capacity: 10 }
      ];
    }
    return [];
  };

  const resetForm = () => {
    setAssignmentDialogOpen(false);
    setTargetUser("");
    setAssignmentReason("");
  };

  const availableUsers = getAvailableUsers();
  
  const handleAssignment = () => {
    if (assignmentType === 'return') {
      if (!assignmentReason.trim()) {
        toast.error("Please provide a reason for returning the case");
        return;
      }
      toast.success(`Case ${record.caseId} returned with reason: ${assignmentReason}`);
    } else {
      if (!targetUser) {
        toast.error("Please select a user to assign the case to");
        return;
      }
      const user = availableUsers.find(u => u.id === targetUser);
      toast.success(`Case ${record.caseId} ${assignmentType}ed to ${user?.name}`);
    }
    
    // Reset form
    resetForm();
  };

  const openAssignmentDialog = (type: 'assign' | 'reassign' | 'return') => {
    setAssignmentType(type);
    setAssignmentDialogOpen(true);
  };

  const getAvailableActions = () => {
    const actions = [];
    const onNavigateToRiskAssessment = params.context?.onNavigateToRiskAssessment;
    
    // Always show view details
    actions.push(
      <DropdownMenuItem key="view" onClick={() => {
        if (onNavigateToRiskAssessment) {
          onNavigateToRiskAssessment(record);
        } else {
          toast.info("View Details clicked");
        }
      }}>
        <Eye className="h-4 w-4 mr-2" />
        View Details
      </DropdownMenuItem>
    );

    // Show assignment actions based on status and role
    if (record.status === 'unassigned' && (userRole === 'hrs-manager' || userRole === 'flu-aml')) {
      actions.unshift(
        <DropdownMenuItem key="assign" onClick={() => openAssignmentDialog('assign')}>
          <UserCheck className="h-4 w-4 mr-2" />
          Assign Case
        </DropdownMenuItem>
      );
    }

    if ((record.status === 'assigned' || record.status === 'in-progress') && (userRole === 'hrs-manager' || userRole === 'flu-aml')) {
      actions.unshift(
        <DropdownMenuItem key="reassign" onClick={() => openAssignmentDialog('reassign')}>
          <UserCheck className="h-4 w-4 mr-2" />
          Reassign Case
        </DropdownMenuItem>
      );
    }

    if ((userRole === 'flu-aml') && (record.status === 'assigned' || record.status === 'in-progress')) {
      actions.unshift(
        <DropdownMenuItem key="return" onClick={() => openAssignmentDialog('return')}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Return to HRA
        </DropdownMenuItem>
      );
    }

    return actions;
  };

  // Get primary action based on role and case status
  const getPrimaryAction = () => {
    // View Only users cannot perform actions
    if (userRole === 'view-only') {
      return null;
    }
    
    if (record.status === 'unassigned' && (userRole === 'hrs-manager' || userRole === 'flu-aml')) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={() => openAssignmentDialog('assign')}
        >
          <UserCheck className="h-3 w-3 mr-1" />
          Assign
        </Button>
      );
    }
    
    if ((record.status === 'assigned' || record.status === 'in-progress')) {
      if (userRole === 'hrs-manager') {
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => openAssignmentDialog('reassign')}
          >
            <UserCheck className="h-3 w-3 mr-1" />
            Reassign
          </Button>
        );
      } else if (userRole === 'flu-aml') {
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => openAssignmentDialog('return')}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Return
          </Button>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Primary Assignment Action Button */}
      {getPrimaryAction()}

      {/* More Actions Dropdown */}
      <div className="relative z-10">
        <DropdownMenu 
          onOpenChange={(open) => {
            console.log("Work Queue Dropdown state changed:", open);
            if (open) {
              console.log("Dropdown opened for case:", record.caseId);
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onMouseDown={(e) => {
                console.log("Work Queue Button mouse down");
                e.stopPropagation();
              }}
              onPointerDown={(e) => {
                console.log("Work Queue Button pointer down");
              }}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48"
            sideOffset={5}
          >
            {getAvailableActions().map((action, index) => (
              <div key={index}>
                {action}
                {index === getAvailableActions().length - 2 && <DropdownMenuSeparator />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {assignmentType === 'assign' ? 'Assign Case' :
               assignmentType === 'reassign' ? 'Reassign Case' : 'Return Case'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Case Information */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Case Details</h4>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{record.caseId}</p>
                  <p className="text-sm text-muted-foreground">{record.clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    Status: {record.status} • Priority: {record.priority}
                  </p>
                </div>
              </div>
            </div>

            {assignmentType === 'return' ? (
              <div>
                <Label htmlFor="return-reason">Return Reason</Label>
                <Textarea
                  id="return-reason"
                  placeholder="Explain why the case is being returned..."
                  value={assignmentReason}
                  onChange={(e) => setAssignmentReason(e.target.value)}
                  rows={3}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="target-user">
                  {assignmentType === 'assign' ? 'Assign To' : 'Reassign To'}
                </Label>
                <Select value={targetUser} onValueChange={setTargetUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} - {user.role} ({user.activeCase}/{user.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleAssignment}>
                {assignmentType === 'return' ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Return Case
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {assignmentType === 'assign' ? 'Assign' : 'Reassign'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Custom Header Component with Menu
const CustomHeaderComponent = (params: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const onSortAscending = () => {
    params.setSort('asc');
    setMenuOpen(false);
  };

  const onSortDescending = () => {
    params.setSort('desc');
    setMenuOpen(false);
  };

  const onPinColumn = () => {
    const pinned = params.column.getPinned();
    if (pinned) {
      params.api.setColumnsPinned([params.column], null);
    } else {
      params.api.setColumnsPinned([params.column], 'left');
    }
    setMenuOpen(false);
  };

  const onAutoSizeColumn = () => {
    params.api.autoSizeColumns([params.column]);
    setMenuOpen(false);
  };

  const onAutoSizeAllColumns = () => {
    params.api.autoSizeAllColumns();
    setMenuOpen(false);
  };

  const onHideColumn = () => {
    params.api.setColumnsVisible([params.column], false);
    setMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-1">
        <span>{params.displayName}</span>
        {params.column.isSortAscending() && <ArrowUp className="h-3 w-3" />}
        {params.column.isSortDescending() && <ArrowDown className="h-3 w-3" />}
        {params.column.getPinned() && <Pin className="h-3 w-3 text-muted-foreground" />}
      </div>
      
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="h-6 w-6 p-0 ml-1 hover:bg-muted rounded flex items-center justify-center bg-transparent border-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <MoreVertical className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {params.column.getColDef().sortable !== false && (
            <>
              <DropdownMenuItem onClick={onSortAscending}>
                <ArrowUp className="h-4 w-4 mr-2" />
                Sort Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSortDescending}>
                <ArrowDown className="h-4 w-4 mr-2" />
                Sort Descending
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={onPinColumn}>
            <Pin className="h-4 w-4 mr-2" />
            {params.column.getPinned() ? 'Unpin Column' : 'Pin Column'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onAutoSizeColumn}>
            <ScanLine className="h-4 w-4 mr-2" />
            Autosize This Column
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAutoSizeAllColumns}>
            <ScanLine className="h-4 w-4 mr-2" />
            Autosize All Columns
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onHideColumn}>
            <Eye className="h-4 w-4 mr-2" />
            Hide Column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export function WorkQueueTable({ userRole, currentUser, onNavigateToRiskAssessment }: WorkQueueTableProps) {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [bulkOperationsOpen, setBulkOperationsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock data for work queue - broader dataset
  const mockWorkQueueCases: WorkQueueRecord[] = [
    {
      caseId: 'HRA-2024-0101',
      clientId: 'CLT101',
      clientName: 'Meridian Capital Group',
      clientType: 'Investment',
      status: 'new',
      priority: 'medium',
      assignedAnalyst: 'Unassigned',
      createdDate: '2024-06-18',
      dueDate: '2024-06-30',
      riskRating: 'Medium',
      manualReviewReasons: ['New client onboarding'],
      jurisdiction: 'United States',
      lob: 'Investment Banking',
      daysInQueue: 1
    },
    {
      caseId: 'HRA-2024-0102',
      clientId: 'CLT102',
      clientName: 'Atlantic Holdings LLC',
      clientType: 'Corporate',
      status: 'unassigned',
      priority: 'high',
      assignedAnalyst: 'Unassigned',
      createdDate: '2024-06-17',
      dueDate: '2024-06-27',
      riskRating: 'High',
      manualReviewReasons: ['Risk drivers >5', 'Complex ownership'],
      jurisdiction: 'Luxembourg',
      lob: 'Wealth Management',
      daysInQueue: 2
    },
    {
      caseId: 'HRA-2024-0103',
      clientId: 'CLT103',
      clientName: 'Global Tech Ventures',
      clientType: 'Corporate',
      status: 'assigned',
      priority: 'critical',
      assignedAnalyst: 'Sarah Johnson',
      createdDate: '2024-06-16',
      dueDate: '2024-06-26',
      riskRating: 'High',
      manualReviewReasons: ['GFC Intelligence is Yes', 'TRMS referrals'],
      jurisdiction: 'Cayman Islands',
      lob: 'Investment Banking',
      daysInQueue: 3
    },
    {
      caseId: 'HRA-2024-0104',
      clientId: 'CLT104',
      clientName: 'Phoenix Investment Trust',
      clientType: 'Investment',
      status: 'in-progress',
      priority: 'medium',
      assignedAnalyst: 'Michael Chen',
      createdDate: '2024-06-15',
      dueDate: '2024-06-25',
      riskRating: 'Medium',
      manualReviewReasons: ['Beneficial ownership change'],
      jurisdiction: 'Singapore',
      lob: 'Private Banking',
      daysInQueue: 4
    },
    {
      caseId: 'HRA-2024-0105',
      clientId: 'CLT105',
      clientName: 'European Financial Services',
      clientType: 'Banking',
      status: 'escalated',
      priority: 'critical',
      assignedAnalyst: 'Emily Rodriguez',
      createdDate: '2024-06-14',
      dueDate: '2024-06-24',
      riskRating: 'High',
      manualReviewReasons: ['Sanctions screening', 'PEP status'],
      jurisdiction: 'Switzerland',
      lob: 'Commercial Banking',
      daysInQueue: 5,
      escalationReason: 'GFC Intelligence flagged, requiring specialized review'
    },
    {
      caseId: 'HRA-2024-0106',
      clientId: 'CLT106',
      clientName: 'Sterling Commodities Ltd',
      clientType: 'Corporate',
      status: 'returned',
      priority: 'high',
      assignedAnalyst: 'David Kim',
      createdDate: '2024-06-13',
      dueDate: '2024-06-23',
      riskRating: 'High',
      manualReviewReasons: ['Trade allocation review'],
      jurisdiction: 'Hong Kong',
      lob: 'Investment Banking',
      daysInQueue: 6,
      returnReason: 'Missing client documentation and verification'
    },
    {
      caseId: 'HRA-2024-0107',
      clientId: 'CLT107',
      clientName: 'North American Mining Corp',
      clientType: 'Corporate',
      status: 'auto-completed',
      priority: 'low',
      assignedAnalyst: 'Auto-System',
      createdDate: '2024-06-12',
      dueDate: '2024-06-22',
      completedDate: '2024-06-13',
      riskRating: 'Low',
      manualReviewReasons: [],
      jurisdiction: 'Canada',
      lob: 'Commercial Banking',
      daysInQueue: 0
    },
    {
      caseId: 'HRA-2024-0108',
      clientId: 'CLT108',
      clientName: 'Alexander Petrov',
      clientType: 'Individual',
      status: 'manual-review',
      priority: 'high',
      assignedAnalyst: 'Lisa Zhang',
      createdDate: '2024-06-11',
      dueDate: '2024-06-21',
      riskRating: 'High',
      manualReviewReasons: ['High-risk jurisdiction', 'Income source verification'],
      jurisdiction: 'Russia',
      lob: 'Private Banking',
      daysInQueue: 7
    },
    {
      caseId: 'HRA-2024-0109',
      clientId: 'CLT109',
      clientName: 'Pacific Trade Alliance',
      clientType: 'Corporate',
      status: 'completed',
      priority: 'medium',
      assignedAnalyst: 'James Wilson',
      createdDate: '2024-06-08',
      dueDate: '2024-06-18',
      completedDate: '2024-06-16',
      riskRating: 'Medium',
      manualReviewReasons: ['Trade finance review'],
      jurisdiction: 'Australia',
      lob: 'Commercial Banking',
      daysInQueue: 0
    },
    {
      caseId: 'HRA-2024-0110',
      clientId: 'CLT110',
      clientName: 'Digital Assets Fund',
      clientType: 'Investment',
      status: 'abandoned',
      priority: 'low',
      assignedAnalyst: 'Auto-System',
      createdDate: '2024-06-05',
      dueDate: '2024-06-15',
      riskRating: 'Medium',
      manualReviewReasons: ['Incomplete application'],
      jurisdiction: 'Malta',
      lob: 'Investment Banking',
      daysInQueue: 14
    }
  ];

  // Column definitions for AG-Grid
  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'caseId',
      headerName: 'Case ID',
      width: 150,
      pinned: false,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellClass: 'font-mono text-blue-600'
    },
    {
      field: 'clientName',
      headerName: 'Client',
      width: 200,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          {params.data.clientType === 'Individual' ? 
            <User className="h-4 w-4 text-muted-foreground" /> : 
            <Building className="h-4 w-4 text-muted-foreground" />
          }
          <div>
            <p className="font-medium">{params.value}</p>
            <p className="text-xs text-muted-foreground">{params.data.clientType}</p>
          </div>
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: StatusCellRenderer
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: PriorityCellRenderer
    },
    {
      field: 'assignedAnalyst',
      headerName: 'Assigned To',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{params.value === 'Unassigned' ? 'Unassigned' : params.value}</span>
        </div>
      )
    },
    {
      field: 'lob',
      headerName: 'LOB',
      width: 150,
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent
    },
    {
      field: 'daysInQueue',
      headerName: 'Days in Queue',
      width: 130,
      sortable: true,
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <span className={`font-medium ${
          params.value > 5 ? 'text-red-600' : 
          params.value > 2 ? 'text-orange-600' : 
          'text-green-600'
        }`}>
          {params.value} days
        </span>
      )
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{params.value}</span>
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      filter: false,
      headerComponent: CustomHeaderComponent,
      cellRenderer: ActionsCellRenderer,
      pinned: 'right',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }
  ], []);

  // Filter the data based on widget filter only
  const filteredCases = useMemo(() => {
    return mockWorkQueueCases;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedRows(selectedRows.map(row => row.caseId));
    }
  };

  const onExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: 'work-queue-export.csv'
      });
    }
  };

  const resetColumns = () => {
    if (gridApi) {
      gridApi.resetColumnState();
    }
  };

  // Default column configuration
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1
  }), []);

  // Add error boundary
  try {
    return (
      <div className="space-y-6">
        {/* AG-Grid Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Work Queue ({filteredCases.length} cases)</span>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => setBulkOperationsOpen(true)} 
                  variant="outline" 
                  size="sm"
                  disabled={selectedRows.length === 0 || userRole === 'view-only'}
                  className="whitespace-nowrap"
                >
                  <UsersRound className="h-4 w-4 mr-2" />
                  Bulk Operations
                  {selectedRows.length > 0 && (
                    <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                      {selectedRows.length}
                    </Badge>
                  )}
                </Button>
                <Button onClick={onExport} variant="outline" size="sm" className="whitespace-nowrap">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={resetColumns}>
                  <Settings className="h-4 w-4 mr-2" />
                  Reset Columns
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
              {typeof window !== 'undefined' && (
                <AgGridReact
                  rowData={filteredCases}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  onSelectionChanged={onSelectionChanged}
                  animateRows={true}
                  sortingOrder={['desc', 'asc']}
                  suppressMenuHide={true}
                  enableCellTextSelection={true}
                  ensureDomOrder={true}
                  pagination={true}
                  paginationPageSize={20}
                  rowSelection={{
                    mode: 'multiRow',
                    enableClickSelection: false,
                    copySelectedRows: true,
                    checkboxes: true,
                    headerCheckbox: true
                  }}
                  suppressCellEvents={false}
                  enableBrowserTooltips={true}
                  context={{ userRole, onNavigateToRiskAssessment }}
                  icons={getAGGridIconsConfig().iconMap}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Operations Dialog */}
        <BulkOperationsDialog
          open={bulkOperationsOpen}
          onOpenChange={setBulkOperationsOpen}
          userRole={userRole}
          currentUser={currentUser}
          tableType="workqueue"
          selectedCases={selectedRows}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Work Queue table:', error);
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Unable to Load Work Queue</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the work queue table. Please refresh the page or contact support.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}