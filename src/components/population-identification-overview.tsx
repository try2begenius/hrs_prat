import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Users, RefreshCw, CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react";

export function PopulationIdentificationOverview() {
  const metrics = [
    {
      title: "Eligible Population",
      value: "2,847",
      change: "+156",
      changeType: "increase" as const,
      icon: Users,
      description: "Clients meeting HRS criteria",
      percentage: 0
    },
    {
      title: "Refresh Completed",
      value: "2,691",
      change: "+203",
      changeType: "increase" as const,
      icon: RefreshCw,
      description: "Ready for case creation",
      percentage: 94.5
    },
    {
      title: "HRS Cases Created",
      value: "2,524",
      change: "+187",
      changeType: "increase" as const,
      icon: CheckCircle,
      description: "Successfully initiated",
      percentage: 88.7
    },
    {
      title: "Escalations",
      value: "23",
      change: "+5",
      changeType: "increase" as const,
      icon: AlertTriangle,
      description: "Manual review required",
      percentage: 0.8
    },
    {
      title: "Pending CAM",
      value: "167",
      change: "-34",
      changeType: "decrease" as const,
      icon: Clock,
      description: "Awaiting CAM completion",
      percentage: 5.9
    },
    {
      title: "Processing Rate",
      value: "94.3%",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: TrendingUp,
      description: "Monthly efficiency",
      percentage: 94.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${
              metric.title.includes('Escalations') ? 'text-orange-500' : 
              metric.title.includes('Pending') ? 'text-blue-500' : 
              'text-green-500'
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-600' : 
                metric.changeType === 'decrease' ? 'text-red-600' : 
                'text-muted-foreground'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
            {metric.percentage > 0 && (
              <div className="space-y-2">
                <Progress value={metric.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{metric.percentage}% of eligible population</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}