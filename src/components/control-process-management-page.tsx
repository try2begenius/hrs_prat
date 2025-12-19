import { Card } from "./ui/card";
import { ControlProcessManagement } from "./control-process-management";

interface ControlProcessManagementPageProps {
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
}

export function ControlProcessManagementPage({ userRole }: ControlProcessManagementPageProps) {
  // Convert role naming
  const mappedRole = userRole === 'hrs-analyst' ? 'hra-analyst' : 
                     userRole === 'hrs-manager' ? 'hra-manager' : 
                     userRole === 'flu-aml' ? 'flu-aml' : 'gfc';

  const currentUser = {
    name: userRole === 'hrs-analyst' ? 'John Smith' :
          userRole === 'hrs-manager' ? 'Sarah Johnson' :
          userRole === 'flu-aml' ? 'Michael Chen' : 
          'Admin User',
    email: userRole === 'hrs-analyst' ? 'john.smith@bofa.com' :
           userRole === 'hrs-manager' ? 'sarah.johnson@bofa.com' :
           userRole === 'flu-aml' ? 'michael.chen@bofa.com' :
           'admin@bofa.com'
  };

  return (
    <div className="space-y-6">
      <ControlProcessManagement 
        userRole={mappedRole}
        currentUser={currentUser}
      />
    </div>
  );
}
