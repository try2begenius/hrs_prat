import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronRight, CheckCircle2, DollarSign } from "lucide-react";

interface SourceFundsChange {
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

interface SourceFundsChangesDetailsProps {
  hasChanges: boolean;
}

export function SourceFundsChangesDetails({ hasChanges }: SourceFundsChangesDetailsProps) {
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
  const sourceFundsChanges: SourceFundsChange[] = [
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
      changeId: "source-funds-changes",
      changeType: "Source of Funds/Wealth Changes Across All LOBs",
      detected: true,
      details: "Analyzing changes in source of funds/wealth from previous state to current state across all Lines of Business",
      subItems: [
        { 
          description: "Source of Funds/Wealth Analysis", 
          value: "Comparing all Source of Funds/Wealth fields across all LOBs", 
          status: 'met' 
        },
        { 
          description: "LOB: Global Corporate Banking", 
          value: "From: 'Business Operations Revenue' → To: 'Business Operations Revenue + Investment Income'", 
          status: 'met' 
        },
        { 
          description: "Change Details - GCB", 
          value: "Added new source: Investment Income from digital asset portfolio ($2.5M annually)", 
          status: 'met' 
        },
        { 
          description: "LOB: Global Transaction Services", 
          value: "From: 'Corporate Treasury Operations' → To: 'Corporate Treasury Operations + Cryptocurrency Trading'", 
          status: 'met' 
        },
        { 
          description: "Change Details - GTS", 
          value: "Added new source: Cryptocurrency trading activities ($1.8M annually)", 
          status: 'met' 
        },
        { 
          description: "LOB: Global Markets", 
          value: "No change detected", 
          status: 'not-met' 
        },
        { 
          description: "Source of Wealth Analysis", 
          value: "From: 'Accumulated Business Profits' → To: 'Accumulated Business Profits + Digital Asset Appreciation'", 
          status: 'met' 
        },
        { 
          description: "Wealth Source Change Details", 
          value: "Significant appreciation in digital asset holdings contributed to overall wealth increase", 
          status: 'met' 
        },
        { 
          description: "Income vs Wealth Comparison", 
          value: "Income sources expanded to include cryptocurrency-related revenue streams; Wealth composition now includes digital assets", 
          status: 'met' 
        },
        { 
          description: "Change Materiality Assessment", 
          value: "Material - New income sources represent >15% of total income; Digital assets represent >20% of total wealth", 
          status: 'met' 
        }
      ]
    },
    {
      changeId: "change-count",
      changeType: "Number of Changes",
      detected: true,
      details: "Net total of all source of funds/wealth changes across all LOBs",
      subItems: [
        { 
          description: "Total Source of Funds Changes", 
          value: "2 changes detected (GCB + GTS)", 
          status: 'met' 
        },
        { 
          description: "Total Source of Wealth Changes", 
          value: "1 change detected", 
          status: 'met' 
        },
        { 
          description: "Net Total of All Changes", 
          value: "3 changes (≥ 1 changes threshold met)", 
          status: 'met' 
        },
        { 
          description: "Threshold Requirement", 
          value: "Number of Change is = or > 1 changes ✓", 
          status: 'met' 
        },
        { 
          description: "Change Period", 
          value: "All changes occurred within the last 3 years (Jan 2024 - Mar 2024)", 
          status: 'met' 
        }
      ]
    }
  ];

  const totalChanges = sourceFundsChanges.filter(c => c.detected).length;

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">
            Source of Funds/Wealth Changes Detection Logic
          </span>
        </div>
        <Badge variant={hasChanges ? "destructive" : "secondary"}>
          {hasChanges ? "Changes Detected" : "No Changes"}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground px-1">
        In the last three years, have there been any frequent or material changes to source of funds/wealth vs. income/wealth? The system evaluates the following criteria:
      </p>

      <div className="space-y-2">
        {sourceFundsChanges.map((change) => (
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
                ? "Based on the detected changes above (Net Total of 3 changes ≥ 1 threshold), this question is answered as 'Yes' - there have been frequent or material changes to source of funds/wealth vs. income/wealth in the last 3 years. The client has added cryptocurrency-related income sources and digital asset holdings to their financial profile."
                : "Based on the evaluation above, this question is answered as 'No' - there have not been frequent or material changes to source of funds/wealth vs. income/wealth in the last 3 years."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}