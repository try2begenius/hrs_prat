import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";


import { WorkbasketManagement } from "./workbasket-management";
import { calculateWidgetNumbers, WorkbasketFilter } from "./workbasket-data";
import { 
  Users, 
  ArrowUpCircle,
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";

interface WorkflowsPageProps {
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
  onNavigateToRiskAssessment?: (caseData: any) => void;
}

export function WorkflowsPage({ userRole, onNavigateToRiskAssessment }: WorkflowsPageProps) {
  const [activeTab, setActiveTab] = useState("workbasket");
  const [widgetFilter, setWidgetFilter] = useState<WorkbasketFilter>('all');

  // Mock current user data
  const currentUser = {
    name: "Sarah Johnson",
    role: userRole,
    roleDisplay: {
      'hrs-analyst': 'HRS Analyst',
      'hrs-manager': 'HRS Manager', 
      'flu-aml': 'FLU AML Representative',
      'view-only': 'View Only'
    }[userRole],
    lob: "Investment Banking"
  };

  const handleWidgetClick = (filterType: WorkbasketFilter) => {
    setWidgetFilter(filterType);
  };

  // Calculate widget numbers using shared data source
  const widgetNumbers = calculateWidgetNumbers(currentUser);

  return (
    <div className="space-y-6">
      {/* Workflow Action Widgets */}
      <div className="grid grid-cols-4 gap-3">
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            widgetFilter === 'active' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => handleWidgetClick('active')}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">My Active Cases</p>
                <p className="font-medium text-lg">{widgetNumbers.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            widgetFilter === 'escalations' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => handleWidgetClick('escalations')}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowUpCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Escalations</p>
                <p className="font-medium text-lg">{widgetNumbers.escalations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            widgetFilter === 'completed' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => handleWidgetClick('completed')}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed Today</p>
                <p className="font-medium text-lg">{widgetNumbers.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            widgetFilter === 'returned' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => handleWidgetClick('returned')}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <RotateCcw className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Returned Cases</p>
                <p className="font-medium text-lg">{widgetNumbers.returned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Filter Indicator */}
      {widgetFilter !== 'all' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Filtering by: {
                    widgetFilter === 'active' ? 'Active Cases (assigned & in-progress)' :
                    widgetFilter === 'escalations' ? 'Cases requiring escalation' :
                    widgetFilter === 'completed' ? 'Cases completed today' :
                    'Returned Cases'
                  }
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleWidgetClick('all')}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Clear Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workbasket and Work Queue */}
      <WorkbasketManagement 
        userRole={userRole} 
        currentUser={currentUser} 
        widgetFilter={widgetFilter}
        onNavigateToRiskAssessment={onNavigateToRiskAssessment}
      />
    </div>
  );
}