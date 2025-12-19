import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { 
  UserPlus, 
  Users,
  ArrowRight,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { cn } from "./ui/utils";

interface BulkOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: 'hrs-analyst' | 'hrs-manager' | 'flu-aml' | 'view-only';
  currentUser: any;
  tableType: 'workbasket' | 'workqueue';
  selectedCases: string[];
}



interface BulkUser {
  id: string;
  name: string;
  role: string;
  lob: string;
  activeCase: number;
  capacity: number;
  availability: 'available' | 'busy' | 'unavailable';
}

export function BulkOperationsDialog({ 
  open, 
  onOpenChange, 
  userRole, 
  currentUser, 
  tableType,
  selectedCases = [] 
}: BulkOperationsDialogProps) {
  const [targetUser, setTargetUser] = useState("");
  const [reassignmentReason, setReassignmentReason] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // Get operation type based on table type and user role
  const getOperationType = () => {
    // Always use 'Assign' for bulk operations
    return 'Assign';
  };

  // Mock available users for reassignment
  const availableUsers: BulkUser[] = [
    { id: 'analyst1', name: 'Sarah Johnson', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 12, capacity: 20, availability: 'available' },
    { id: 'analyst2', name: 'Michael Chen', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 8, capacity: 20, availability: 'available' },
    { id: 'analyst3', name: 'Emily Rodriguez', role: 'HRA Analyst', lob: 'Private Banking', activeCase: 15, capacity: 20, availability: 'busy' },
    { id: 'analyst4', name: 'Alex Thompson', role: 'HRA Analyst', lob: 'Commercial Banking', activeCase: 6, capacity: 20, availability: 'available' },
    { id: 'analyst5', name: 'Jennifer Liu', role: 'HRA Analyst', lob: 'Investment Banking', activeCase: 4, capacity: 20, availability: 'available' },
    { id: 'analyst6', name: 'Marcus Williams', role: 'HRA Analyst', lob: 'Wealth Management', activeCase: 18, capacity: 20, availability: 'busy' },
    { id: 'manager1', name: 'David Kim', role: 'HRA Manager', lob: 'All LOBs', activeCase: 5, capacity: 10, availability: 'available' },
    { id: 'flu1', name: 'Lisa Wang', role: 'FLU AML', lob: 'All LOBs', activeCase: 8, capacity: 15, availability: 'available' },
    { id: 'gfc1', name: 'Robert Martinez', role: 'GFC', lob: 'All LOBs', activeCase: 12, capacity: 20, availability: 'available' }
  ];

  const operationType = getOperationType();

  const handleBulkOperation = () => {
    if (selectedCases.length === 0) {
      toast.error("Please select at least one case from the table");
      return;
    }

    if (!targetUser) {
      toast.error(`Please select a user to ${operationType.toLowerCase()} cases to`);
      return;
    }

    const user = availableUsers.find(u => u.id === targetUser);
    toast.success(`${selectedCases.length} cases ${operationType.toLowerCase()}d to ${user?.name}`);
    
    // Reset form and close dialog
    setTargetUser("");
    setReassignmentReason("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setTargetUser("");
    setReassignmentReason("");
    onOpenChange(false);
  };



  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-orange-600';
      case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCapacityColor = (activeCase: number, capacity: number) => {
    const percentage = (activeCase / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };



  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Bulk Operations</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {selectedCases.length > 0 ? (
            <>
              {/* Selected Cases Summary */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="font-medium text-primary">Selected Cases</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedCases.length} case{selectedCases.length !== 1 ? 's' : ''} selected from {tableType === 'workbasket' ? 'your workbasket' : 'work queue'} for {operationType.toLowerCase()}ment
                </p>
                {selectedCases.length <= 5 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedCases.map((caseId) => (
                      <Badge key={caseId} variant="outline" className="text-xs">
                        {caseId}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="target-user">{operationType} To</Label>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between"
                      >
                        {targetUser
                          ? availableUsers.find((user) => user.id === targetUser)?.name
                          : "Search and select user..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search user..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {availableUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.name}
                                disabled={user.availability === 'unavailable'}
                                onSelect={() => {
                                  setTargetUser(user.id);
                                  setComboboxOpen(false);
                                }}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center space-x-2">
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      targetUser === user.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">({user.role})</span>
                                    <p className="text-xs text-muted-foreground">{user.lob}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <span className={`text-xs ${getCapacityColor(user.activeCase, user.capacity)}`}>
                                    {user.activeCase}/{user.capacity}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getAvailabilityColor(user.availability)}`}
                                  >
                                    {user.availability}
                                  </Badge>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="reassignment-reason">Reason</Label>
                  <Textarea
                    id="reassignment-reason"
                    placeholder={`Explain the reason for bulk ${operationType.toLowerCase()}ment...`}
                    value={reassignmentReason}
                    onChange={(e) => setReassignmentReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleBulkOperation}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {operationType} {selectedCases.length} Case{selectedCases.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No cases selected</p>
              <p className="text-sm text-muted-foreground">
                Please select one or more cases from the {tableType === 'workbasket' ? 'workbasket' : 'work queue'} table to begin bulk {operationType.toLowerCase()}ment
              </p>
              <Button variant="outline" onClick={handleClose} className="mt-4">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}