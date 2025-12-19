import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "./ui/badge";
import { Settings, Zap, Target, Users } from "lucide-react";

const allocationAlgorithms = [
  { name: "Pro-Rata", value: 45, color: "#1e40af", trades: 562, efficiency: 98.5 },
  { name: "Priority-Based", value: 28, color: "#3b82f6", trades: 349, efficiency: 97.2 },
  { name: "Size-Weighted", value: 15, color: "#60a5fa", trades: 187, efficiency: 99.1 },
  { name: "Custom Rules", value: 12, color: "#93c5fd", trades: 149, efficiency: 96.8 }
];

const allocationPerformance = [
  { algorithm: "Pro-Rata", avgTime: 2.3, successRate: 98.5, volume: 562 },
  { algorithm: "Priority", avgTime: 1.8, successRate: 97.2, volume: 349 },
  { algorithm: "Size-Weighted", avgTime: 3.1, successRate: 99.1, volume: 187 },
  { algorithm: "Custom", avgTime: 4.2, successRate: 96.8, volume: 149 }
];

export function AllocationAlgorithmsChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Algorithm Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={allocationAlgorithms}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {allocationAlgorithms.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={allocationPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="algorithm" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="successRate" fill="#1e40af" name="Success Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Algorithm Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocationAlgorithms.map((algo, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: algo.color }}
                  />
                  <div>
                    <p className="font-medium text-blue-900">{algo.name}</p>
                    <p className="text-sm text-blue-700">{algo.trades} trades</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-primary text-primary-foreground mb-1">
                    {algo.efficiency}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}