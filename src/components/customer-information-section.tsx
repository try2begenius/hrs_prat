import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  User,
  Building,
  MapPin,
  Calendar,
  Shield,
  FileText,
  AlertTriangle
} from "lucide-react";

interface CustomerInformationSectionProps {
  caseData: any;
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  canEdit: boolean;
  onDataChange: () => void;
}

export function CustomerInformationSection({ 
  caseData, 
  userRole, 
  canEdit, 
  onDataChange 
}: CustomerInformationSectionProps) {
  // Mock customer data with override from caseData when available
  const customerInfo = {
    legalName: caseData?.clientName || "Global Dynamics Corporation",
    gci: caseData?.customerId || "GCI123456789",
    pid: caseData?.clientId || "PID987654321", 
    coper: "COP456789123",
    entityType: caseData?.clientType === 'Individual' ? 'Individual' : 'Corporation',
    entityTypeDetails: caseData?.clientType === 'Individual' ? 'Individual Client' : 'C-Corporation',
    primaryFlu: caseData?.lob || "Investment Banking",
    additionalFlus: ["Wealth Management", "Global Markets"],
    bookingJurisdictions: caseData?.jurisdiction ? [caseData.jurisdiction] : ["United States", "United Kingdom", "Singapore"],
    isRegulated: true,
    regulator: "Securities and Exchange Commission (SEC)",
    systemOfRecord: "AWARE/Cesium",
    mostRecentRefreshDate: "2024-06-01",
    mostRecentRiskRating: caseData?.riskRating || "High",
    previousRefreshDate: "2024-03-01", 
    previousRiskRating: "Medium",
    hraCaseAnalyst: caseData?.assignedAnalyst || "Sarah Johnson",
    hraCaseCreationDate: caseData?.creationDate || "2024-06-15",
    hraCaseCompletionDate: caseData?.completionDate || null,
    hraCaseType: caseData?.status === 'manual-review' ? "Manual Review" : "Standard Review"
  };

  const InfoField = ({ 
    label, 
    value, 
    icon: Icon, 
    type = "text" 
  }: { 
    label: string; 
    value: any; 
    icon?: any; 
    type?: string; 
  }) => (
    <div className="space-y-0.5">
      <div className="flex items-center space-x-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      </div>
      <div className="pl-5">
        {type === "badge-list" && Array.isArray(value) ? (
          <div className="flex flex-wrap gap-0.5">
            {value.map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs py-0 px-1.5 h-5">
                {item}
              </Badge>
            ))}
          </div>
        ) : type === "boolean" ? (
          <Badge variant={value ? "secondary" : "outline"} className="text-xs py-0 px-1.5 h-5">
            {value ? "Yes" : "No"}
          </Badge>
        ) : type === "date" ? (
          <p className="text-sm font-medium">
            {value ? new Date(value).toLocaleDateString() : "Not completed"}
          </p>
        ) : type === "risk-rating" ? (
          <Badge 
            variant={value === "High" ? "destructive" : value === "Medium" ? "outline" : "secondary"}
            className="text-xs py-0 px-1.5 h-5 font-medium"
          >
            {value}
          </Badge>
        ) : (
          <p className="text-sm font-medium">{value || "Not specified"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-card">
        {/* Basic Customer Details */}
        <div>
          <h4 className="text-sm font-medium mb-2">

          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <InfoField 
              label="Legal Name" 
              value={customerInfo.legalName}
              icon={Building}
            />
            <InfoField 
              label="Entity or Individual" 
              value={customerInfo.entityType}
              icon={User}
            />
            <InfoField 
              label="Entity Type" 
              value={customerInfo.entityTypeDetails}
              icon={FileText}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Customer Identifiers */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center space-x-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>Customer Identifiers</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <InfoField 
              label="GCI (Global Customer Identifier)" 
              value={customerInfo.gci}
            />
            <InfoField 
              label="Party ID" 
              value={customerInfo.pid}
            />
            <InfoField 
              label="COPER (Corporate Identifier)" 
              value={customerInfo.coper}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Business Units and Geography */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center space-x-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>Business Units & Geography</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <InfoField 
              label="Primary FLU (for this refresh)" 
              value={customerInfo.primaryFlu}
              icon={Building}
            />
            <InfoField 
              label="Additional FLUs" 
              value={customerInfo.additionalFlus}
              type="badge-list"
            />
            <InfoField 
              label="Booking Jurisdictions" 
              value={customerInfo.bookingJurisdictions}
              type="badge-list"
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Refresh Information */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Refresh Information</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <InfoField 
              label="Most Recent Refresh Date" 
              value={customerInfo.mostRecentRefreshDate}
              type="date"
              icon={Calendar}
            />
            <InfoField 
              label="Previous Refresh Date" 
              value={customerInfo.previousRefreshDate}
              type="date"
              icon={Calendar}
            />
            <InfoField 
              label="System of Record" 
              value={customerInfo.systemOfRecord}
              icon={FileText}
            />
            <InfoField 
              label="Risk Rating (Most Recent)" 
              value={customerInfo.mostRecentRiskRating}
              type="risk-rating"
              icon={AlertTriangle}
            />
            <InfoField 
              label="Risk Rating (Previous)" 
              value={customerInfo.previousRiskRating}
              type="risk-rating"
              icon={AlertTriangle}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* HRS Case Information */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center space-x-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>HRS Case Information</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <InfoField 
              label="HRS Case Analyst" 
              value={customerInfo.hraCaseAnalyst}
              icon={User}
              iconColor="text-purple-600"
            />
            <InfoField 
              label="HRS Case Creation Date" 
              value={customerInfo.hraCaseCreationDate}
              type="date"
              icon={Calendar}
              iconColor="text-purple-600"
            />
            <InfoField 
              label="HRS Case Completion Date" 
              value={customerInfo.hraCaseCompletionDate}
              type="date"
              icon={Calendar}
              iconColor="text-purple-600"
            />
            <InfoField 
              label="HRS Case Type" 
              value={customerInfo.hraCaseType}
              icon={FileText}
              iconColor="text-purple-600"
            />
          </div>
        </div>


    </div>
  );
}