import { useState, lazy, Suspense } from "react";
import { DashboardHeader } from "./components/dashboard-header";

// Lazy load heavy components
const WorkflowsPage = lazy(() => import("./components/workflows-page").then(m => ({ default: m.WorkflowsPage })));
const RiskAssessmentPage = lazy(() => import("./components/risk-assessment-page").then(m => ({ default: m.RiskAssessmentPage })));
const ControlProcessManagementPage = lazy(() => import("./components/control-process-management-page").then(m => ({ default: m.ControlProcessManagementPage })));

export type UserRole = 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';

export default function App() {
  const [currentPage, setCurrentPage] = useState("workflows");
  const [userRole, setUserRole] = useState<UserRole>('hrs-analyst');
  const [selectedCaseData, setSelectedCaseData] = useState<any>(null);

  const handleNavigateToRiskAssessment = (caseData: any) => {
    setSelectedCaseData(caseData);
    setCurrentPage("risk-assessment");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "workflows":
        return <WorkflowsPage userRole={userRole} onNavigateToRiskAssessment={handleNavigateToRiskAssessment} />;
      case "risk-assessment":
        return <RiskAssessmentPage userRole={userRole} selectedCaseData={selectedCaseData} onNavigateBack={() => setCurrentPage("workflows")} />;
      case "control-management":
        return <ControlProcessManagementPage userRole={userRole} />;
      default:
        return <WorkflowsPage userRole={userRole} onNavigateToRiskAssessment={handleNavigateToRiskAssessment} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-[Roboto]">
      <DashboardHeader 
        userRole={userRole} 
        onRoleChange={setUserRole}
        onPageChange={setCurrentPage}
      />
      
      <main className="p-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          }>
            {renderPage()}
          </Suspense>
        </div>
      </main>
    </div>
  );
}