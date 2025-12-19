import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Eye
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface BulkProcessingJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalCases: number;
  processedCases: number;
  autoCompleted: number;
  manualReview: number;
  createdAt: string;
  completedAt?: string;
}

export function BulkCaseCreation() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingJobs, setProcessingJobs] = useState<BulkProcessingJob[]>([
    {
      id: 'job-001',
      name: 'Monthly HRA Population - June 2024',
      status: 'completed',
      totalCases: 1247,
      processedCases: 1247,
      autoCompleted: 892,
      manualReview: 355,
      createdAt: '2024-06-01T09:00:00Z',
      completedAt: '2024-06-01T14:30:00Z'
    },
    {
      id: 'job-002',
      name: 'Quarterly Risk Assessment - Q2 2024',
      status: 'processing',
      totalCases: 2156,
      processedCases: 1834,
      autoCompleted: 1298,
      manualReview: 536,
      createdAt: '2024-06-15T08:00:00Z'
    },
    {
      id: 'job-003',
      name: 'Ad-hoc Review - High Risk Jurisdictions',
      status: 'pending',
      totalCases: 342,
      processedCases: 0,
      autoCompleted: 0,
      manualReview: 0,
      createdAt: '2024-06-20T10:15:00Z'
    }
  ]);

  const [bulkSettings, setBulkSettings] = useState({
    defaultPriority: 'medium',
    defaultAnalyst: 'auto-assign',
    processingMode: 'mixed', // 'auto', 'manual', 'mixed'
    riskThreshold: 'standard'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleStartBulkProcessing = () => {
    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    const newJob: BulkProcessingJob = {
      id: `job-${String(processingJobs.length + 1).padStart(3, '0')}`,
      name: uploadedFile.name.replace('.csv', '').replace('.xlsx', ''),
      status: 'processing',
      totalCases: Math.floor(Math.random() * 1000) + 500,
      processedCases: 0,
      autoCompleted: 0,
      manualReview: 0,
      createdAt: new Date().toISOString()
    };

    setProcessingJobs(prev => [newJob, ...prev]);
    setUploadedFile(null);
    toast.success("Bulk processing job started");

    // Simulate processing progress
    simulateProcessing(newJob.id);
  };

  const simulateProcessing = (jobId: string) => {
    const interval = setInterval(() => {
      setProcessingJobs(prev => prev.map(job => {
        if (job.id === jobId && job.status === 'processing') {
          const progress = Math.min(job.processedCases + Math.floor(Math.random() * 50) + 10, job.totalCases);
          const autoRate = 0.7 + Math.random() * 0.2; // 70-90% auto completion rate
          const autoCompleted = Math.floor(progress * autoRate);
          const manualReview = progress - autoCompleted;

          if (progress >= job.totalCases) {
            clearInterval(interval);
            return {
              ...job,
              status: 'completed' as const,
              processedCases: job.totalCases,
              autoCompleted,
              manualReview,
              completedAt: new Date().toISOString()
            };
          }

          return {
            ...job,
            processedCases: progress,
            autoCompleted,
            manualReview
          };
        }
        return job;
      }));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <PauseCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Client Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>

            {uploadedFile && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Processing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5" />
              <span>Processing Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="default-priority">Default Priority</Label>
                <Select value={bulkSettings.defaultPriority} onValueChange={(value) => setBulkSettings(prev => ({ ...prev, defaultPriority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="processing-mode">Processing Mode</Label>
                <Select value={bulkSettings.processingMode} onValueChange={(value) => setBulkSettings(prev => ({ ...prev, processingMode: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-Complete Only</SelectItem>
                    <SelectItem value="manual">Manual Review Only</SelectItem>
                    <SelectItem value="mixed">Mixed Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="default-analyst">Default Analyst</Label>
              <Select value={bulkSettings.defaultAnalyst} onValueChange={(value) => setBulkSettings(prev => ({ ...prev, defaultAnalyst: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto-assign">Auto-assign</SelectItem>
                  <SelectItem value="sarah.johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="michael.chen">Michael Chen</SelectItem>
                  <SelectItem value="emily.rodriguez">Emily Rodriguez</SelectItem>
                  <SelectItem value="david.kim">David Kim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="risk-threshold">Risk Threshold</Label>
              <Select value={bulkSettings.riskThreshold} onValueChange={(value) => setBulkSettings(prev => ({ ...prev, riskThreshold: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleStartBulkProcessing}
              disabled={!uploadedFile}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Bulk Processing
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Processing Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Processing Jobs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingJobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{job.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(job.status)}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>

                {job.status === 'processing' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{job.processedCases} / {job.totalCases} cases</span>
                    </div>
                    <Progress value={(job.processedCases / job.totalCases) * 100} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Cases</p>
                    <p className="font-medium">{job.totalCases.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Auto-Completed</p>
                    <p className="font-medium text-green-600">{job.autoCompleted.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Manual Review</p>
                    <p className="font-medium text-orange-600">{job.manualReview.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completion Rate</p>
                    <p className="font-medium">
                      {job.totalCases > 0 ? Math.round((job.autoCompleted / job.totalCases) * 100) : 0}%
                    </p>
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}