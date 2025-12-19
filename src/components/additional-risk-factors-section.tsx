import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { OwnershipChangesDetails } from "./ownership-changes-details";
import { AddressChangesDetails } from "./address-changes-details";
import { NAICSChangesDetails } from "./naics-changes-details";
import { SourceFundsChangesDetails } from "./source-funds-changes-details";
import { 
  FileText,
  AlertTriangle,
  Users,
  Calendar,
  Building,
  DollarSign,
  MapPin,
  Shield,
  Edit,
  Save,
  TrendingUp,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface AdditionalRiskFactorsSectionProps {
  caseData: any;
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  canEdit: boolean;
  onDataChange: () => void;
}

export function AdditionalRiskFactorsSection({ 
  caseData, 
  userRole, 
  canEdit, 
  onDataChange 
}: AdditionalRiskFactorsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOwnershipDetails, setShowOwnershipDetails] = useState(false);
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [showNAICSDetails, setShowNAICSDetails] = useState(false);
  const [showSourceFundsDetails, setShowSourceFundsDetails] = useState(false);
  
  // CAM Section State
  const [camData, setCamData] = useState({
    hadBreaches: true,
    caseStatus: "Resolved - No Action Required",
    trmsFiledeDate: true,
    summaryNarrative: "Latest CAM cycle identified increased transaction volumes in cryptocurrency-related activities. All transactions were within expected parameters for client profile. No suspicious activity detected."
  });

  // TRMS Section State
  const [trmsData, setTrmsData] = useState({
    hadTrmsReferrals: false,
    referralTypes: []
  });

  // Client Escalation State
  const [escalationData, setEscalationData] = useState({
    hadEscalations: true,
    escalationDescription: "Client requested approval for cryptocurrency trading activities exceeding normal thresholds. Escalated to Client Escalation Committee in Q1 2024. Approved with enhanced monitoring requirements."
  });

  // Key Attributes Changes State
  const [attributeChanges, setAttributeChanges] = useState({
    ownershipChanges: true, // Set to true to demonstrate the ownership changes detection logic
    addressChanges: true,
    businessChanges: false,
    incomeSourceChanges: false
  });

  const handleSave = () => {
    setIsEditing(false);
    onDataChange();
  };

  const YesNoField = ({ 
    label, 
    value, 
    onChange, 
    disabled = false 
  }: { 
    label: string; 
    value: boolean; 
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }) => (
    <div className="flex items-center justify-between">
      <Label className="text-sm flex-1">{label}</Label>
      <span className={`text-sm font-medium px-3 py-1 rounded-md ${
        value 
          ? 'text-green-700 bg-green-100' 
          : 'text-gray-600 bg-gray-100'
      }`}>
        {value ? "Yes" : "No"}
      </span>
    </div>
  );

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
          Additional risk factors that contribute to the overall AML risk profile but do not directly impact the risk score.
        </p>
        {!canEdit && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
            Additional Risk Factors are system-generated from various monitoring systems and cannot be manually edited.
          </p>
        )}
      </div>
        
        {/* Client Activity Monitoring (CAM) */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Client Activity Monitoring (CAM)</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <YesNoField 
                label="Did the most recent CAM case identify breaches in expected activity?"
                value={camData.hadBreaches}
                onChange={(value) => setCamData({...camData, hadBreaches: value})}
                disabled={!canEdit}
              />
              
              {camData.hadBreaches && (
                <div className="space-y-2">
                  <Label htmlFor="cam-status">Case Disposition Status</Label>
                  <Select 
                    value={camData.caseStatus} 
                    onValueChange={(value) => setCamData({...camData, caseStatus: value})}
                    disabled={!canEdit || !isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Resolved - No Action Required">Resolved - No Action Required</SelectItem>
                      <SelectItem value="Resolved - Enhanced Monitoring">Resolved - Enhanced Monitoring</SelectItem>
                      <SelectItem value="Escalated to FLU AML">Escalated to FLU AML</SelectItem>
                      <SelectItem value="TRMS Filed">TRMS Filed</SelectItem>
                      <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <YesNoField 
                label="Was a TRMS filed as part of the most recent CAM cycle?"
                value={camData.trmsFiledeDate}
                onChange={(value) => setCamData({...camData, trmsFiledeDate: value})}
                disabled={!canEdit}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cam-narrative">CAM Summary Narrative</Label>
            <Textarea
              id="cam-narrative"
              value={camData.summaryNarrative}
              onChange={(e) => setCamData({...camData, summaryNarrative: e.target.value})}
              disabled={!canEdit || !isEditing}
              rows={3}
              placeholder="Enter CAM summary narrative from CAM tool..."
            />
          </div>
        </div>

        <Separator />

        {/* TRMS Referrals */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>TRMS Referrals</span>
          </h4>
          
          <YesNoField 
            label="Since the last refresh, were any TRMS filed related to Financial Crimes (excluding CAM referrals)?"
            value={trmsData.hadTrmsReferrals}
            onChange={(value) => setTrmsData({...trmsData, hadTrmsReferrals: value})}
            disabled={!canEdit}
          />
          
          {trmsData.hadTrmsReferrals && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>If yes, how many and what types?</Label>
                <div className="space-y-2">
                  {trmsData.referralTypes.map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{referral.type}</span>
                      <Badge variant="outline">{referral.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Client Escalation */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Client Escalation</span>
          </h4>
          
          <YesNoField 
            label="Since the last refresh, were there any client behaviors or activities that required escalation to Client Escalation Committees?"
            value={escalationData.hadEscalations}
            onChange={(value) => setEscalationData({...escalationData, hadEscalations: value})}
            disabled={!canEdit}
          />
          
          {escalationData.hadEscalations && (
            <div className="space-y-2">
              <Label htmlFor="escalation-description">Escalation Description</Label>
              <Textarea
                id="escalation-description"
                value={escalationData.escalationDescription}
                onChange={(e) => setEscalationData({...escalationData, escalationDescription: e.target.value})}
                disabled={!canEdit || !isEditing}
                rows={3}
                placeholder="Describe the client behaviors or activities that required escalation..."
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Changes in Key Attributes */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Changes in Key Attributes (Last 3 Years)</span>
          </h4>
          
          {/* Question 1: Ownership Changes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <span className="font-medium text-blue-600 mt-1">1.</span>
                <div className="flex-1">
                  <YesNoField 
                    label="Have there been any frequent or material changes to ownership?"
                    value={attributeChanges.ownershipChanges}
                    onChange={(value) => setAttributeChanges({...attributeChanges, ownershipChanges: value})}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowOwnershipDetails(!showOwnershipDetails)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 whitespace-nowrap"
              >
                {showOwnershipDetails ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Hide Detection Logic
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Detection Logic
                  </>
                )}
              </Button>
            </div>
            
            {/* Expandable Ownership Changes Details */}
            {showOwnershipDetails && (
              <OwnershipChangesDetails hasChanges={attributeChanges.ownershipChanges} />
            )}
          </div>

          {/* Question 2: Address Changes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <span className="font-medium text-blue-600 mt-1">2.</span>
                <div className="flex-1">
                  <YesNoField 
                    label="Have there been any frequent or material changes to address country?"
                    value={attributeChanges.addressChanges}
                    onChange={(value) => setAttributeChanges({...attributeChanges, addressChanges: value})}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddressDetails(!showAddressDetails)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 whitespace-nowrap"
              >
                {showAddressDetails ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Hide Detection Logic
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Detection Logic
                  </>
                )}
              </Button>
            </div>
            
            {/* Expandable Address Changes Details */}
            {showAddressDetails && (
              <AddressChangesDetails hasChanges={attributeChanges.addressChanges} />
            )}
          </div>
          
          {/* Question 3: NAICS Changes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <span className="font-medium text-blue-600 mt-1">3.</span>
                <div className="flex-1">
                  <YesNoField 
                    label="Have there been any frequent or material changes to nature of business (NAICS)?"
                    value={attributeChanges.businessChanges}
                    onChange={(value) => setAttributeChanges({...attributeChanges, businessChanges: value})}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNAICSDetails(!showNAICSDetails)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 whitespace-nowrap"
              >
                {showNAICSDetails ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Hide Detection Logic
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Detection Logic
                  </>
                )}
              </Button>
            </div>
            
            {/* Expandable NAICS Changes Details */}
            {showNAICSDetails && (
              <NAICSChangesDetails hasChanges={attributeChanges.businessChanges} />
            )}
          </div>
          
          {/* Question 4: Source of Funds/Wealth Changes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <span className="font-medium text-blue-600 mt-1">4.</span>
                <div className="flex-1">
                  <YesNoField 
                    label="Have there been any frequent or material changes to source of funds/wealth vs. income/wealth?"
                    value={attributeChanges.incomeSourceChanges}
                    onChange={(value) => setAttributeChanges({...attributeChanges, incomeSourceChanges: value})}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSourceFundsDetails(!showSourceFundsDetails)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 whitespace-nowrap"
              >
                {showSourceFundsDetails ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Hide Detection Logic
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Detection Logic
                  </>
                )}
              </Button>
            </div>
            
            {/* Expandable Source Funds Changes Details */}
            {showSourceFundsDetails && (
              <SourceFundsChangesDetails hasChanges={attributeChanges.incomeSourceChanges} />
            )}
          </div>
        </div>

        {/* Risk Factor Summary */}
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Additional Risk Factors Summary</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`border ${camData.hadBreaches ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="font-medium text-sm">CAM Issues</span>
                </div>
                <Badge variant={camData.hadBreaches ? "destructive" : "secondary"} className="text-xs">
                  {camData.hadBreaches ? "Issues Identified" : "No Issues"}
                </Badge>
              </CardContent>
            </Card>

            <Card className={`border ${trmsData.hadTrmsReferrals ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium text-sm">TRMS Referrals</span>
                </div>
                <Badge variant={trmsData.hadTrmsReferrals ? "destructive" : "secondary"} className="text-xs">
                  {trmsData.hadTrmsReferrals ? `${trmsData.referralTypes.reduce((total, ref) => total + ref.count, 0)} Referrals` : "No Referrals"}
                </Badge>
              </CardContent>
            </Card>

            <Card className={`border ${escalationData.hadEscalations ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium text-sm">Escalations</span>
                </div>
                <Badge variant={escalationData.hadEscalations ? "destructive" : "secondary"} className="text-xs">
                  {escalationData.hadEscalations ? "Escalations Present" : "No Escalations"}
                </Badge>
              </CardContent>
            </Card>

            <Card className={`border ${Object.values(attributeChanges).some(v => v) ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-sm">Key Changes</span>
                </div>
                <Badge variant={Object.values(attributeChanges).some(v => v) ? "destructive" : "secondary"} className="text-xs">
                  {Object.values(attributeChanges).some(v => v) ? "Changes Detected" : "No Changes"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>


    </div>
  );
}