import { useState, useMemo } from "react";
import { toast } from "sonner@2.0.3";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CustomerInformationSection } from "./customer-information-section";
import { CrrRiskFactorsSection } from "./crr-risk-factors-section";
import { AdditionalRiskFactorsSection } from "./additional-risk-factors-section";
import { RiskMitigantsSection } from "./risk-mitigants-section";
import { RiskSummarySection } from "./risk-summary-section";
import { 
  Shield, 
  User, 
  AlertTriangle,
  Users,
  FileText,
  CheckCircle,
  Building,
  Clock,
  Save,
  Search,
  X,
  ArrowLeft
} from "lucide-react";

interface RiskAssessmentPageProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  selectedCaseData?: any;
  onNavigateBack?: () => void;
}

export function RiskAssessmentPage({ userRole, selectedCaseData, onNavigateBack }: RiskAssessmentPageProps) {
  const [selectedCaseId, setSelectedCaseId] = useState(selectedCaseData?.caseId || "HRA-2024-0601");
  const [isDirty, setIsDirty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("COMP-001");

  // Mock companies data
  const companies: Company[] = [
    {
      id: "COMP-001",
      legalName: "Global Dynamics Corporation",
      customerId: "GDC-789456123",
      businessType: "Investment Management",
      domicile: "Cayman Islands",
      riskRating: "High",
      relationshipManager: "Michael Chen",
      assets: "$2.5B",
      industryCode: "523920"
    },
    {
      id: "COMP-002", 
      legalName: "Oceanic Holdings Limited",
      customerId: "OHL-456789012",
      businessType: "Hedge Fund",
      domicile: "British Virgin Islands",
      riskRating: "High",
      relationshipManager: "Sarah Williams",
      assets: "$1.8B",
      industryCode: "523920"
    },
    {
      id: "COMP-003",
      legalName: "Alpine Investment Partners LLC",
      customerId: "AIP-321654987",
      businessType: "Private Equity",
      domicile: "Delaware, USA",
      riskRating: "Medium",
      relationshipManager: "David Rodriguez",
      assets: "$950M",
      industryCode: "523910"
    },
    {
      id: "COMP-004",
      legalName: "Meridian Capital Management Inc.",
      customerId: "MCM-654321789",
      businessType: "Asset Management",
      domicile: "Bermuda",
      riskRating: "High",
      relationshipManager: "Jennifer Lee",
      assets: "$3.2B",
      industryCode: "523920"
    },
    {
      id: "COMP-005",
      legalName: "Phoenix Trading Solutions Ltd.",
      customerId: "PTS-987123456",
      businessType: "Proprietary Trading",
      domicile: "Cayman Islands",
      riskRating: "Medium",
      relationshipManager: "Robert Kim",
      assets: "$750M",
      industryCode: "523130"
    }
  ];

  // Mock current user data
  const currentUser = {
    name: "Sarah Johnson",
    role: userRole,
    roleDisplay: {
      'hra-analyst': 'HRA Analyst',
      'hra-manager': 'HRA Manager', 
      'flu-aml': 'FLU AML Representative',
      'gfc': 'GFC Representative'
    }[userRole],
    lob: "Investment Banking"
  };

  // Get selected company
  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  // Filter companies based on search query
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    
    const query = searchQuery.toLowerCase();
    return companies.filter(company => 
      company.legalName.toLowerCase().includes(query) ||
      company.customerId.toLowerCase().includes(query) ||
      company.businessType.toLowerCase().includes(query)
    );
  }, [searchQuery, companies]);

  // Mock case data based on selected company OR from workbasket navigation
  const caseData = selectedCaseData ? {
    caseId: selectedCaseData.caseId,
    clientName: selectedCaseData.clientName,
    clientType: selectedCaseData.clientType,
    status: selectedCaseData.status,
    priority: selectedCaseData.priority,
    riskRating: selectedCaseData.riskRating,
    dueDate: selectedCaseData.dueDate,
    assignedAnalyst: selectedCaseData.assignedAnalyst,
    creationDate: selectedCaseData.createdDate,
    completionDate: selectedCaseData.completedDate || null,
    customerId: selectedCaseData.clientId,
    relationshipManager: "Michael Chen", // Would come from backend
    assets: "$2.5B", // Would come from backend
    jurisdiction: selectedCaseData.jurisdiction,
    lob: selectedCaseData.lob
  } : {
    caseId: selectedCaseId,
    clientName: selectedCompany.legalName,
    clientType: "Corporate",
    status: "In Review",
    priority: selectedCompany.riskRating === "High" ? "High" : "Medium",
    riskRating: selectedCompany.riskRating,
    dueDate: "2024-06-30",
    assignedAnalyst: "Sarah Johnson",
    creationDate: "2024-06-15",
    completionDate: null,
    customerId: selectedCompany.customerId,
    relationshipManager: selectedCompany.relationshipManager,
    assets: selectedCompany.assets
  };

  const handleSaveAssessment = () => {
    toast.success("Risk assessment saved successfully");
    setIsDirty(false);
  };

  const getAccessLevel = () => {
    if (userRole === 'hrs-analyst' || userRole === 'hrs-manager') {
      return 'edit';
    }
    return 'view'; // FLU AML and View Only have view-only access
  };

  const canEditSection = (section: string) => {
    const accessLevel = getAccessLevel();
    
    switch (section) {
      case 'customer-info':
        return false; // Never editable
      case 'crr-factors':
        return false; // CRR Risk Factors are never editable (system-generated)
      case 'additional-factors':
        return false; // Additional Risk Factors are system-generated and not editable
      case 'risk-mitigants':
        return accessLevel === 'edit';
      case 'risk-summary':
        // Special handling - different fields editable by different roles
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      {onNavigateBack && (
        <Button
          variant="link"
          onClick={onNavigateBack}
          className="p-0 h-auto text-blue-900 hover:text-blue-700 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back to Work Queue
        </Button>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-primary">High Risk Summary Tool</h2>
          <p className="text-muted-foreground">
            Comprehensive risk summary for high-risk clients with role-based access controls
          </p>
        </div>
      </div>

      {/* Company Search */}
      <Card>
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Selected Company & Case Information */}
            <div className="bg-muted/30 rounded-lg p-3">
              {/* Single Row with All Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {caseData.clientType === 'Individual' ? 
                    <User className="h-4 w-4 text-primary" /> : 
                    <Building className="h-4 w-4 text-primary" />
                  }
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{caseData.caseId}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium">{caseData.clientName}</span>
                    <span className="text-xs text-muted-foreground">
                      ({caseData.customerId})
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Risk Rating</p>
                    <Badge variant={caseData.riskRating === 'High' ? 'destructive' : 
                                 caseData.riskRating === 'Medium' ? 'default' : 'secondary'}>
                      {caseData.riskRating}
                    </Badge>
                  </div>
                  {selectedCaseData && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Jurisdiction</p>
                      <p className="font-medium">{caseData.jurisdiction}</p>
                    </div>
                  )}
                  {!selectedCaseData && (
                    <>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Domicile</p>
                        <p className="font-medium">{selectedCompany.domicile}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Assets</p>
                        <p className="font-medium">{selectedCompany.assets}</p>
                      </div>
                    </>
                  )}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">{selectedCaseData ? 'LOB' : 'RM'}</p>
                    <p className="font-medium">{selectedCaseData ? caseData.lob : selectedCompany.relationshipManager}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium">{new Date(caseData.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{caseData.status}</span>
                    </Badge>
                  </div>
                  {isDirty && getAccessLevel() === 'edit' && (
                    <Button onClick={handleSaveAssessment} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-5 gap-3">
            {[
              { id: 'customer-info', label: 'Customer Information', icon: User, status: 'complete' },
              { id: 'crr-factors', label: 'CRR Risk Factors', icon: AlertTriangle, status: 'in-progress' },
              { id: 'additional-factors', label: 'Additional Risk Factors', icon: FileText, status: 'pending' },
              { id: 'risk-mitigants', label: 'Risk Mitigants', icon: Shield, status: 'pending' },
              { id: 'risk-summary', label: 'Risk Summary', icon: CheckCircle, status: 'pending' }
            ].map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="text-center">
                  <div className={`mx-auto p-2 rounded-lg mb-1 h-14 flex flex-col items-center justify-center space-y-1 ${
                    section.status === 'complete' ? 'bg-green-100 text-green-600' :
                    section.status === 'in-progress' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                    <p className="text-xs font-medium text-center leading-tight">{section.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {section.id === 'customer-info' ? '12 attributes' :
                     section.id === 'crr-factors' ? '85% complete' :
                     section.id === 'additional-factors' ? '7 factors' :
                     section.id === 'risk-mitigants' ? '4 controls' :
                     '3.2 risk score'}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Sections */}
      <Accordion type="multiple" defaultValue={[]} className="space-y-3">
        <AccordionItem value="customer-info">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
              <Badge variant="outline" className="ml-2">Read Only</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CustomerInformationSection 
              caseData={caseData}
              userRole={userRole}
              canEdit={canEditSection('customer-info')}
              onDataChange={() => setIsDirty(true)}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="crr-factors">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>CRR Risk Factors</span>
              {canEditSection('crr-factors') ? (
                <Badge variant="default" className="ml-2">Editable</Badge>
              ) : (
                <Badge variant="outline" className="ml-2">Read Only</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CrrRiskFactorsSection 
              caseData={caseData}
              userRole={userRole}
              canEdit={canEditSection('crr-factors')}
              onDataChange={() => setIsDirty(true)}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="additional-factors">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Additional Risk Factors</span>
              {canEditSection('additional-factors') ? (
                <Badge variant="default" className="ml-2">Editable</Badge>
              ) : (
                <Badge variant="outline" className="ml-2">Read Only</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AdditionalRiskFactorsSection 
              caseData={caseData}
              userRole={userRole}
              canEdit={canEditSection('additional-factors')}
              onDataChange={() => setIsDirty(true)}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="risk-mitigants">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Risk Mitigants</span>
              {canEditSection('risk-mitigants') ? (
                <Badge variant="default" className="ml-2">Editable</Badge>
              ) : (
                <Badge variant="outline" className="ml-2">Read Only</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RiskMitigantsSection 
              caseData={caseData}
              userRole={userRole}
              canEdit={canEditSection('risk-mitigants')}
              onDataChange={() => setIsDirty(true)}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="risk-summary">
          <AccordionTrigger className="text-left font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Risk Summary</span>
              {canEditSection('risk-summary') ? (
                <Badge variant="default" className="ml-2">Editable</Badge>
              ) : (
                <Badge variant="outline" className="ml-2">Read Only</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RiskSummarySection 
              caseData={caseData}
              userRole={userRole}
              canEdit={canEditSection('risk-summary')}
              onDataChange={() => setIsDirty(true)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}