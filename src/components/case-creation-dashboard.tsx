import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
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
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  PlayCircle,
  PauseCircle
} from "lucide-react";

const caseProcessingData = [
  { month: 'Jan', autoCompleted: 245, manualReview: 78, pending: 23 },
  { month: 'Feb', autoCompleted: 289, manualReview: 92, pending: 31 },
  { month: 'Mar', autoCompleted: 312, manualReview: 103, pending: 28 },
  { month: 'Apr', autoCompleted: 298, manualReview: 87, pending: 19 },
  { month: 'May', autoCompleted: 334, manualReview: 116, pending: 34 },
  { month: 'Jun', autoCompleted: 367, manualReview: 124, pending: 29 }
];

const manualReviewReasons = [
  { name: 'GFC Intelligence Yes', value: 156, color: '#ef4444' },
  { name: 'Risk Drivers >10', value: 142, color: '#f97316' },
  { name: 'New Risk Factors ≥5', value: 98, color: '#eab308' },
  { name: 'TRMS Referrals', value: 87, color: '#22c55e' },
  { name: 'Client Escalation', value: 73, color: '#3b82f6' },
  { name: 'Other Factors', value: 86, color: '#8b5cf6' }
];

const processingTrends = [
  { date: 'Week 1', straightThrough: 92.3, manualReview: 7.7 },
  { date: 'Week 2', straightThrough: 89.1, manualReview: 10.9 },
  { date: 'Week 3', straightThrough: 94.2, manualReview: 5.8 },
  { date: 'Week 4', straightThrough: 87.5, manualReview: 12.5 }
];

export function CaseCreationDashboard() {
  return (
    <div className="space-y-6">
      {/* Processing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Case Processing Volume</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={caseProcessingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="autoCompleted" name="Auto-Completed" fill="#22c55e" />
                <Bar dataKey="manualReview" name="Manual Review" fill="#f97316" />
                <Bar dataKey="pending" name="Pending" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Manual Review Reasons</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={manualReviewReasons}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {manualReviewReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Processing Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Processing Efficiency Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="straightThrough" 
                name="Straight Through Processing %" 
                stroke="#22c55e" 
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="manualReview" 
                name="Manual Review %" 
                stroke="#f97316" 
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Case Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5" />
              <span>Active Processing Workflows</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Auto-Completion Queue</p>
                    <p className="text-sm text-muted-foreground">Processing eligible cases</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">247 cases</p>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Manual Review Queue</p>
                    <p className="text-sm text-muted-foreground">Awaiting analyst review</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">89 cases</p>
                  <Badge variant="outline" className="text-xs">Pending</Badge>
                </div>
              </div>
              <Progress value={34} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quality Review</p>
                    <p className="text-sm text-muted-foreground">Final validation stage</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">23 cases</p>
                  <Badge variant="secondary" className="text-xs">Review</Badge>
                </div>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Case Creation Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Auto-Completion Criteria</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• All required data populated</li>
                  <li>• GFC Intelligence = No</li>
                  <li>• Risk drivers ≤ 10</li>
                  <li>• New risk factors &lt; 5</li>
                  <li>• No escalation flags</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Manual Review Triggers</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• GFC Intelligence = Yes</li>
                  <li>• Risk drivers &gt; 10</li>
                  <li>• New risk factors ≥ 5</li>
                  <li>• TRMS referrals = Yes</li>
                  <li>• Client escalation required</li>
                </ul>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Full Criteria Matrix
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}