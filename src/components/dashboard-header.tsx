import { Bell, Search, Settings, User, Users, Shield, Building, AlertTriangle, ChevronDown, Eye, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { UserRole } from "../App";
import logoImage from "figma:asset/2c76721b87b8eeabab6d60aec171dec15f40d7d5.png";

interface DashboardHeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onPageChange: (page: string) => void;
}

export function DashboardHeader({ userRole, onRoleChange, onPageChange }: DashboardHeaderProps) {
  const roleDisplayMap = {
    'hrs-analyst': 'HRS Analyst',
    'hrs-manager': 'HRS Manager',
    'flu-aml': 'FLU AML Representative',
    'view-only': 'View Only'
  };

  return (
    <header className="border-b bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage}
              alt="Bank of America Logo"
              className="h-8 w-auto object-contain"
            />
            <div className="h-8 w-px bg-gray-300"></div>
          </div>
          <div>
            <h1 className="text-2xl font-medium text-primary">AML High Risk Summary Tool</h1>
            <p className="text-sm text-muted-foreground">Risk Management & Monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={userRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hrs-analyst">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>HRS Analyst</span>
                </div>
              </SelectItem>
              <SelectItem value="hrs-manager">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>HRS Manager</span>
                </div>
              </SelectItem>
              <SelectItem value="flu-aml">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>FLU AML Representative</span>
                </div>
              </SelectItem>
              <SelectItem value="view-only">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View Only</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="h-8 w-px bg-gray-300"></div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange("workflows")}
            className="hover:bg-muted"
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange("control-management")}
            className="hover:bg-muted"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <div className="h-8 w-px bg-gray-300"></div>
          
          <div className="text-right">
            <p className="font-medium">Sarah Johnson</p>
            <p className="text-sm text-muted-foreground">Investment Banking</p>
          </div>
        </div>
      </div>
    </header>
  );
}