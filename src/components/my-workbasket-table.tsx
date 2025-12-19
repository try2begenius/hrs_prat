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
import { 
  Eye, 
  Edit, 
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
  PlayCircle,
  ArrowRight,
  Shield,
  UsersRound
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { getMockWorkbasketCases, matchesWidgetFilter, MyWorkbasketRecord, WorkbasketFilter } from "./workbasket-data";

// AG-Grid styles are imported globally in globals.css

interface MyWorkbasketTableProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc' | 'view-only' | 'hrs-analyst' | 'hrs-manager';
  currentUser: any;
  widgetFilter?: WorkbasketFilter;
  onNavigateToRiskAssessment?: (caseData: any) => void;
}

// Custom cell renderers
const StatusCellRenderer = (params: any) => {
  const status = params.value;
  const getStatusStyle = () => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'returned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manual-review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'escalated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'assigned':
        return <UserCheck className="h-3 w-3" />;
      case 'in-progress':
        return <Activity className="h-3 w-3" />;
      case 'returned':
        return <RotateCcw className="h-3 w-3" />;
      case 'manual-review':
        return <AlertTriangle className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'escalated':
        return <ArrowUpCircle className="h-3 w-3" />;
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

// Actions cell renderer for personal workbasket functionality
const ActionsCellRenderer: React.FC<any> = (props) => {
  const params = props;
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'escalate' | 'complete' | 'return'>('escalate');
  const [targetUser, setTargetUser] = useState("");
  const [assignmentReason, setAssignmentReason] = useState("");
  
  // Enhanced escalation state
  const [disposition, setDisposition] = useState("");
  const [selectedEscalationReasons, setSelectedEscalationReasons] = useState<string[]>([]);
  const [escalationType, setEscalationType] = useState<'flu-aml' | 'gfc' | 'manager' | 'cancellation'>('flu-aml');
  const [escalationNotes, setEscalationNotes] = useState("");
  
  // Get user role from params (passed from parent)
  const userRole = params.context?.userRole || 'hra-analyst';
  const record = params.data;
  
  // Escalation reasons
  const escalationReasons = [
    { id: 'gfc_intelligence', label: 'GFC Intelligence flagged', description: 'Global Financial Crimes intelligence indicates concern', requiresManager: true, targetRole: 'gfc' },
    { id: 'risk_drivers_high', label: 'Risk drivers >10', description: 'Total risk CRR drivers exceeds threshold', requiresManager: true, targetRole: 'flu-aml' },
    { id: 'new_risk_factors', label: 'New risk factors ≥5', description: 'Five or more new risk factors since last refresh', requiresManager: true, targetRole: 'flu-aml' },
    { id: 'trms_referral', label: 'TRMS referral required', description: 'Transaction Risk Management System referral needed', requiresManager: true, targetRole: 'flu-aml' },
    { id: 'client_escalation', label: 'Client Escalation Committee', description: 'Case requires client escalation committee review', requiresManager: true, targetRole: 'gfc' },
    { id: 'beneficial_ownership', label: 'Beneficial ownership changes', description: 'Significant changes in beneficial ownership structure', requiresManager: false, targetRole: 'flu-aml' },
    { id: 'address_change', label: 'Address changes', description: 'Significant address or location changes', requiresManager: false, targetRole: 'flu-aml' },
    { id: 'naics_change', label: 'Nature of Business changes', description: 'Changes in business nature or industry classification', requiresManager: false, targetRole: 'flu-aml' },
    { id: 'income_source', label: 'Source of Income changes', description: 'Changes in source of income for individual clients', requiresManager: false, targetRole: 'flu-aml' },
    { id: 'incomplete_info', label: 'Required information incomplete', description: 'Missing required data elements', requiresManager: false, targetRole: 'hra-manager' },
    { id: 'cancellation', label: 'Client cancellation required', description: 'Case requires client relationship cancellation', requiresManager: true, targetRole: 'hra-manager' }
  ];
  
  // Available managers for analyst escalations
  const availableManagers = [
    { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs' },
    { id: 'manager2', name: 'Lisa Chen', role: 'HRA Manager', lob: 'Investment Banking' },
    { id: 'manager3', name: 'Robert Taylor', role: 'HRA Manager', lob: 'Wealth Management' }
  ];

  // Helper functions for escalation
  const getRelevantEscalationReasons = () => {
    return escalationReasons.filter(reason => {
      if (escalationType === 'flu-aml') return reason.targetRole === 'flu-aml';
      if (escalationType === 'gfc') return reason.targetRole === 'gfc';
      if (escalationType === 'manager') return reason.targetRole === 'hra-manager';
      return true;
    });
  };

  const toggleEscalationReason = (reasonId: string) => {
    setSelectedEscalationReasons(prev => 
      prev.includes(reasonId) ? 
      prev.filter(id => id !== reasonId) : 
      [...prev, reasonId]
    );
  };

  const resetEscalationForm = () => {
    setAssignmentDialogOpen(false);
    setTargetUser("");
    setAssignmentReason("");
    setDisposition("");
    setSelectedEscalationReasons([]);
    setEscalationType('flu-aml');
    setEscalationNotes("");
  };

  const handleAction = () => {
    if (assignmentType === 'return') {
      if (!assignmentReason.trim()) {
        toast.error("Please provide a reason for returning the case");
        return;
      }
      toast.success(`Case ${record.caseId} returned with reason: ${assignmentReason}`);
    } else if (assignmentType === 'complete') {
      toast.success(`Case ${record.caseId} completed successfully`);
    } else if (assignmentType === 'escalate') {
      if (disposition === 'escalate_flu' || disposition === 'escalate_gfc') {
        if (selectedEscalationReasons.length === 0) {
          toast.error("Please select at least one escalation reason");
          return;
        }
        if (!targetUser && userRole === 'hra-analyst') {
          toast.error("Please select a manager to route the escalation through");
          return;
        }
      }
      toast.success(`Case ${record.caseId} escalated successfully`);
    }
    
    resetEscalationForm();
  };

  const openActionDialog = (type: 'escalate' | 'complete' | 'return') => {
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

    // Edit case - available for assigned and in-progress cases
    if (record.status === 'assigned' || record.status === 'in-progress') {
      actions.push(
        <DropdownMenuItem key="edit" onClick={() => toast.info("Edit Case clicked")}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Case
        </DropdownMenuItem>
      );
    }

    // Case-specific actions based on status and user role
    if (userRole === 'hra-analyst') {
      if (record.status === 'assigned' || record.status === 'in-progress') {
        actions.push(
          <DropdownMenuItem key="escalate" onClick={() => openActionDialog('escalate')}>
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Escalate Case
          </DropdownMenuItem>
        );
        
        if (record.status === 'in-progress') {
          actions.push(
            <DropdownMenuItem key="complete" onClick={() => openActionDialog('complete')}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Case
            </DropdownMenuItem>
          );
        }
      }
    } else if (userRole === 'hra-manager' || userRole === 'flu-aml' || userRole === 'gfc') {
      if (record.status === 'assigned' || record.status === 'in-progress') {
        actions.push(
          <DropdownMenuItem key="return" onClick={() => openActionDialog('return')}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Return Case
          </DropdownMenuItem>
        );
      }
    }

    return actions;
  };

  // Get primary action based on role and case status
  const getPrimaryAction = () => {
    // View Only users cannot perform actions
    if (userRole === 'view-only') {
      return null;
    }
    
    // Removed Escalate button for hrs-analyst as per requirement
    if ((userRole === 'hrs-manager' || userRole === 'flu-aml') && 
               (record.status === 'assigned' || record.status === 'in-progress')) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={() => openActionDialog('return')}
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Return
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Primary Action Button */}
      {getPrimaryAction()}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
          {getAvailableActions().map((action, index) => (
            <div key={index}>
              {action}
              {index === 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {assignmentType === 'escalate' ? 'Case Disposition & Escalation' : 
               assignmentType === 'complete' ? 'Complete Case' : 'Return Case'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Case Information */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Case Details</h4>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {record.clientType === 'Individual' ? 
                    <User className="h-4 w-4 text-primary" /> : 
                    <Building className="h-4 w-4 text-primary" />
                  }
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

            {/* Enhanced escalation flow for analysts */}
            {assignmentType === 'escalate' && userRole === 'hra-analyst' ? (
              <>
                <div>
                  <Label htmlFor="disposition">Case Disposition</Label>
                  <Select value={disposition} onValueChange={setDisposition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disposition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_factors">No factors impacting decision to retain client</SelectItem>
                      <SelectItem value="escalate_flu">Escalate to FLU AML Representative</SelectItem>
                      <SelectItem value="escalate_gfc">Escalate to GFC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(disposition === 'escalate_flu' || disposition === 'escalate_gfc') && (
                  <>
                    <div>
                      <Label htmlFor="escalation-type">Escalation Type</Label>
                      <Select value={escalationType} onValueChange={(value: any) => setEscalationType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flu-aml">FLU AML Representative</SelectItem>
                          <SelectItem value="gfc">GFC Representative</SelectItem>
                          <SelectItem value="manager">Manager Review</SelectItem>
                          <SelectItem value="cancellation">Client Cancellation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Escalation Reasons</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {getRelevantEscalationReasons().map((reason) => (
                          <div key={reason.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <input
                              type="checkbox"
                              id={reason.id}
                              checked={selectedEscalationReasons.includes(reason.id)}
                              onChange={() => toggleEscalationReason(reason.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label htmlFor={reason.id} className="font-medium cursor-pointer text-sm">
                                {reason.label}
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                {reason.description}
                              </p>
                              {reason.requiresManager && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Requires Manager Approval
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="target-manager">Route to Manager</Label>
                      <Select value={targetUser} onValueChange={setTargetUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HRA Manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name} - {manager.lob}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Case will be routed to manager for approval before {escalationType === 'flu-aml' ? 'FLU AML' : 'GFC'} escalation
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="escalation-notes">Notes</Label>
                  <Textarea
                    id="escalation-notes"
                    placeholder="Add any relevant notes for the escalation..."
                    value={escalationNotes}
                    onChange={(e) => setEscalationNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            ) : assignmentType === 'return' ? (
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
            ) : assignmentType === 'complete' ? (
              <div>
                <Label htmlFor="completion-notes">Completion Notes</Label>
                <Textarea
                  id="completion-notes"
                  placeholder="Add any notes about case completion..."
                  value={assignmentReason}
                  onChange={(e) => setAssignmentReason(e.target.value)}
                  rows={3}
                />
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={resetEscalationForm}>
                Cancel
              </Button>
              <Button onClick={handleAction}>
                {assignmentType === 'escalate' && disposition === 'no_factors' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Case
                  </>
                ) : assignmentType === 'escalate' && disposition === 'escalate_flu' ? (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate to FLU AML
                  </>
                ) : assignmentType === 'escalate' && disposition === 'escalate_gfc' ? (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Escalate to GFC
                  </>
                ) : assignmentType === 'return' ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Return Case
                  </>
                ) : assignmentType === 'complete' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Case
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Submit
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

export function MyWorkbasketTable({ userRole, currentUser, widgetFilter = 'all', onNavigateToRiskAssessment }: MyWorkbasketTableProps) {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [bulkOperationsOpen, setBulkOperationsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock data for personal workbasket - using shared data source
  const mockMyWorkbasketCases: MyWorkbasketRecord[] = getMockWorkbasketCases(currentUser);

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
      cellClass: 'font-mono text-blue-600',
      cellRenderer: (params: any) => {
        const onNavigateToRiskAssessment = params.context?.onNavigateToRiskAssessment;
        return (
          <button
            onClick={() => {
              if (onNavigateToRiskAssessment) {
                onNavigateToRiskAssessment(params.data);
              }
            }}
            className="font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            {params.value}
          </button>
        );
      }
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
    }
  ], []);

  // Use shared widget filter function

  // Filter the data based on search and filters
  const filteredCases = useMemo(() => {
    return mockMyWorkbasketCases.filter(caseRecord => {
      const matchesWidget = matchesWidgetFilter(caseRecord, widgetFilter);
      
      return matchesWidget;
    });
  }, [widgetFilter]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const onExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: 'my-workbasket-export.csv'
      });
    }
  };

  const resetColumns = () => {
    if (gridApi) {
      gridApi.resetColumnState();
    }
  };

  const handleGetNextCase = () => {
    toast.success("Assigned next available case to you");
  };

  // Selection change handler
  const onSelectionChanged = () => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      setSelectedRows(selectedRows.map(row => row.caseId));
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
              <span>My Workbasket ({filteredCases.length} cases)</span>
              <div className="flex items-center space-x-2">
                {userRole === 'hrs-analyst' && (
                  <Button onClick={handleGetNextCase} size="sm" className="whitespace-nowrap">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Get Next
                  </Button>
                )}
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
          tableType="workbasket"
          selectedCases={selectedRows}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering My Workbasket table:', error);
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Unable to Load Workbasket</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your workbasket table. Please refresh the page or contact support.
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