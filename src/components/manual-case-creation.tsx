import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { 
  Plus, 
  Search, 
  User, 
  AlertTriangle, 
  CheckCircle,
  Building,
  MapPin,
  Calendar,
  FileText,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ManualReviewIndicator {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

export function ManualCaseCreation() {
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [caseData, setCaseData] = useState({
    priority: "medium",
    assignedAnalyst: "",
    dueDate: "",
    notes: "",
    riskCategory: ""
  });

  const [manualReviewIndicators, setManualReviewIndicators] = useState<ManualReviewIndicator[]>([
    { id: 'gfc', label: 'GFC Intelligence is Yes', description: 'Global Financial Crimes intelligence flagged', checked: false },
    { id: 'cam_trms', label: 'CAM - TRMS raised as part of CAM', description: 'Transaction Risk Management System referral from CAM', checked: false },
    { id: 'trms_fc', label: 'TRMS - Financial Crimes referral', description: 'TRMS referrals for Financial Crimes is Yes', checked: false },
    { id: 'escalation', label: 'Client Escalation Committee completed', description: 'Client escalation committee involvement required', checked: false },
    { id: 'beneficial_ownership', label: 'Beneficial Ownership change', description: 'Changes in beneficial ownership structure', checked: false },
    { id: 'address_change', label: 'Address change', description: 'Significant address or location changes', checked: false },
    { id: 'naics_change', label: 'Nature of Business (NAICS) change', description: 'Changes in business nature or industry classification', checked: false },
    { id: 'income_source', label: 'Source of Income change', description: 'Changes in source of income for individual clients', checked: false },
    { id: 'risk_drivers', label: 'Total risk CRR drivers over 10', description: 'More than 10 total risk factors identified', checked: false },
    { id: 'new_factors', label: 'Count of 5+ new risk factors', description: 'Five or more new risk factors since last refresh', checked: false },
    { id: 'incomplete_info', label: 'Required information not completed', description: 'Missing required data elements', checked: false }
  ]);

  const mockClients = [
    { id: 'CLT001', name: 'Oceanic Holdings Ltd', type: 'Corporate', riskRating: 'High', location: 'Cayman Islands' },
    { id: 'CLT002', name: 'Global Trade Solutions', type: 'Corporate', riskRating: 'Medium', location: 'Singapore' },
    { id: 'CLT003', name: 'Alexander Petrov', type: 'Individual', riskRating: 'High', location: 'Switzerland' },
    { id: 'CLT004', name: 'Sterling Investment Group', type: 'Investment', riskRating: 'High', location: 'Luxembourg' }
  ];

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.id.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleCreateCase = () => {
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    const checkedIndicators = manualReviewIndicators.filter(indicator => indicator.checked);
    
    // Generate case ID
    const caseId = `HRA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    toast.success(`Case ${caseId} created successfully for ${selectedClient.name}`);
    
    // Reset form
    setSelectedClient(null);
    setClientSearch("");
    setCaseData({
      priority: "medium",
      assignedAnalyst: "",
      dueDate: "",
      notes: "",
      riskCategory: ""
    });
    setManualReviewIndicators(prev => prev.map(indicator => ({ ...indicator, checked: false })));
  };

  const toggleIndicator = (id: string) => {
    setManualReviewIndicators(prev => 
      prev.map(indicator => 
        indicator.id === id ? { ...indicator, checked: !indicator.checked } : indicator
      )
    );
  };

  const getRiskRatingStyle = (rating: string) => {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Client Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client-search">Search Client</Label>
              <Input
                id="client-search"
                placeholder="Search by client name or ID..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </div>

            {clientSearch && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedClient?.id === client.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.id} • {client.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getRiskRatingStyle(client.riskRating)}`}
                        >
                          {client.riskRating}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{client.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedClient && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Selected Client</h4>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {selectedClient.type === 'Individual' ? 
                      <User className="h-4 w-4 text-primary" /> : 
                      <Building className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{selectedClient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.id} • {selectedClient.type} • {selectedClient.location}
                    </p>
                  </div>
                  <Badge variant="outline" className={getRiskRatingStyle(selectedClient.riskRating)}>
                    {selectedClient.riskRating} Risk
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Case Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={caseData.priority} onValueChange={(value) => setCaseData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="risk-category">Risk Category</Label>
                <Select value={caseData.riskCategory} onValueChange={(value) => setCaseData(prev => ({ ...prev, riskCategory: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geography">Geographic Risk</SelectItem>
                    <SelectItem value="client-type">Client Type Risk</SelectItem>
                    <SelectItem value="transaction">Transaction Risk</SelectItem>
                    <SelectItem value="regulatory">Regulatory Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="analyst">Assigned Analyst</Label>
              <Select value={caseData.assignedAnalyst} onValueChange={(value) => setCaseData(prev => ({ ...prev, assignedAnalyst: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to analyst" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah.johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="michael.chen">Michael Chen</SelectItem>
                  <SelectItem value="emily.rodriguez">Emily Rodriguez</SelectItem>
                  <SelectItem value="david.kim">David Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={caseData.dueDate}
                onChange={(e) => setCaseData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Initial Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes or observations..."
                value={caseData.notes}
                onChange={(e) => setCaseData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Review Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Manual Review Indicators</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select all factors that trigger manual review for this case
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manualReviewIndicators.map((indicator) => (
              <div key={indicator.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={indicator.id}
                  checked={indicator.checked}
                  onCheckedChange={() => toggleIndicator(indicator.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={indicator.id} className="font-medium cursor-pointer">
                    {indicator.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {indicator.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {manualReviewIndicators.some(indicator => indicator.checked) && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Manual Review Required</span>
              </div>
              <p className="text-sm text-orange-700">
                This case will be flagged for manual review due to the selected indicators.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3">
        <Button variant="outline">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleCreateCase}>
          <Save className="h-4 w-4 mr-2" />
          Create Case
        </Button>
      </div>
    </div>
  );
}
