import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react@32.2.2";
import type { ColDef, GridApi, GridReadyEvent } from "ag-grid-community@32.2.2";
import { getAGGridIconsConfig } from "./ag-grid-icons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { 
  Search, 
  Filter, 
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Pin,
  PinOff,
  ScanLine,
  Columns,
  Settings,
  Grid3X3
} from "lucide-react";

// AG-Grid styles are imported globally in globals.css

interface CaseRecord {
  caseId: string;
  clientId: string;
  clientName: string;
  clientType: 'Individual' | 'Corporate' | 'Investment' | 'Banking';
  status: 'auto-completed' | 'manual-review' | 'in-progress' | 'completed' | 'reopened';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAnalyst: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  riskRating: 'Low' | 'Medium' | 'High';
  manualReviewReasons: string[];
  jurisdiction: string;
}

// Custom cell renderers
const StatusCellRenderer = (params: any) => {
  const status = params.value;
  const getStatusStyle = () => {
    switch (status) {
      case 'auto-completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'manual-review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reopened':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyle()} capitalize`}>
      {status.replace('-', ' ')}
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

const RiskRatingCellRenderer = (params: any) => {
  const rating = params.value;
  const getRatingStyle = () => {
    switch (rating) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={getRatingStyle()}>
      {rating}
    </Badge>
  );
};

const ActionsCellRenderer = (params: any) => {
  return (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <Eye className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <Edit className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <RotateCcw className="h-3 w-3" />
      </Button>
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

export function CaseTrackingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [priorityFilter, setPriorityFilter] = useState("all-priorities");
  const [gridApi, setGridApi] = useState<GridApi>();

  const mockCases: CaseRecord[] = [
    {
      caseId: 'HRA-2024-0001',
      clientId: 'CLT001',
      clientName: 'Oceanic Holdings Ltd',
      clientType: 'Corporate',
      status: 'manual-review',
      priority: 'high',
      assignedAnalyst: 'Sarah Johnson',
      createdDate: '2024-06-01',
      dueDate: '2024-06-15',
      riskRating: 'High',
      manualReviewReasons: ['GFC Intelligence is Yes', 'Risk drivers >10', 'TRMS referrals'],
      jurisdiction: 'Cayman Islands'
    },
    {
      caseId: 'HRA-2024-0002',
      clientId: 'CLT002',
      clientName: 'Global Trade Solutions',
      clientType: 'Corporate',
      status: 'in-progress',
      priority: 'medium',
      assignedAnalyst: 'Michael Chen',
      createdDate: '2024-06-02',
      dueDate: '2024-06-16',
      riskRating: 'Medium',
      manualReviewReasons: ['Trade Allocation', 'Complex ownership structure'],
      jurisdiction: 'Singapore'
    },
    {
      caseId: 'HRA-2024-0003',
      clientId: 'CLT003',
      clientName: 'Heritage Bank Corp',
      clientType: 'Banking',
      status: 'completed',
      priority: 'high',
      assignedAnalyst: 'Emily Rodriguez',
      createdDate: '2024-05-28',
      dueDate: '2024-06-12',
      completedDate: '2024-06-10',
      riskRating: 'High',
      manualReviewReasons: ['PEP status', 'Sanctions screening'],
      jurisdiction: 'Luxembourg'
    },
    {
      caseId: 'HRA-2024-0004',
      clientId: 'CLT004',
      clientName: 'International Investment Fund',
      clientType: 'Investment',
      status: 'auto-completed',
      priority: 'low',
      assignedAnalyst: 'David Kim',
      createdDate: '2024-06-03',
      dueDate: '2024-06-17',
      completedDate: '2024-06-03',
      riskRating: 'Low',
      manualReviewReasons: [],
      jurisdiction: 'United States'
    },
    {
      caseId: 'HRA-2024-0005',
      clientId: 'CLT005',
      clientName: 'Tech Innovations LLC',
      clientType: 'Corporate',
      status: 'reopened',
      priority: 'critical',
      assignedAnalyst: 'Lisa Zhang',
      createdDate: '2024-05-30',
      dueDate: '2024-06-13',
      riskRating: 'High',
      manualReviewReasons: ['Additional documents required', 'Regulatory inquiry'],
      jurisdiction: 'United Kingdom'
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
      filter: true,
      headerComponent: CustomHeaderComponent,
      cellClass: 'font-mono text-blue-600'
    },
    {
      field: 'clientName',
      headerName: 'Client',
      width: 200,
      sortable: true,
      filter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{params.value}</span>
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: false,
      filter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: StatusCellRenderer
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 130,
      sortable: false,
      filter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: PriorityCellRenderer
    },
    {
      field: 'assignedAnalyst',
      headerName: 'Assigned To',
      width: 150,
      sortable: true,
      filter: true,
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{params.value}</span>
        </div>
      )
    },
    {
      field: 'createdDate',
      headerName: 'Created',
      width: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
      headerComponent: CustomHeaderComponent,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{params.value}</span>
        </div>
      )
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
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
      width: 120,
      sortable: false,
      filter: false,
      headerComponent: CustomHeaderComponent,
      cellRenderer: ActionsCellRenderer,
      pinned: 'right'
    }
  ], []);

  // Filter the data based on search and filters
  const filteredCases = useMemo(() => {
    return mockCases.filter(caseRecord => {
      const matchesSearch = searchTerm === "" || 
        caseRecord.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseRecord.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseRecord.assignedAnalyst.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all-statuses" || caseRecord.status === statusFilter;
      const matchesPriority = priorityFilter === "all-priorities" || caseRecord.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const onExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: 'case-tracking-export.csv'
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="auto-completed">Auto Completed</SelectItem>
                <SelectItem value="manual-review">Manual Review</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="reopened">Reopened</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-priorities">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={onExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AG-Grid Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Case Tracking ({filteredCases.length} cases)</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetColumns}>
                <Settings className="h-4 w-4 mr-2" />
                Reset Columns
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
            <AgGridReact
              rowData={filteredCases}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
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
                copySelectedRows: true
              }}
              enableBrowserTooltips={true}
              icons={getAGGridIconsConfig().iconMap}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}