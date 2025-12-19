import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  GitBranch, 
  Users, 
  ArrowUpCircle,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Activity
} from "lucide-react";

interface WorkflowDashboardProps {
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
  currentUser: any;
  onNavigate?: () => void;
}

const workflowData = [
  { status: 'Assigned', count: 45, color: '#3b82f6' },
  { status: 'In Progress', count: 32, color: '#eab308' },
  { status: 'Escalated', count: 18, color: '#f97316' },
  { status: 'Returned', count: 12, color: '#ef4444' },
  { status: 'Completed', count: 89, color: '#22c55e' }
];

const escalationTrends = [
  { week: 'Week 1', toManager: 12, toFLU: 8, toGFC: 4 },
  { week: 'Week 2', toManager: 15, toFLU: 11, toGFC: 6 },
  { week: 'Week 3', toManager: 18, toFLU: 9, toGFC: 8 },
  { week: 'Week 4', toManager: 14, toFLU: 12, toGFC: 5 }
];

export function WorkflowDashboard({ userRole, currentUser, onNavigate }: WorkflowDashboardProps) {
  const getRoleSpecificMetrics = () => {
    switch (userRole) {
      case 'hrs-analyst':
        return {
          primaryActions: [
            { label: 'Get Next Case', icon: Activity, count: null },
            { label: 'My Active Cases', icon: Users, count: 24 },
            { label: 'Ready to Escalate', icon: ArrowUpCircle, count: 8 },
            { label: 'Returned for Review', icon: RotateCcw, count: 3 }
          ]
        };
      case 'hrs-manager':
        return {
          primaryActions: [
            { label: 'Team Cases', icon: Users, count: 156 },
            { label: 'Pending Approvals', icon: CheckCircle, count: 18 },
            { label: 'Escalation Requests', icon: ArrowUpCircle, count: 12 },
            { label: 'Bulk Reassign', icon: UserCheck, count: null }
          ]
        };
      case 'flu-aml':
        return {
          primaryActions: [
            { label: 'AML Cases', icon: AlertTriangle, count: 34 },
            { label: 'Under Review', icon: Clock, count: 12 },
            { label: 'Completed', icon: CheckCircle, count: 89 },
            { label: 'Return to HRS', icon: RotateCcw, count: 5 }
          ]
        };
      case 'view-only':
        return {
          primaryActions: [
            { label: 'Total Cases', icon: Users, count: 196 },
            { label: 'High Priority', icon: AlertTriangle, count: 28 },
            { label: 'In Progress', icon: Clock, count: 89 },
            { label: 'Completed', icon: CheckCircle, count: 124 }
          ]
        };
      default:
        return { primaryActions: [] };
    }
  };

  const metrics = getRoleSpecificMetrics();

  return (
    <div className="space-y-6">
      {/* Role-Specific Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.primaryActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      {action.count !== null && (
                        <p className="text-lg font-semibold text-primary">{action.count}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onNavigate}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Queue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Work Queue Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workflowData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="status"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {workflowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Escalation Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Escalation Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={escalationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="toManager" name="To Manager" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="toFLU" name="To FLU AML" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="toGFC" name="To GFC" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workflow Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Workflow Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Case HRA-2024-0156 escalated to Manager",
                user: "Sarah Johnson",
                time: "2 minutes ago",
                status: "escalated"
              },
              {
                action: "Case HRA-2024-0143 returned for corrections",
                user: "Michael Chen",
                time: "15 minutes ago",
                status: "returned"
              },
              {
                action: "Case HRA-2024-0189 assigned to Emily Rodriguez",
                user: "David Kim",
                time: "32 minutes ago",
                status: "assigned"
              },
              {
                action: "Case HRA-2024-0134 completed by analyst",
                user: "Alex Thompson",
                time: "1 hour ago",
                status: "completed"
              },
              {
                action: "Bulk reassignment: 12 cases to Investment Banking team",
                user: "Manager - David Kim",
                time: "2 hours ago",
                status: "bulk"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border-l-4 border-l-primary/20 bg-muted/30 rounded-r-lg">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'escalated' ? 'bg-orange-100' :
                  activity.status === 'returned' ? 'bg-red-100' :
                  activity.status === 'assigned' ? 'bg-blue-100' :
                  activity.status === 'completed' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  {activity.status === 'escalated' && <ArrowUpCircle className="h-4 w-4 text-orange-600" />}
                  {activity.status === 'returned' && <RotateCcw className="h-4 w-4 text-red-600" />}
                  {activity.status === 'assigned' && <UserCheck className="h-4 w-4 text-blue-600" />}
                  {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activity.status === 'bulk' && <Users className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}