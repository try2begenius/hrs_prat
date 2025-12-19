import { AllocationOverviewCards } from "./allocation-overview-cards";
import { AllocationAlgorithmsChart } from "./allocation-algorithms-chart";
import { TradeAllocationTable } from "./trade-allocation-table";
import { AllocationScenariosAnalysis } from "./allocation-scenarios-analysis";

export function AllocationDashboardWidget() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-primary">Trade Allocation Management</h2>
          <p className="text-muted-foreground">Monitor and manage trade allocations across all accounts and scenarios</p>
        </div>
      </div>
      
      <AllocationOverviewCards />
      <AllocationAlgorithmsChart />
      <AllocationScenariosAnalysis />
      <TradeAllocationTable />
    </div>
  );
}