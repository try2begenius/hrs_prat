import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Alert, AlertDescription } from "./ui/alert";
import { Switch } from "./ui/switch";
import { CalendarIcon, AlertTriangle, Plus, X, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface EscalationEntry {
  id: string;
  legalName: string;
  clientIdentifier: string;
  identifierType: string;
  flu: string;
  escalationDate: Date;
  status: string;
  escalationDescription?: string;
  clientEscalation: boolean;
}

export function ClientEscalationForm() {
  const [formData, setFormData] = useState({
    legalName: "",
    clientIdentifier: "",
    identifierType: "GCI",
    flu: "",
    escalationDate: new Date(),
    escalationDescription: "",
    clientEscalation: true
  });

  const [escalations, setEscalations] = useState<EscalationEntry[]>([
    {
      id: "ESC-001",
      legalName: "Global Investment Holdings LLC",
      clientIdentifier: "GCI-789456123",
      identifierType: "GCI",
      flu: "New York",
      escalationDate: new Date("2024-01-15"),
      status: "In Review",
      escalationDescription: "Complex ownership structure requiring manual review",
      clientEscalation: true
    },
    {
      id: "ESC-002",
      legalName: "International Trade Corp",
      clientIdentifier: "COP-456789321",
      identifierType: "Coper ID",
      flu: "London",
      escalationDate: new Date("2024-01-18"),
      status: "Completed",
      escalationDescription: "High-value transactions with multiple jurisdictions",
      clientEscalation: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newEscalation: EscalationEntry = {
        id: `ESC-${String(escalations.length + 1).padStart(3, '0')}`,
        legalName: formData.legalName,
        clientIdentifier: formData.clientIdentifier,
        identifierType: formData.identifierType,
        flu: formData.flu,
        escalationDate: formData.escalationDate,
        status: "Pending",
        escalationDescription: formData.escalationDescription,
        clientEscalation: formData.clientEscalation
      };
      
      setEscalations([newEscalation, ...escalations]);
      setFormData({
        legalName: "",
        clientIdentifier: "",
        identifierType: "GCI",
        flu: "",
        escalationDate: new Date(),
        escalationDescription: "",
        clientEscalation: true
      });
      setShowForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "In Review": return "secondary";
      case "Pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600";
      case "In Review": return "text-blue-600";
      case "Pending": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Client Escalation Management</span>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                New Escalation
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Client escalations trigger manual case reviews and require immediate attention from compliance teams.
          </AlertDescription>
        </Alert>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Create New Escalation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Legal Name *</Label>
                    <Input
                      id="legalName"
                      value={formData.legalName}
                      onChange={(e) => setFormData({...formData, legalName: e.target.value})}
                      placeholder="Enter client legal name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="flu">FLU *</Label>
                    <Select value={formData.flu} onValueChange={(value) => setFormData({...formData, flu: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select FLU" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="London">London</SelectItem>
                        <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                        <SelectItem value="Tokyo">Tokyo</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="Zurich">Zurich</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifierType">Client Identifier Type *</Label>
                    <Select value={formData.identifierType} onValueChange={(value) => setFormData({...formData, identifierType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GCI">GCI</SelectItem>
                        <SelectItem value="Coper ID">Coper ID</SelectItem>
                        <SelectItem value="Party ID">Party ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientIdentifier">Client Identifier *</Label>
                    <Input
                      id="clientIdentifier"
                      value={formData.clientIdentifier}
                      onChange={(e) => setFormData({...formData, clientIdentifier: e.target.value})}
                      placeholder={`Enter ${formData.identifierType} identifier`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Escalation *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.escalationDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.escalationDate}
                          onSelect={(date) => date && setFormData({...formData, escalationDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientEscalation">Client Escalation</Label>
                    <div className="flex items-center space-x-3 h-10 px-3 border rounded-md bg-blue-50 border-blue-200">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">YES</span>
                      <span className="text-xs text-blue-700">(Manual case review triggered)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">This will mark Section 3 Client Escalation question as Yes in the HRS tool</p>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Automatic Integration:</strong> When a client is added to this escalation list, the system will automatically complete the "Client Escalation" question in Section 3 of the HRS assessment as "Yes", triggering the manual review workflow.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="escalationDescription">Escalation Description</Label>
                  <Textarea
                    id="escalationDescription"
                    value={formData.escalationDescription}
                    onChange={(e) => setFormData({...formData, escalationDescription: e.target.value})}
                    placeholder="Enter escalation description and context for this case review"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Provide detailed context for the manual case review requirement</p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Escalation"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Escalations</h3>
          {escalations.map((escalation, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-mono">{escalation.id}</Badge>
                  <Badge variant={getStatusBadgeVariant(escalation.status)} className={getStatusColor(escalation.status)}>
                    {escalation.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(escalation.escalationDate, "MMM dd, yyyy")}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Legal Name</p>
                  <p className="font-medium">{escalation.legalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client Identifier</p>
                  <p className="font-mono text-sm">{escalation.clientIdentifier}</p>
                  <Badge variant="outline" className="text-xs mt-1">{escalation.identifierType}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">FLU</p>
                  <p className="font-medium">{escalation.flu}</p>
                </div>
              </div>
              
              {escalation.escalationDescription && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm">{escalation.escalationDescription}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}