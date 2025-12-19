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
import { 
  ArrowUpCircle, 
  Search, 
  AlertTriangle,
  Shield,
  Users,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface EscalationRoutingProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  currentUser: any;
}

interface EscalationCase {
  caseId: string;
  clientName: string;
  clientType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskRating: 'Low' | 'Medium' | 'High';
  currentStatus: string;
  dueDate: string;
  lob: string;
  riskFactors: string[];
}

interface EscalationReason {
  id: string;
  label: string;
  description: string;
  requiresManager: boolean;
  targetRole: 'hra-manager' | 'flu-aml' | 'gfc';
}

export function EscalationRouting({ userRole, currentUser }: EscalationRoutingProps) {
  const [selectedCase, setSelectedCase] = useState<EscalationCase | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [escalationType, setEscalationType] = useState<'flu-aml' | 'gfc' | 'manager' | 'cancellation'>('flu-aml');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [targetManager, setTargetManager] = useState("");
  const [escalationNotes, setEscalationNotes] = useState("");
  const [disposition, setDisposition] = useState("");

  // Mock case data
  const availableCases: EscalationCase[] = [
    {
      caseId: 'HRA-2024-0401',
      clientName: 'Global Dynamics Corp',
      clientType: 'Corporate',
      priority: 'high',
      riskRating: 'High',
      currentStatus: 'In Review',
      dueDate: '2024-06-25',
      lob: 'Investment Banking',
      riskFactors: ['GFC Intelligence flagged', 'Risk drivers >10', 'TRMS referral pending']
    },
    {
      caseId: 'HRA-2024-0402',
      clientName: 'Sterling Investment Group',
      clientType: 'Investment',
      priority: 'critical',
      riskRating: 'High',
      currentStatus: 'Pending Escalation',
      dueDate: '2024-06-24',
      lob: 'Investment Banking',
      riskFactors: ['Client escalation required', 'Beneficial ownership changes', 'High-risk jurisdiction']
    },
    {
      caseId: 'HRA-2024-0403',
      clientName: 'Pacific Holdings Ltd',
      clientType: 'Investment',
      priority: 'medium',
      riskRating: 'Medium',
      currentStatus: 'Under Analysis',
      dueDate: '2024-06-28',
      lob: 'Wealth Management',
      riskFactors: ['Address changes', 'New risk factors ≥5']
    }
  ];

  // Escalation reasons based on requirements
  const escalationReasons: EscalationReason[] = [
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

  // Available managers for escalation
  const availableManagers = [
    { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs' },
    { id: 'manager2', name: 'Lisa Chen', role: 'HRA Manager', lob: 'Investment Banking' },
    { id: 'manager3', name: 'Robert Taylor', role: 'HRA Manager', lob: 'Wealth Management' }
  ];

  const filteredCases = availableCases.filter(caseItem => 
    !searchTerm || 
    caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEscalationTarget = () => {
    if (userRole === 'hra-analyst') {
      return 'HRA Manager (for routing to ' + (escalationType === 'flu-aml' ? 'FLU AML' : escalationType === 'gfc' ? 'GFC' : 'Manager Review') + ')';
    } else if (userRole === 'hra-manager') {
      return escalationType === 'flu-aml' ? 'FLU AML Representative' : 
             escalationType === 'gfc' ? 'GFC Representative' : 'Manager Review';
    }
    return 'Direct Escalation';
  };

  const handleEscalation = () => {
    if (!selectedCase) {
      toast.error("Please select a case to escalate");
      return;
    }

    if (selectedReasons.length === 0) {
      toast.error("Please select at least one escalation reason");
      return;
    }

    if (userRole === 'hra-analyst' && !targetManager) {
      toast.error("Please select a manager for escalation");
      return;
    }

    const target = userRole === 'hra-analyst' ? 
      availableManagers.find(m => m.id === targetManager)?.name : 
      getEscalationTarget();

    toast.success(`Case ${selectedCase.caseId} escalated to ${target}`);
    
    // Reset form
    setSelectedCase(null);
    setSelectedReasons([]);
    setTargetManager("");
    setEscalationNotes("");
    setDisposition("");
  };

  const handleDisposition = () => {
    if (!selectedCase) {
      toast.error("Please select a case");
      return;
    }

    if (!disposition) {
      toast.error("Please select a disposition");
      return;
    }

    if (disposition === 'escalate_flu' || disposition === 'escalate_gfc') {
      if (selectedReasons.length === 0) {
        toast.error("Please select escalation reasons");
        return;
      }
    }

    toast.success(`Case ${selectedCase.caseId} dispositioned: ${disposition}`);
    
    // Reset form
    setSelectedCase(null);
    setDisposition("");
    setSelectedReasons([]);
    setEscalationNotes("");
  };

  const toggleReason = (reasonId: string) => {
    setSelectedReasons(prev => 
      prev.includes(reasonId) ? 
      prev.filter(id => id !== reasonId) : 
      [...prev, reasonId]
    );
  };

  const getRelevantReasons = () => {
    return escalationReasons.filter(reason => {
      if (escalationType === 'flu-aml') return reason.targetRole === 'flu-aml';
      if (escalationType === 'gfc') return reason.targetRole === 'gfc';
      if (escalationType === 'manager') return reason.targetRole === 'hra-manager';
      return true;
    });
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Select Case for Escalation</span>
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
                    </div>
                  </div>
                  {caseItem.riskFactors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Risk Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {caseItem.riskFactors.slice(0, 2).map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                        {caseItem.riskFactors.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{caseItem.riskFactors.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Escalation/Disposition Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpCircle className="h-5 w-5" />
              <span>
                {userRole === 'hra-analyst' || userRole === 'hra-manager' ? 'Case Disposition & Escalation' : 'Case Escalation'}
              </span>
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
                        Status: {selectedCase.currentStatus} • Due: {new Date(selectedCase.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disposition Options for Analysts and Managers */}
                {(userRole === 'hra-analyst' || userRole === 'hra-manager') && (
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
                          {userRole === 'hra-manager' && (
                            <SelectItem value="return_analyst">Return to HRA Analyst for corrections</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {(disposition === 'escalate_flu' || disposition === 'escalate_gfc') && (
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
                    )}

                    <Separator />
                  </>
                )}

                {/* Escalation Reasons */}
                {(disposition === 'escalate_flu' || disposition === 'escalate_gfc' || !disposition) && (
                  <div>
                    <Label>Escalation Reasons</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2 max-h-48 overflow-y-auto">
                      {getRelevantReasons().map((reason) => (
                        <div key={reason.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={reason.id}
                            checked={selectedReasons.includes(reason.id)}
                            onCheckedChange={() => toggleReason(reason.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={reason.id} className="font-medium cursor-pointer">
                              {reason.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
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
                )}

                {/* Manager Selection for Analysts */}
                {userRole === 'hra-analyst' && (disposition === 'escalate_flu' || disposition === 'escalate_gfc' || !disposition) && (
                  <div>
                    <Label htmlFor="target-manager">Route to Manager</Label>
                    <Select value={targetManager} onValueChange={setTargetManager}>
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

                <Separator />

                <div className="flex items-center space-x-2">
                  {disposition && disposition !== 'no_factors' ? (
                    <Button onClick={handleDisposition} className="flex-1">
                      {disposition === 'escalate_flu' ? (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Escalate to FLU AML
                        </>
                      ) : disposition === 'escalate_gfc' ? (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Escalate to GFC
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="h-4 w-4 mr-2" />
                          Return to Analyst
                        </>
                      )}
                    </Button>
                  ) : disposition === 'no_factors' ? (
                    <Button onClick={handleDisposition} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Case - No Escalation
                    </Button>
                  ) : (
                    <Button onClick={handleEscalation} className="flex-1">
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      Escalate Case
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedCase(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ArrowUpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a case from the list to begin escalation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Escalation Flow Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Escalation Flow Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">HRA Analyst</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Review case details</li>
                <li>• Select disposition</li>
                <li>• Route to HRA Manager</li>
                <li>• Add escalation notes</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">HRA Manager</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Review escalation</li>
                <li>• Approve/return to analyst</li>
                <li>• Route to FLU AML/GFC</li>
                <li>• Bulk reassignment</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">FLU AML</span>
              </div>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Review AML concerns</li>
                <li>• Investigate risk factors</li>
                <li>• Complete/return case</li>
                <li>• Document findings</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">GFC</span>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Review GFC intelligence</li>
                <li>• Conduct investigation</li>
                <li>• Final disposition</li>
                <li>• Close or return</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}