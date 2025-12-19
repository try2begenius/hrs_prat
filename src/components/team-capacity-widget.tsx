import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, User } from "lucide-react";

interface BulkUser {
  id: string;
  name: string;
  role: string;
  lob: string;
  activeCase: number;
  capacity: number;
  availability: 'available' | 'busy' | 'unavailable';
}

interface TeamCapacityWidgetProps {
  userRole: 'hra-analyst' | 'hra-manager' | 'flu-aml' | 'gfc';
}

export function TeamCapacityWidget({ userRole }: TeamCapacityWidgetProps) {
  // Only show for Manager and above roles
  const isManagerOrAbove = userRole === 'hra-manager' || userRole === 'flu-aml' || userRole === 'gfc';
  
  if (!isManagerOrAbove) {
    return null;
  }

  // Mock available users data
  const availableUsers: BulkUser[] = [
    { id: 'analyst1', name: 'Sarah Johnson', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20, availability: 'available' },
    { id: 'analyst2', name: 'Michael Chen', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 8, capacity: 20, availability: 'available' },
    { id: 'analyst3', name: 'Emily Rodriguez', role: 'HRA Analyst', lob: 'Private Banking', activeCase: 15, capacity: 20, availability: 'busy' },
    { id: 'analyst4', name: 'Alex Thompson', role: 'HRA Analyst', lob: 'Commercial Banking', activeCase: 6, capacity: 20, availability: 'available' },
    { id: 'analyst5', name: 'Jennifer Liu', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 4, capacity: 20, availability: 'available' },
    { id: 'analyst6', name: 'Marcus Williams', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 18, capacity: 20, availability: 'busy' },
    { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs', activeCase: 28, capacity: 35, availability: 'available' },
    { id: 'manager2', name: 'Lisa Chen', role: 'HRA Manager', lob: 'Investment Banking', activeCase: 22, capacity: 30, availability: 'available' },
    { id: 'flu1', name: 'Robert Garcia', role: 'FLU AML Representative', lob: 'All LOBs', activeCase: 14, capacity: 25, availability: 'available' },
    { id: 'gfc1', name: 'Amanda Foster', role: 'GFC Representative', lob: 'All LOBs', activeCase: 8, capacity: 15, availability: 'available' }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 border-green-600';
      case 'busy': return 'text-orange-600 border-orange-600';
      case 'unavailable': return 'text-red-600 border-red-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const getCapacityColor = (activeCase: number, capacity: number) => {
    const percentage = (activeCase / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressBarColor = (activeCase: number, capacity: number) => {
    const percentage = (activeCase / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Team Capacity Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                  <p className="text-xs text-muted-foreground">{user.lob}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getAvailabilityColor(user.availability)}`}
                >
                  {user.availability}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Active Cases</span>
                  <span className={getCapacityColor(user.activeCase, user.capacity)}>
                    {user.activeCase} / {user.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressBarColor(user.activeCase, user.capacity)}`}
                    style={{ width: `${Math.min((user.activeCase / user.capacity) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Capacity: {Math.round((user.activeCase / user.capacity) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}