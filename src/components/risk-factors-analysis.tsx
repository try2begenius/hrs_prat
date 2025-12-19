import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { AlertCircle, DollarSign, Globe, Users, FileText, Shield } from "lucide-react";

const riskFactors = [
  {
    category: "Transaction Patterns",
    icon: DollarSign,
    factors: [
      { name: "Large Cash Transactions", prevalence: 78, impact: "High", count: 234 },
      { name: "Unusual Wire Transfers", prevalence: 65, impact: "High", count: 189 },
      { name: "Rapid Account Turnover", prevalence: 45, impact: "Medium", count: 156 },
      { name: "Round Dollar Amounts", prevalence: 32, impact: "Low", count: 98 }
    ]
  },
  {
    category: "Geographic Risk",
    icon: Globe,
    factors: [
      { name: "High-Risk Jurisdictions", prevalence: 85, impact: "High", count: 312 },
      { name: "Shell Company Locations", prevalence: 67, impact: "High", count: 198 },
      { name: "Sanctions List Countries", prevalence: 43, impact: "High", count: 145 },
      { name: "Tax Haven Connections", prevalence: 38, impact: "Medium", count: 124 }
    ]
  },
  {
    category: "Customer Behavior",
    icon: Users,
    factors: [
      { name: "PEP Connections", prevalence: 72, impact: "High", count: 267 },
      { name: "Adverse Media Coverage", prevalence: 58, impact: "Medium", count: 178 },
      { name: "Incomplete Documentation", prevalence: 49, impact: "Medium", count: 134 },
      { name: "Frequent Address Changes", prevalence: 28, impact: "Low", count: 87 }
    ]
  },
  {
    category: "Compliance Issues",
    icon: Shield,
    factors: [
      { name: "Missing KYC Updates", prevalence: 63, impact: "High", count: 201 },
      { name: "SAR Filing Delays", prevalence: 41, impact: "Medium", count: 123 },
      { name: "CDD Deficiencies", prevalence: 37, impact: "Medium", count: 109 },
      { name: "EDD Requirements", prevalence: 29, impact: "High", count: 95 }
    ]
  }
];

const getImpactBadgeVariant = (impact: string) => {
  switch (impact) {
    case "High": return "destructive";
    case "Medium": return "default";
    case "Low": return "secondary";
    default: return "outline";
  }
};

export function RiskFactorsAnalysis() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {riskFactors.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <category.icon className="h-5 w-5" />
              <span>{category.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.factors.map((factor, factorIndex) => (
                <div key={factorIndex} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <Badge variant={getImpactBadgeVariant(factor.impact)} className="text-xs">
                        {factor.impact}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{factor.count} cases</span>
                      <span className="text-sm font-medium">{factor.prevalence}%</span>
                    </div>
                  </div>
                  <Progress value={factor.prevalence} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}