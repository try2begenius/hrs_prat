import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { 
  CheckCircle,
  FileText,
  AlertTriangle,
  Shield,
  Upload,
  Download,
  Edit,
  Save,
  Clock,
  User,
  MessageSquare,
  Paperclip
} from "lucide-react";

interface RiskSummarySectionProps {
  caseData: any;
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
  canEdit: boolean;
  onDataChange: () => void;
}

interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
}

export function RiskSummarySection({ 
  caseData, 
  userRole, 
  canEdit, 
  onDataChange 
}: RiskSummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Risk Summary State
  const [riskSummary, setRiskSummary] = useState({
    summary: "Client exhibits multiple high-risk characteristics including Cayman Islands domicile, PEP status, and GFC intelligence presence. Investment Banking LOB has implemented enhanced due diligence and transaction monitoring controls. Wealth Management division maintains ongoing PEP monitoring. All control processes are operating effectively with high effectiveness ratings.",
    recommendation: "escalate_flu",
    escalationReason: "high_risk_attributes",
    fileTrms: true,
    trmsTrackingNumber: "TRMS-2024-FL-00234"
  });

  // Attestation Checkboxes State
  const [attestation, setAttestation] = useState({
    approvedNoAdditional: false,
    reviewedNoEscalation: false,
    reviewedEscalatedFLU: false,
    reviewedEscalatedTRMS: false,
    confirmDataReviewed: false
  });
  
  // Comments State
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson", 
      role: "HRA Analyst",
      content: "Initial assessment completed. Client shows significant risk elevation since previous refresh due to jurisdiction change and new PEP classification. Recommend escalation for enhanced review.",
      timestamp: "2024-06-15T10:30:00Z",
      attachments: ["risk_analysis_report.pdf"]
    },
    {
      id: "2",
      author: "David Kim",
      role: "HRA Manager", 
      content: "Reviewed analyst assessment. Concur with escalation recommendation. GFC intelligence indicates ongoing monitoring requirements. Escalating to FLU AML for comprehensive review.",
      timestamp: "2024-06-16T14:45:00Z"
    }
  ]);

  const [newComment, setNewComment] = useState("");
  
  // Attachments State
  const [attachments, setAttachments] = useState<Attachment[]>([
    {
      id: "1",
      name: "risk_analysis_report.pdf",
      size: "2.3 MB",
      uploadedBy: "Sarah Johnson",
      uploadDate: "2024-06-15"
    },
    {
      id: "2", 
      name: "client_documentation.docx",
      size: "1.1 MB",
      uploadedBy: "David Kim", 
      uploadDate: "2024-06-16"
    }
  ]);

  // Outcomes State
  const [outcomes, setOutcomes] = useState({
    fluAmlOutcome: "",
    gfcOutcome: "",
    fluAmlTrms: false,
    fluAmlTrmsNumber: "",
    gfcTrms: false,
    gfcTrmsNumber: ""
  });

  const getEditableFields = () => {
    const baseFields = ['attachments', 'comments'];
    
    switch (userRole) {
      case 'hrs-analyst':
      case 'hrs-manager':
        return [...baseFields, 'summary', 'recommendation', 'escalationReason', 'fileTrms', 'trmsTrackingNumber'];
      case 'flu-aml':
        return [...baseFields, 'fluAmlOutcome', 'fluAmlTrms', 'fluAmlTrmsNumber'];
      default:
        return baseFields;
    }
  };

  const canEditField = (field: string) => {
    return getEditableFields().includes(field);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: getCurrentUserName(),
        role: getRoleDisplay(),
        content: newComment.trim(),
        timestamp: new Date().toISOString()
      };
      setComments([...comments, comment]);
      setNewComment("");
      onDataChange();
    }
  };

  const getCurrentUserName = () => {
    const roleNames = {
      'hrs-analyst': 'Sarah Johnson',
      'hrs-manager': 'David Kim',
      'flu-aml': 'Michael Rodriguez'
    };
    return roleNames[userRole];
  };

  const getRoleDisplay = () => {
    const roleDisplays = {
      'hrs-analyst': 'HRA Analyst',
      'hrs-manager': 'HRA Manager',
      'flu-aml': 'FLU AML Representative'
    };
    return roleDisplays[userRole];
  };

  const handleSave = () => {
    setIsEditing(false);
    onDataChange();
  };

  const CommentThread = ({ title, roleFilter }: { title: string; roleFilter?: string }) => {
    const filteredComments = roleFilter 
      ? comments.filter(c => c.role.toLowerCase().includes(roleFilter.toLowerCase()))
      : comments;

    return (
      <div className="space-y-3">
        <h5 className="font-medium text-sm flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>{title}</span>
          <Badge variant="outline" className="text-xs">{filteredComments.length}</Badge>
        </h5>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{comment.author}</span>
                  <Badge variant="outline" className="text-xs">{comment.role}</Badge>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2 flex items-center space-x-2">
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {comment.attachments.length} attachment{comment.attachments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {userRole === 'flu-aml' ? 'Limited Edit' : 'Editable'}
            </Badge>
            {canEdit && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Final risk summary narrative and recommendation with role-based decision capabilities.
        </p>
      </div>

        {/* Risk Mitigants Summary - HRA Only */}
        {(userRole === 'hrs-analyst' || userRole === 'hrs-manager') && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Risk Mitigants Summary</span>
            </h4>
            <div className="space-y-2">
              <Label htmlFor="risk-summary">Summary of Internal Controls</Label>
              <Textarea
                id="risk-summary"
                value={riskSummary.summary}
                onChange={(e) => setRiskSummary({...riskSummary, summary: e.target.value})}
                disabled={!canEditField('summary') || !isEditing}
                rows={4}
                placeholder="Summarize the internal controls for each FLU and highlight factors requiring escalation..."
              />
            </div>
          </div>
        )}

        <Separator />

        {/* Recommendation Section */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Recommendation</span>
          </h4>
          
          {/* HRA Recommendation */}
          {(userRole === 'hrs-analyst' || userRole === 'hrs-manager') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recommendation">HRA Recommendation</Label>
                <Select
                  value={riskSummary.recommendation}
                  onValueChange={(value) => setRiskSummary({...riskSummary, recommendation: value})}
                  disabled={!canEditField('recommendation') || !isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_factors">No factors impacting decision to retain client</SelectItem>
                    <SelectItem value="escalate_flu">Escalate to FLU Representative</SelectItem>
                    <SelectItem value="escalate_gfc">Escalate to GFC</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="cancel">Cancel Case</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(riskSummary.recommendation === 'escalate_flu' || riskSummary.recommendation === 'escalate_gfc') && (
                <div className="space-y-2">
                  <Label htmlFor="escalation-reason">Escalation Reason</Label>
                  <Select
                    value={riskSummary.escalationReason}
                    onValueChange={(value) => setRiskSummary({...riskSummary, escalationReason: value})}
                    disabled={!canEditField('escalationReason') || !isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_risk_attributes">High Number of Risk attributes</SelectItem>
                      <SelectItem value="specific_combination">Specific Combination of Risk Attributes</SelectItem>
                      <SelectItem value="additional_factors">Additional Risk Factors Present</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* FLU AML Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flu-aml-outcome">FLU AML Outcome</Label>
              <Select
                value={outcomes.fluAmlOutcome}
                onValueChange={(value) => setOutcomes({...outcomes, fluAmlOutcome: value})}
                disabled={!canEditField('fluAmlOutcome') || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retain">Retain</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gfc-outcome">GFC Outcome</Label>
              <Select
                value={outcomes.gfcOutcome}
                onValueChange={(value) => setOutcomes({...outcomes, gfcOutcome: value})}
                disabled={!canEditField('gfcOutcome') || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retain">Retain</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* TRMS Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>File TRMS</Label>
                <Switch
                  checked={riskSummary.fileTrms}
                  onCheckedChange={(value) => setRiskSummary({...riskSummary, fileTrms: value})}
                  disabled={!canEditField('fileTrms') || !isEditing}
                />
              </div>
              
              {riskSummary.fileTrms && (
                <div className="space-y-2">
                  <Label htmlFor="trms-number">TRMS Tracking Number</Label>
                  <Input
                    id="trms-number"
                    value={riskSummary.trmsTrackingNumber}
                    onChange={(e) => setRiskSummary({...riskSummary, trmsTrackingNumber: e.target.value})}
                    disabled={!canEditField('trmsTrackingNumber') || !isEditing}
                    placeholder="Enter TRMS tracking number"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Attestation Checkboxes - HRA Only */}
          {(userRole === 'hrs-analyst' || userRole === 'hrs-manager') && (
            <Card className="bg-slate-50 border-slate-200 mt-4">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="attestation-approved"
                      checked={attestation.approvedNoAdditional}
                      onCheckedChange={(checked) => 
                        setAttestation({...attestation, approvedNoAdditional: checked as boolean})
                      }
                      disabled={!canEdit || !isEditing}
                      className="mt-1"
                    />
                    <Label htmlFor="attestation-approved" className="text-sm cursor-pointer">
                      Risk factors have been approved as part of most recent refresh and/or client activity monitoring and no additional factors have been identified or have already been properly escalated
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="attestation-no-escalation"
                      checked={attestation.reviewedNoEscalation}
                      onCheckedChange={(checked) => 
                        setAttestation({...attestation, reviewedNoEscalation: checked as boolean})
                      }
                      disabled={!canEdit || !isEditing}
                      className="mt-1"
                    />
                    <Label htmlFor="attestation-no-escalation" className="text-sm cursor-pointer">
                      I have reviewed additional risk factors and/or triggers which have been identified and believe no further escalation is required
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="attestation-flu"
                      checked={attestation.reviewedEscalatedFLU}
                      onCheckedChange={(checked) => 
                        setAttestation({...attestation, reviewedEscalatedFLU: checked as boolean})
                      }
                      disabled={!canEdit || !isEditing}
                      className="mt-1"
                    />
                    <Label htmlFor="attestation-flu" className="text-sm cursor-pointer">
                      I have reviewed additional risk factors and/or triggers which have been identified and have further escalated to the FLU AML team
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="attestation-trms"
                      checked={attestation.reviewedEscalatedTRMS}
                      onCheckedChange={(checked) => 
                        setAttestation({...attestation, reviewedEscalatedTRMS: checked as boolean})
                      }
                      disabled={!canEdit || !isEditing}
                      className="mt-1"
                    />
                    <Label htmlFor="attestation-trms" className="text-sm cursor-pointer">
                      I have reviewed additional risk factors and/or triggers which have been identified and believe further escalation is required and TRMS has been filed
                    </Label>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="attestation-confirm"
                      checked={attestation.confirmDataReviewed}
                      onCheckedChange={(checked) => 
                        setAttestation({...attestation, confirmDataReviewed: checked as boolean})
                      }
                      disabled={!canEdit || !isEditing}
                      className="mt-1"
                    />
                    <Label htmlFor="attestation-confirm" className="text-sm cursor-pointer font-medium">
                      I confirm that all data has been reviewed and the responses to the above questions are accurate
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        {/* FLU AML Outcome */}
        {(userRole === 'flu-aml' || (userRole === 'hrs-analyst' || userRole === 'hrs-manager') && outcomes.fluAmlOutcome) && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>FLU AML Outcome</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flu-outcome">FLU AML Decision</Label>
                <Select
                  value={outcomes.fluAmlOutcome}
                  onValueChange={(value) => setOutcomes({...outcomes, fluAmlOutcome: value})}
                  disabled={userRole !== 'flu-aml' || !isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retain">Retain</SelectItem>
                    <SelectItem value="exit">Exit</SelectItem>
                    <SelectItem value="reject">Reject (send back to HRA Analyst)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>File TRMS</Label>
                  <Switch
                    checked={outcomes.fluAmlTrms}
                    onCheckedChange={(value) => setOutcomes({...outcomes, fluAmlTrms: value})}
                    disabled={userRole !== 'flu-aml' || !isEditing}
                  />
                </div>
                
                {outcomes.fluAmlTrms && (
                  <div className="space-y-2">
                    <Label htmlFor="flu-trms-number">TRMS Tracking Number</Label>
                    <Input
                      id="flu-trms-number"
                      value={outcomes.fluAmlTrmsNumber}
                      onChange={(e) => setOutcomes({...outcomes, fluAmlTrmsNumber: e.target.value})}
                      disabled={userRole !== 'flu-aml' || !isEditing}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GFC Outcome */}
        {(userRole === 'gfc' || (userRole !== 'gfc' && outcomes.gfcOutcome)) && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>GFC Outcome</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gfc-outcome">GFC Decision</Label>
                  <Select
                    value={outcomes.gfcOutcome}
                    onValueChange={(value) => setOutcomes({...outcomes, gfcOutcome: value})}
                    disabled={userRole !== 'gfc' || !isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retain">Retain</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                      <SelectItem value="reject">Reject (send back to HRA Analyst)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>File TRMS</Label>
                    <Switch
                      checked={outcomes.gfcTrms}
                      onCheckedChange={(value) => setOutcomes({...outcomes, gfcTrms: value})}
                      disabled={userRole !== 'gfc' || !isEditing}
                    />
                  </div>
                  
                  {outcomes.gfcTrms && (
                    <div className="space-y-2">
                      <Label htmlFor="gfc-trms-number">TRMS Tracking Number</Label>
                      <Input
                        id="gfc-trms-number"
                        value={outcomes.gfcTrmsNumber}
                        onChange={(e) => setOutcomes({...outcomes, gfcTrmsNumber: e.target.value})}
                        disabled={userRole !== 'gfc' || !isEditing}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Comments Section */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommentThread title="HRA Analyst Comments" roleFilter="analyst" />
            <CommentThread title="HRA Manager Comments" roleFilter="manager" />
            <CommentThread title="FLU AML Comments" roleFilter="flu aml" />
            <CommentThread title="GFC Comments" roleFilter="gfc" />
          </div>

          {/* Add New Comment */}
          <div className="space-y-2">
            <Label htmlFor="new-comment">Add Comment ({getRoleDisplay()})</Label>
            <div className="flex space-x-2">
              <Textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Add your comment as ${getRoleDisplay()}...`}
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Add Comment
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Attachments Section */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-2">
            <Paperclip className="h-4 w-4" />
            <span>Attachments</span>
          </h4>
          
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {attachment.size} • Uploaded by {attachment.uploadedBy} on {new Date(attachment.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Attachment
          </Button>
        </div>


    </div>
  );
}