import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronRight, CheckCircle2, MapPin } from "lucide-react";

interface AddressChange {
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

interface AddressChangesDetailsProps {
  hasChanges: boolean;
}

export function AddressChangesDetails({ hasChanges }: AddressChangesDetailsProps) {
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
  const addressChanges: AddressChange[] = [
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
      changeId: "entity-addresses",
      changeType: "Client - Entity, Address Changes",
      detected: true,
      details: "Changes detected in entity addresses From/To for all address changes",
      subItems: [
        { 
          description: "a. Country of Legal Formation (stored in Country of Incorporation field in Cesium)", 
          value: "From: United States (Standard) → To: United States (Standard) - No Change",
          status: 'not-met'
        },
        { 
          description: "b. Country of Principal Place of Business", 
          value: "From: United States (Standard) → To: Cayman Islands (High) - Change Detected",
          status: 'met'
        },
        { 
          description: "c. Province the name of the country that the entity represents", 
          value: "From: New York, USA → To: Grand Cayman, Cayman Islands",
          status: 'met'
        },
        { 
          description: "d. Physical Address Country", 
          value: "From: United States (Standard) → To: Cayman Islands (High) - Change Detected",
          status: 'met'
        },
        { 
          description: "e. Operational Address Country", 
          value: "From: United States (Standard) → To: United States (Standard) - No Change",
          status: 'not-met'
        },
        { 
          description: "f. Registered Address Country", 
          value: "From: United States (Standard) → To: Cayman Islands (High) - Change Detected",
          status: 'met'
        }
      ]
    },
    {
      changeId: "individual-addresses",
      changeType: "Client - Individual, Address Changes",
      detected: false,
      details: "No changes detected in individual addresses",
      subItems: [
        { 
          description: "a. Citizenship Country Code", 
          value: "No change - US",
          status: 'not-met'
        },
        { 
          description: "b. Country of Residency", 
          value: "No change - United States",
          status: 'not-met'
        },
        { 
          description: "c. Residential Address Country", 
          value: "No change - United States",
          status: 'not-met'
        }
      ]
    },
    {
      changeId: "risk-escalation",
      changeType: "Address Risk Level Changes",
      detected: true,
      details: "Change in address from standard or elevated risk country to high risk country",
      subItems: [
        { 
          description: "Change Type", 
          value: "From Standard Risk Country → To High Risk Country",
          status: 'met'
        },
        { 
          description: "According to Country Risk Rating List", 
          value: "United States (Standard) → Cayman Islands (High)",
          status: 'met'
        },
        { 
          description: "Alternative: From High Risk → To High Risk", 
          value: "Not applicable in this case",
          status: 'not-met'
        }
      ]
    },
    {
      changeId: "embassy-consulate",
      changeType: "Embassy, Consulate, Mission Address Changes",
      detected: false,
      details: "No embassy, consulate, or mission address changes detected",
      subItems: [
        { 
          description: "For Embassy, Consulate, Mission when 'Provide the name of the country that the entity represents' question is captured", 
          value: "Not applicable - Client is not an Embassy/Consulate/Mission",
          status: 'not-met'
        },
        { 
          description: "Change in address from standard or elevated risk country to high risk country AND from high risk country to high risk country", 
          value: "Not applicable",
          status: 'not-met'
        },
        { 
          description: "According to Corruption Risk AML Country List", 
          value: "Not applicable",
          status: 'not-met'
        }
      ]
    },
    {
      changeId: "change-count",
      changeType: "Number of Changes",
      detected: true,
      details: "Total number of address changes: 3 (Principal Place of Business, Physical Address, Registered Address - all from US to Cayman Islands)",
      subItems: [
        { 
          description: "Country of Principal Place of Business", 
          value: "US → Cayman Islands (1 change)",
          status: 'met'
        },
        { 
          description: "Physical Address Country", 
          value: "US → Cayman Islands (1 change)",
          status: 'met'
        },
        { 
          description: "Registered Address Country", 
          value: "US → Cayman Islands (1 change)",
          status: 'met'
        },
        { 
          description: "Net Total of All Changes", 
          value: "3 changes (≥ 1 changes threshold met)",
          status: 'met'
        }
      ]
    }
  ];

  const totalChanges = addressChanges.filter(c => c.detected).length;

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            Address Changes Detection Logic
          </span>
        </div>
        <Badge variant={hasChanges ? "destructive" : "secondary"}>
          {totalChanges} Change{totalChanges !== 1 ? 's' : ''} Detected
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground px-1">
        In the last three years, have there been any frequent or material changes to address country? The system evaluates the following criteria:
      </p>

      <div className="space-y-2">
        {addressChanges.map((change) => (
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
                  {change.detected ? "Change Detected" : "No Change"}
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
                ? "Based on the detected changes above (Number of Changes ≥ 1), this question is answered as 'Yes' - there have been frequent or material changes to address country in the last 3 years."
                : "Based on the evaluation above, this question is answered as 'No' - there have not been frequent or material changes to address country in the last 3 years."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}