import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const clientTypeData = [
  { type: "Retail", total: 8420, highRisk: 89, mediumRisk: 234, lowRisk: 8097 },
  { type: "Corporate", total: 2847, highRisk: 127, mediumRisk: 456, lowRisk: 2264 },
  { type: "Banking", total: 1180, highRisk: 31, mediumRisk: 98, lowRisk: 1051 },
  { type: "Investment", total: 400, highRisk: 18, mediumRisk: 67, lowRisk: 315 }
];

const riskDistributionData = [
  { name: "Low Risk", value: 11727, color: "#3b82f6" },
  { name: "Medium Risk", value: 855, color: "#60a5fa" },
  { name: "High Risk", value: 265, color: "#dc2626" }
];

export function ClientTypeAnalysis() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution by Client Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lowRisk" stackId="a" fill="#3b82f6" name="Low Risk" />
              <Bar dataKey="mediumRisk" stackId="a" fill="#60a5fa" name="Medium Risk" />
              <Bar dataKey="highRisk" stackId="a" fill="#dc2626" name="High Risk" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}