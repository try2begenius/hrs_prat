import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, DollarSign, Clock, Target, Zap } from "lucide-react";

const scenarioData = [
  {
    scenario: "Standard Allocation",
    description: "Regular pro-rata distribution",
    frequency: 68,
    avgTime: 2.1,
    successRate: 98.5,
    complexity: "Low",
    trades: 847,
    icon: Target
  },
  {
    scenario: "High Priority Clients",
    description: "Priority-based allocation for VIP accounts",
    frequency: 18,
    avgTime: 1.8,
    successRate: 99.2,
    complexity: "Medium",
    trades: 224,
    icon: Users
  },
  {
    scenario: "Block Trading",
    description: "Large institutional orders",
    frequency: 12,
    avgTime: 4.5,
    successRate: 96.8,
    complexity: "High",
    trades: 149,
    icon: DollarSign
  },
  {
    scenario: "Partial Fill Handling",
    description: "Managing incomplete executions",
    frequency: 15,
    avgTime: 3.2,
    successRate: 94.1,
    complexity: "Medium",
    trades: 187,
    icon: Clock
  },
  {
    scenario: "Cross-Asset Allocation",
    description: "Multi-instrument strategies",
    frequency: 8,
    avgTime: 5.8,
    successRate: 92.3,
    complexity: "High",
    trades: 99,
    icon: TrendingUp
  },
  {
    scenario: "Emergency Rebalancing",
    description: "Rapid portfolio adjustments",
    frequency: 3,
    avgTime: 1.2,
    successRate: 89.7,
    complexity: "Critical",
    trades: 37,
    icon: Zap
  }
];

const performanceData = [
  { time: "09:00", standard: 95, priority: 98, block: 92, partial: 89 },
  { time: "10:00", standard: 97, priority: 99, block: 94, partial: 91 },
  { time: "11:00", standard: 98, priority: 99, block: 96, partial: 93 },
  { time: "12:00", standard: 99, priority: 99, block: 97, partial: 95 },
  { time: "13:00", standard: 98, priority: 98, block: 95, partial: 92 },
  { time: "14:00", standard: 97, priority: 97, block: 93, partial: 90 },
  { time: "15:00", standard: 96, priority: 96, block: 91, partial: 88 }
];

const volumeData = [
  { time: "09:00", volume: 1200 },
  { time: "09:30", volume: 2800 },
  { time: "10:00", volume: 4200 },
  { time: "10:30", volume: 3900 },
  { time: "11:00", volume: 5100 },
  { time: "11:30", volume: 4700 },
  { time: "12:00", volume: 3200 },
  { time: "12:30", volume: 2900 },
  { time: "13:00", volume: 3800 },
  { time: "13:30", volume: 4400 },
  { time: "14:00", volume: 3600 },
  { time: "14:30", volume: 2800 },
  { time: "15:00", volume: 2100 }
];

const getComplexityBadgeColor = (complexity: string) => {
  switch (complexity) {
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    case "Medium": return "bg-blue-100 text-blue-800 border-blue-200";
    case "High": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Critical": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function AllocationScenariosAnalysis() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Allocation Scenario Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="standard" stroke="#1e40af" name="Standard" strokeWidth={2} />
              <Line type="monotone" dataKey="priority" stroke="#3b82f6" name="Priority" strokeWidth={2} />
              <Line type="monotone" dataKey="block" stroke="#60a5fa" name="Block Trading" strokeWidth={2} />
              <Line type="monotone" dataKey="partial" stroke="#93c5fd" name="Partial Fill" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocation Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="volume" stroke="#1e40af" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Scenario Breakdown & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarioData.map((scenario, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <scenario.icon className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">{scenario.scenario}</h4>
                  </div>
                  <Badge variant="outline" className={getComplexityBadgeColor(scenario.complexity)}>
                    {scenario.complexity}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Frequency</span>
                    <span className="font-medium">{scenario.frequency}%</span>
                  </div>
                  <Progress value={scenario.frequency} className="h-1" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Success Rate</p>
                    <p className="font-medium text-green-600">{scenario.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Time</p>
                    <p className="font-medium">{scenario.avgTime}s</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Trades</span>
                    <span className="font-medium text-primary">{scenario.trades}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}