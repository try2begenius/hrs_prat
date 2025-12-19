import { useState, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Shield,
  Plus,
  Edit,
  Save,
  Trash2,
  Building,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";

interface RiskMitigantsProps {
  caseData: any;
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  canEdit: boolean;
  onDataChange: () => void;
}

interface RiskMitigant {
  id: string;
  riskCategory: string;
  riskAttribute: string;
  craCode: string;
  attributeDescription: string;
  controlProcess: string;
  lob: string;
  description: string;
  effectiveness: 'high' | 'medium' | 'low';
}

interface ControlProcess {
  id: string;
  name: string;
  flu: string;
  riskFactor: string;
  description: string;
  isPrimary: boolean;
}

export function RiskMitigantsSection({ 
  caseData, 
  userRole, 
  canEdit, 
  onDataChange 
}: RiskMitigantsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showApprovalAlert, setShowApprovalAlert] = useState(false);
  const [showControlProcessDialog, setShowControlProcessDialog] = useState(false);
  
  // GFC Regulator Question State
  const [regulatorData, setRegulatorData] = useState({
    isRegulated: true,
    regulatorName: "Securities and Exchange Commission (SEC)"
  });
  
  // Control Processes Master List State
  const [controlProcessList, setControlProcessList] = useState<ControlProcess[]>([
    {
      id: "1",
      name: "Enhanced Due Diligence (EDD)",
      flu: "Investment Banking",
      riskFactor: "Geography - High Risk Jurisdiction",
      description: "Comprehensive review of client background",
      isPrimary: true
    },
    {
      id: "2",
      name: "Ongoing PEP Monitoring",
      flu: "Wealth Management",
      riskFactor: "Customer Attributes - PEP Status",
      description: "Continuous screening and review",
      isPrimary: true
    }
  ]);

  const [newControlProcess, setNewControlProcess] = useState<Partial<ControlProcess>>({
    name: "",
    flu: "",
    riskFactor: "",
    description: "",
    isPrimary: false
  });
  
  const [showAddControlProcess, setShowAddControlProcess] = useState(false);

  const [mitigants, setMitigants] = useState<RiskMitigant[]>([
    {
      id: "1",
      riskCategory: "Geography",
      riskAttribute: "High-Risk Jurisdiction (Cayman Islands)",
      craCode: "G001",
      attributeDescription: "High-risk jurisdiction",
      controlProcess: "Enhanced Due Diligence (EDD)",
      lob: "Investment Banking",
      description: "Annual enhanced due diligence review",
      effectiveness: "high"
    },
    {
      id: "2", 
      riskCategory: "Customer Attributes",
      riskAttribute: "PEP Status (Foreign)",
      craCode: "C001",
      attributeDescription: "Politically exposed person",
      controlProcess: "Ongoing PEP Monitoring",
      lob: "Wealth Management",
      description: "Continuous screening against global PEP databases",
      effectiveness: "medium"
    }
  ]);

  const [newMitigant, setNewMitigant] = useState<Partial<RiskMitigant>>({
    riskCategory: "",
    riskAttribute: "",
    craCode: "",
    attributeDescription: "",
    controlProcess: "",
    lob: "",
    description: "",
    effectiveness: "medium"
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // Available options for dropdowns
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

  const controlProcesses = [
    "Enhanced Due Diligence (EDD)",
    "Transaction Monitoring",
    "Ongoing PEP Monitoring", 
    "Intelligence Review Committee",
    "Quarterly Risk Review",
    "Annual Compliance Assessment",
    "Daily Transaction Reconciliation",
    "Enhanced KYC Procedures",
    "Regulatory Reporting",
    "Client Escalation Committee Review"
  ];

  const handleAddMitigant = useCallback(() => {
    if (newMitigant.riskCategory && newMitigant.riskAttribute && newMitigant.controlProcess) {
      const mitigant: RiskMitigant = {
        id: Date.now().toString(),
        riskCategory: newMitigant.riskCategory!,
        riskAttribute: newMitigant.riskAttribute!,
        craCode: newMitigant.craCode || "",
        attributeDescription: newMitigant.attributeDescription || "",
        controlProcess: newMitigant.controlProcess!,
        lob: newMitigant.lob || "All LOBs",
        description: newMitigant.description || "",
        effectiveness: newMitigant.effectiveness as 'high' | 'medium' | 'low' || "medium"
      };
      
      setMitigants(prev => [...prev, mitigant]);
      setNewMitigant({
        riskCategory: "",
        riskAttribute: "",
        craCode: "",
        attributeDescription: "",
        controlProcess: "",
        lob: "",
        description: "",
        effectiveness: "medium"
      });
      setShowAddForm(false);
      setShowApprovalAlert(true);
      onDataChange();
    }
  }, [newMitigant, onDataChange]);

  const handleDeleteMitigant = useCallback((id: string) => {
    setMitigants(prev => prev.filter(m => m.id !== id));
    setShowApprovalAlert(true);
    onDataChange();
  }, [onDataChange]);

  const handleUpdateMitigant = useCallback((id: string, field: keyof RiskMitigant, value: string) => {
    setMitigants(prev => prev.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
    setShowApprovalAlert(true);
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    onDataChange();
  }, [onDataChange]);

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
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Internal control processes in place for each FLU to mitigate client risks. Controls are automatically populated based on LOB and risk factors.
        </p>
      </div>

        {/* GFC Regulator Question */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label className="text-sm flex-1">Is the client regulated by GFC approved regulator, if applicable?</Label>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-md ${
                    regulatorData.isRegulated 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-gray-600 bg-gray-100'
                  }`}>
                    {regulatorData.isRegulated ? "Yes" : "No"}
                  </span>
                  <Switch
                    checked={regulatorData.isRegulated}
                    onCheckedChange={(value) => setRegulatorData({...regulatorData, isRegulated: value})}
                    disabled={!canEdit || !isEditing}
                  />
                </div>
              </div>
              
              {regulatorData.isRegulated && (
                <div className="space-y-2 pl-4 border-l-2 border-blue-300">
                  <Label htmlFor="regulator-name" className="text-sm">If so, by which regulator?</Label>
                  <Input
                    id="regulator-name"
                    value={regulatorData.regulatorName}
                    onChange={(e) => setRegulatorData({...regulatorData, regulatorName: e.target.value})}
                    disabled={!canEdit || !isEditing}
                    placeholder="Enter regulator name..."
                    className="bg-white"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />
        
        {/* Add New Mitigant Form */}
        {canEdit && isEditing && (
          <Card className="border-dashed border-2 border-primary/20">
            <CardContent className="p-4">
              {!showAddForm ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Risk Mitigant
                </Button>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Add New Risk Mitigant</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-risk-category">Risk Category</Label>
                      <Select
                        value={newMitigant.riskCategory}
                        onValueChange={(value) => setNewMitigant({...newMitigant, riskCategory: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {riskCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-control-process">Control Process</Label>
                      <Select
                        value={newMitigant.controlProcess}
                        onValueChange={(value) => setNewMitigant({...newMitigant, controlProcess: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select control" />
                        </SelectTrigger>
                        <SelectContent>
                          {controlProcesses.map((process) => (
                            <SelectItem key={process} value={process}>{process}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-lob">Line of Business</Label>
                      <Select
                        value={newMitigant.lob}
                        onValueChange={(value) => setNewMitigant({...newMitigant, lob: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select LOB" />
                        </SelectTrigger>
                        <SelectContent>
                          {lobOptions.map((lob) => (
                            <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-risk-attribute">Risk Attribute</Label>
                    <Textarea
                      id="new-risk-attribute"
                      placeholder="Describe the specific risk attribute being mitigated..."
                      value={newMitigant.riskAttribute}
                      onChange={(e) => setNewMitigant({...newMitigant, riskAttribute: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-cra-code">CRA Code</Label>
                    <Input
                      id="new-cra-code"
                      placeholder="Enter CRA code..."
                      value={newMitigant.craCode}
                      onChange={(e) => setNewMitigant({...newMitigant, craCode: e.target.value})}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-attribute-description">Attribute Description</Label>
                    <Textarea
                      id="new-attribute-description"
                      placeholder="Describe the attribute in detail..."
                      value={newMitigant.attributeDescription}
                      onChange={(e) => setNewMitigant({...newMitigant, attributeDescription: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-description">Control Description</Label>
                    <Textarea
                      id="new-description"
                      placeholder="Describe how this control process mitigates the risk..."
                      value={newMitigant.description}
                      onChange={(e) => setNewMitigant({...newMitigant, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-effectiveness">Control Effectiveness</Label>
                    <Select
                      value={newMitigant.effectiveness}
                      onValueChange={(value) => setNewMitigant({...newMitigant, effectiveness: value as 'high' | 'medium' | 'low'})}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddMitigant}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Mitigant
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Existing Mitigants Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Current Risk Mitigants</h4>
            <Badge variant="outline">{mitigants.length} mitigant{mitigants.length !== 1 ? 's' : ''}</Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk Category</TableHead>
                  <TableHead>Risk Attribute</TableHead>
                  <TableHead>Control Process</TableHead>
                  <TableHead>LOB</TableHead>
                  <TableHead>Effectiveness</TableHead>
                  {canEdit && isEditing && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mitigants.map((mitigant) => (
                  <TableRow key={mitigant.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {canEdit && isEditing ? (
                          <Select
                            value={mitigant.riskCategory}
                            onValueChange={(value) => handleUpdateMitigant(mitigant.id, 'riskCategory', value)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {riskCategories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="font-medium">{mitigant.riskCategory}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {canEdit && isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={mitigant.riskAttribute}
                            onChange={(e) => handleUpdateMitigant(mitigant.id, 'riskAttribute', e.target.value)}
                            className="text-sm"
                            placeholder="Risk attribute"
                          />
                          <Textarea
                            value={mitigant.description}
                            onChange={(e) => handleUpdateMitigant(mitigant.id, 'description', e.target.value)}
                            className="text-xs"
                            placeholder="Description"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-sm">{mitigant.riskAttribute}</p>
                          {mitigant.description && (
                            <p className="text-xs text-muted-foreground mt-1">{mitigant.description}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {canEdit && isEditing ? (
                        <Select
                          value={mitigant.controlProcess}
                          onValueChange={(value) => handleUpdateMitigant(mitigant.id, 'controlProcess', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {controlProcesses.map((process) => (
                              <SelectItem key={process} value={process}>{process}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {mitigant.controlProcess}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        {canEdit && isEditing ? (
                          <Select
                            value={mitigant.lob}
                            onValueChange={(value) => handleUpdateMitigant(mitigant.id, 'lob', value)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {lobOptions.map((lob) => (
                                <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm">{mitigant.lob}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {canEdit && isEditing ? (
                        <Select
                          value={mitigant.effectiveness}
                          onValueChange={(value) => handleUpdateMitigant(mitigant.id, 'effectiveness', value as 'high' | 'medium' | 'low')}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getEffectivenessBadge(mitigant.effectiveness)
                      )}
                    </TableCell>
                    {canEdit && isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMitigant(mitigant.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Control Process Summary */}
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Control Process Summary by LOB</span>
            </h4>
            <Dialog open={showControlProcessDialog} onOpenChange={setShowControlProcessDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Control Processes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Control Process Management</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage the master list of control processes by FLU and risk factor. Only Primary FLU controls are used for auto-population.
                  </p>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {/* Add Control Process Form */}
                  {showAddControlProcess ? (
                    <Card className="border-dashed border-2">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Add New Control Process</h4>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowAddControlProcess(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Process Name</Label>
                              <Input
                                value={newControlProcess.name}
                                onChange={(e) => setNewControlProcess({...newControlProcess, name: e.target.value})}
                                placeholder="Enter control process name..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>FLU</Label>
                              <Select
                                value={newControlProcess.flu}
                                onValueChange={(value) => setNewControlProcess({...newControlProcess, flu: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select FLU" />
                                </SelectTrigger>
                                <SelectContent>
                                  {lobOptions.map((lob) => (
                                    <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Risk Factor</Label>
                            <Input
                              value={newControlProcess.riskFactor}
                              onChange={(e) => setNewControlProcess({...newControlProcess, riskFactor: e.target.value})}
                              placeholder="Enter risk factor..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={newControlProcess.description}
                              onChange={(e) => setNewControlProcess({...newControlProcess, description: e.target.value})}
                              placeholder="Enter description..."
                              rows={3}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={newControlProcess.isPrimary}
                              onCheckedChange={(value) => setNewControlProcess({...newControlProcess, isPrimary: value})}
                            />
                            <Label>Primary FLU Control (used for auto-population)</Label>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={() => {
                              if (newControlProcess.name && newControlProcess.flu && newControlProcess.riskFactor) {
                                const process: ControlProcess = {
                                  id: Date.now().toString(),
                                  name: newControlProcess.name!,
                                  flu: newControlProcess.flu!,
                                  riskFactor: newControlProcess.riskFactor!,
                                  description: newControlProcess.description || "",
                                  isPrimary: newControlProcess.isPrimary || false
                                };
                                setControlProcessList([...controlProcessList, process]);
                                setNewControlProcess({name: "", flu: "", riskFactor: "", description: "", isPrimary: false});
                                setShowAddControlProcess(false);
                              }
                            }}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Process
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddControlProcess(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button variant="outline" onClick={() => setShowAddControlProcess(true)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Control Process
                    </Button>
                  )}

                  {/* Control Processes Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Process Name</TableHead>
                          <TableHead>FLU</TableHead>
                          <TableHead>Risk Factor</TableHead>
                          <TableHead>Primary</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {controlProcessList.map((process) => (
                          <TableRow key={process.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{process.name}</p>
                                {process.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{process.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Building className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{process.flu}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{process.riskFactor}</TableCell>
                            <TableCell>
                              {process.isPrimary ? (
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Primary
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Secondary</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setControlProcessList(controlProcessList.filter(p => p.id !== process.id))}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lobOptions.filter(lob => mitigants.some(m => m.lob === lob)).map((lob) => {
              const lobMitigants = mitigants.filter(m => m.lob === lob);
              const highEffectiveness = lobMitigants.filter(m => m.effectiveness === 'high').length;
              const mediumEffectiveness = lobMitigants.filter(m => m.effectiveness === 'medium').length;
              const lowEffectiveness = lobMitigants.filter(m => m.effectiveness === 'low').length;
              
              return (
                <Card key={lob} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="font-medium">{lob}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Controls</span>
                        <Badge variant="outline">{lobMitigants.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>High Effectiveness</span>
                        <Badge variant="secondary" className="text-green-700 bg-green-100">{highEffectiveness}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Medium Effectiveness</span>
                        <Badge variant="outline" className="text-orange-700 bg-orange-100">{mediumEffectiveness}</Badge>
                      </div>
                      {lowEffectiveness > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Low Effectiveness</span>
                          <Badge variant="destructive">{lowEffectiveness}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Approval Workflow Alert - Shows when HRS Analyst makes changes */}
        {showApprovalAlert && userRole === 'hra-analyst' && (
          <Alert className="border-orange-300 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm">
              Changes to Risk Mitigants have been made. This case will be routed to <strong>HRS Manager</strong> for approval upon saving.
            </AlertDescription>
          </Alert>
       )}


    </div>
  );
}