import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronRight, CheckCircle2, Briefcase } from "lucide-react";

interface NAICSChange {
  changeId: string;
  changeType: string;
  detected: boolean;
  details?: string;
  subItems?: {
    description: string;
    value: string;
    status?: 'met' | 'not-met';
  }[];
}

interface NAICSChangesDetailsProps {
  hasChanges: boolean;
}

export function NAICSChangesDetails({ hasChanges }: NAICSChangesDetailsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Mock data based on the requirements
  const naicsChanges: NAICSChange[] = [
    {
      changeId: "client-risk",
      changeType: "Client Risk Status",
      detected: true,
      details: "Verifying client risk classification",
      subItems: [
        { 
          description: "The client is High Risk", 
          value: "Yes - Client classified as High Risk", 
          status: 'met' 
        }
      ]
    },
    {
      changeId: "refresh-status",
      changeType: "Refresh Completion Status",
      detected: true,
      details: "Verifying completion of Expansion Maintenance/Refresh process",
      subItems: [
        { 
          description: "Has a completed Expansion Maintenance/Refresh", 
          value: "Yes - Completed on 03/15/2024", 
          status: 'met' 
        },
        { 
          description: "Date of Completion", 
          value: "March 15, 2024", 
          status: 'met' 
        },
        { 
          description: "System of Record", 
          value: "CRR System", 
          status: 'met' 
        }
      ]
    },
    {
      changeId: "client-type",
      changeType: "Client Type Verification",
      detected: true,
      details: "Determining if client is Entity or Individual",
      subItems: [
        { 
          description: "Client is Entity or Individual", 
          value: "Entity - Corporate Client", 
          status: 'met' 
        },
        { 
          description: "Client Type", 
          value: "Legal Entity (Corporation)", 
          status: 'met' 
        }
      ]
    },
    {
      changeId: "naics-change",
      changeType: "Change in NAICS Code at Industry/Overall Sector Level",
      detected: true,
      details: "Detecting changes in the North American Industry Classification System (NAICS) code at the industry or overall sector level",
      subItems: [
        { 
          description: "INDUSTRY_SECTOR_CURRENT", 
          value: "523 - Securities, Commodity Contracts, and Other Financial Investments and Related Activities", 
          status: 'met' 
        },
        { 
          description: "INDUSTRY_SECTOR_PREVIOUS", 
          value: "541 - Professional, Scientific, and Technical Services", 
          status: 'met' 
        },
        { 
          description: "Sector Level Change", 
          value: "Yes - Changed from Sector 541 to Sector 523", 
          status: 'met' 
        },
        { 
          description: "Industry Classification", 
          value: "Previous: Professional Services → Current: Financial Services", 
          status: 'met' 
        },
        { 
          description: "Change Date", 
          value: "January 10, 2024", 
          status: 'met' 
        },
        { 
          description: "Reason for Change", 
          value: "Business expansion into cryptocurrency trading and digital asset management services", 
          status: 'met' 
        }
      ]
    },
    {
      changeId: "change-count",
      changeType: "Number of Changes",
      detected: true,
      details: "Total number of NAICS code changes at industry/sector level",
      subItems: [
        { 
          description: "Number of Changes", 
          value: "1 change detected", 
          status: 'met' 
        },
        { 
          description: "Threshold Requirement", 
          value: "≥ 1 change (Threshold Met)", 
          status: 'met' 
        },
        { 
          description: "Net Total of All Changes", 
          value: "1 NAICS sector-level change in the last 3 years", 
          status: 'met' 
        }
      ]
    }
  ];

  const totalChanges = naicsChanges.filter(c => c.detected).length;

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            NAICS Changes Detection Logic
          </span>
        </div>
        <Badge variant={hasChanges ? "destructive" : "secondary"}>
          {hasChanges ? "Changes Detected" : "No Changes"}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground px-1">
        In the last three years, have there been any frequent or material changes to nature of business (NAICS)? The system evaluates the following criteria:
      </p>

      <div className="space-y-2">
        {naicsChanges.map((change) => (
          <Card 
            key={change.changeId} 
            className={`border ${
              change.detected 
                ? 'border-orange-300 bg-orange-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <CardContent className="p-0">
              <button
                onClick={() => toggleItem(change.changeId)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {expandedItems.has(change.changeId) ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {change.changeType}
                      </span>
                    </div>
                    {!expandedItems.has(change.changeId) && change.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {change.details.length > 80 ? `${change.details.substring(0, 80)}...` : change.details}
                      </p>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={change.detected ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {change.detected ? "Criteria Met" : "Not Met"}
                </Badge>
              </button>

              {expandedItems.has(change.changeId) && (
                <div className="px-4 pb-4 pt-2 border-t bg-white">
                  {change.details && (
                    <p className="text-sm text-gray-700 mb-3">
                      {change.details}
                    </p>
                  )}
                  {change.subItems && (
                    <div className="space-y-3">
                      {change.subItems.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2 p-2 rounded bg-gray-50">
                          <div className="mt-0.5">
                            {item.status === 'met' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conclusion */}
      <div className={`p-4 rounded-lg border ${
        hasChanges 
          ? 'bg-teal-50 border-teal-300' 
          : 'bg-green-50 border-green-300'
      }`}>
        <div className="flex items-start space-x-2">
          <CheckCircle2 className={`h-5 w-5 mt-0.5 ${
            hasChanges ? 'text-teal-600' : 'text-green-600'
          }`} />
          <div>
            <p className="font-medium text-sm">
              {hasChanges ? "Conclusion: Yes" : "Conclusion: No"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {hasChanges 
                ? "Based on the detected NAICS code changes above (Number of Changes ≥ 1 at industry/sector level), this question is answered as 'Yes' - there have been frequent or material changes to nature of business (NAICS) in the last 3 years."
                : "Based on the evaluation above, this question is answered as 'No' - there have not been frequent or material changes to nature of business (NAICS) in the last 3 years."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}