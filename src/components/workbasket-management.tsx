import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users,
  FileSearch
} from "lucide-react";
import { MyWorkbasketTable } from "./my-workbasket-table";
import { WorkQueueTable } from "./work-queue-table";
import { AGGridWrapper } from "./ag-grid-wrapper";

export type WorkbasketFilter = 'all' | 'active' | 'escalations' | 'completed' | 'returned';

interface WorkbasketManagementProps {
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
  currentUser: any;
  widgetFilter?: WorkbasketFilter;
  onNavigateToRiskAssessment?: (caseData: any) => void;
}

export function WorkbasketManagement({ userRole, currentUser, widgetFilter, onNavigateToRiskAssessment }: WorkbasketManagementProps) {
  const [activeTab, setActiveTab] = useState('workbasket');

  const getRoleBasedMessage = () => {
    switch (userRole) {
      case 'hrs-analyst':
        return "As an HRS Analyst, you can escalate cases to your manager using the action buttons in each case row.";
      case 'hrs-manager':
        return "As an HRS Manager, you can assign/reassign cases to analysts or escalate to FLU using the action buttons.";
      case 'flu-aml':
        return "As an FLU AML Representative, you can reassign cases or return them to HRS using the action buttons.";
      case 'view-only':
        return "As a View Only user, you can view case details but cannot perform actions.";
      default:
        return "Use the action buttons in each case row to assign, reassign, escalate, or return cases based on your role.";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workbasket" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Workbasket</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center space-x-2">
            <FileSearch className="h-4 w-4" />
            <span>Work Queue</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workbasket" className="space-y-6">
          <AGGridWrapper>
            <MyWorkbasketTable 
              userRole={userRole} 
              currentUser={currentUser} 
              widgetFilter={widgetFilter}
              onNavigateToRiskAssessment={onNavigateToRiskAssessment}
            />
          </AGGridWrapper>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <AGGridWrapper>
            <WorkQueueTable 
              userRole={userRole} 
              currentUser={currentUser} 
              onNavigateToRiskAssessment={onNavigateToRiskAssessment}
            />
          </AGGridWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}