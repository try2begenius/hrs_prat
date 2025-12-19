import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { 
  AlertTriangle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Info,
  Edit,
  Save,
  X
} from "lucide-react";

interface CrrRiskFactorsSectionProps {
  caseData: any;
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
  canEdit: boolean;
  onDataChange: () => void;
}

interface RiskFactor {
  category: string;
  factor: string;
  value: string;
  impact: 'high' | 'medium' | 'low';
  change?: 'increased' | 'decreased' | 'new' | 'removed' | 'unchanged';
}

export function CrrRiskFactorsSection({ 
  caseData, 
  userRole, 
  canEdit, 
  onDataChange 
}: CrrRiskFactorsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [wasMostRecentDriver, setWasMostRecentDriver] = useState(false);
  const [wasPreviousDriver, setWasPreviousDriver] = useState(false);

  // Mock CRR risk factors data
  const [currentFactors, setCurrentFactors] = useState<RiskFactor[]>([
    { category: "Customer Attributes", factor: "Business Type", value: "Investment Management", impact: "medium", change: "unchanged" },
    { category: "Customer Attributes", factor: "Client Sophistication", value: "Institutional", impact: "low", change: "unchanged" },
    { category: "Geography", factor: "Client Domicile", value: "Cayman Islands", impact: "high", change: "increased" },
    { category: "Geography", factor: "Operational Jurisdiction", value: "United States", impact: "low", change: "unchanged" },
    { category: "Industry", factor: "NAICS Code", value: "523920 - Portfolio Management", impact: "medium", change: "unchanged" },
    { category: "Product", factor: "Prime Brokerage", value: "Active", impact: "high", change: "unchanged" },
    { category: "Product", factor: "Securities Lending", value: "Active", impact: "medium", change: "increased" },
    { category: "Bank Intelligence", factor: "GFC Intelligence", value: "Present", impact: "high", change: "new" },
    { category: "SPF/PEP Status", factor: "Politically Exposed Person", value: "Yes - Foreign", impact: "high", change: "increased" }
  ]);

  const [previousFactors, setPreviousFactors] = useState<RiskFactor[]>([
    { category: "Customer Attributes", factor: "Business Type", value: "Investment Management", impact: "medium" },
    { category: "Customer Attributes", factor: "Client Sophistication", value: "Institutional", impact: "low" },
    { category: "Geography", factor: "Client Domicile", value: "United Kingdom", impact: "medium" },
    { category: "Geography", factor: "Operational Jurisdiction", value: "United States", impact: "low" },
    { category: "Industry", factor: "NAICS Code", value: "523920 - Portfolio Management", impact: "medium" },
    { category: "Product", factor: "Prime Brokerage", value: "Active", impact: "high" },
    { category: "Product", factor: "Securities Lending", value: "Inactive", impact: "low" },
    { category: "Bank Intelligence", factor: "GFC Intelligence", value: "Not Present", impact: "low" },
    { category: "SPF/PEP Status", factor: "Politically Exposed Person", value: "No", impact: "low" }
  ]);

  const refreshDates = {
    mostRecent: "2024-06-01",
    previous: "2024-03-01"
  };

  const getImpactBadge = (impact: string) => {
    const getImpactStyle = () => {
      switch (impact) {
        case 'high':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low':
          return 'bg-green-100 text-green-800 border-green-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };
    
    return (
      <Badge variant="outline" className={`${getImpactStyle()} text-xs`}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)}
      </Badge>
    );
  };

  const getChangeIcon = (change?: string) => {
    switch (change) {
      case 'increased':
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'decreased':
        return <TrendingDown className="h-3 w-3 text-green-500" />;
      case 'new':
        return <span className="text-xs font-medium text-blue-600">NEW</span>;
      case 'removed':
        return <X className="h-3 w-3 text-red-500" />;
      case 'unchanged':
        return <Minus className="h-3 w-3 text-gray-400" />;
      default:
        return null;
    }
  };

  const FactorTable = ({ 
    factors, 
    title, 
    date, 
    showChanges = false,
    editable = false,
    onFactorChange
  }: { 
    factors: RiskFactor[]; 
    title: string; 
    date: string;
    showChanges?: boolean;
    editable?: boolean;
    onFactorChange?: (index: number, field: string, value: string) => void;
  }) => {
    const groupedFactors = factors.reduce((acc, factor) => {
      if (!acc[factor.category]) {
        acc[factor.category] = [];
      }
      acc[factor.category].push(factor);
      return acc;
    }, {} as Record<string, RiskFactor[]>);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{title}</span>
          </h4>
          <Badge variant="outline" className="text-xs">
            {new Date(date).toLocaleDateString()}
          </Badge>
        </div>
        
        {Object.entries(groupedFactors).map(([category, categoryFactors]) => (
          <div key={category} className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-2 border-b">
              <h5 className="font-medium text-sm">{category}</h5>
            </div>
            <div className="divide-y">
              {categoryFactors.map((factor, factorIndex) => {
                const globalIndex = factors.findIndex(f => f.factor === factor.factor && f.category === factor.category);
                return (
                  <div key={factorIndex} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{factor.factor}</p>
                      {editable ? (
                        <Input
                          value={factor.value}
                          onChange={(e) => onFactorChange?.(globalIndex, 'value', e.target.value)}
                          className="mt-1 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{factor.value}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {showChanges && factor.change && (
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(factor.change)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleCurrentFactorChange = (index: number, field: string, value: string) => {
    const newFactors = [...currentFactors];
    newFactors[index] = { ...newFactors[index], [field]: value };
    setCurrentFactors(newFactors);
  };

  const handleSave = () => {
    setIsEditing(false);
    onDataChange();
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
          Risk factors derived from the Global Financial Crimes (GFC) Customer Risk Assessment (CRA) model used to determine Dynamic Risk Rating (DRR) or future state Customer Risk Rating (CRR).
        </p>
      </div>

      {/* CRR Driver Questions */}
      <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3">CRR Driver Assessment</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="most-recent-driver"
              checked={wasMostRecentDriver}
              onCheckedChange={setWasMostRecentDriver}
              disabled={!canEdit || !isEditing}
            />
            <Label 
              htmlFor="most-recent-driver" 
              className="text-sm font-medium text-blue-900 cursor-pointer"
            >
              Was this factor a driver of the CRR in the most recent refresh?
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="previous-driver"
              checked={wasPreviousDriver}
              onCheckedChange={setWasPreviousDriver}
              disabled={!canEdit || !isEditing}
            />
            <Label 
              htmlFor="previous-driver" 
              className="text-sm font-medium text-blue-900 cursor-pointer"
            >
              Was this factor a driver of the CRR in the previous refresh?
            </Label>
          </div>
        </div>
      </div>
        {/* Current and Previous Refresh Factors - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Refresh Factors */}
          <div className="space-y-4">
            <FactorTable 
              factors={currentFactors}
              title="Current Refresh Risk Factors"
              date={refreshDates.mostRecent}
              showChanges={true}
              editable={isEditing && canEdit}
              onFactorChange={handleCurrentFactorChange}
            />
          </div>

          {/* Previous Refresh Factors */}
          <div className="space-y-4">
            <FactorTable 
              factors={previousFactors}
              title="Previous Refresh Risk Factors"
              date={refreshDates.previous}
            />
          </div>
        </div>

        <Separator />

        {/* Risk Factor Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Risk Factor Change Analysis</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Change Analysis</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-amber-900 mb-1">Increased Risk:</p>
                    <div className="space-y-1">
                      <p className="text-sm text-amber-700">• Client Domicile (UK → Cayman Islands)</p>
                      <p className="text-sm text-amber-700">• Securities Lending (Inactive → Active)</p>
                      <p className="text-sm text-amber-700">• PEP Status (No → Yes - Foreign)</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-900 mb-1">Decreased Risk:</p>
                    <p className="text-sm text-amber-700">No factors decreased in risk level since previous refresh.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">New Factors</span>
                </div>
                <p className="text-sm text-blue-700">• GFC Intelligence (newly identified)</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CRR Notes Section */}
        {(canEdit || notes) && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label htmlFor="crr-notes">CRR Risk Factor Analysis Notes</Label>
              <Textarea
                id="crr-notes"
                placeholder="Add notes about the CRR risk factors, changes since previous refresh, and any additional context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!canEdit || !isEditing}
                rows={4}
              />
              {!canEdit && (
                <p className="text-xs text-muted-foreground">
                  CRR Risk Factors are system-generated and cannot be manually edited.
                </p>
              )}
            </div>
          </>
        )}


    </div>
  );
}