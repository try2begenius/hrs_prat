import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PopulationIdentificationOverview } from "./population-identification-overview";
import { PopulationCriteriaMatrix } from "./population-criteria-matrix";
import { ClientEscalationForm } from "./client-escalation-form";
import { HRACaseTracking } from "./hra-case-tracking";

export function PopulationIdentificationWidget() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-primary">High-Risk Assessment Population Identification</h2>
          <p className="text-muted-foreground">Systematic identification and management of clients eligible for monthly HRA assessments</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="criteria">Criteria Matrix</TabsTrigger>
          <TabsTrigger value="cases">Case Tracking</TabsTrigger>
          <TabsTrigger value="escalations">Escalations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <PopulationIdentificationOverview />
        </TabsContent>
        
        <TabsContent value="criteria" className="space-y-6">
          <PopulationCriteriaMatrix />
        </TabsContent>
        
        <TabsContent value="cases" className="space-y-6">
          <HRACaseTracking />
        </TabsContent>
        
        <TabsContent value="escalations" className="space-y-6">
          <ClientEscalationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}