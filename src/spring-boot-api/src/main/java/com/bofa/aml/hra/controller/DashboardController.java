package com.bofa.aml.hra.controller;

import com.bofa.aml.hra.dto.response.*;
import com.bofa.aml.hra.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Dashboard APIs
 * Provides risk overview metrics, workflow distribution, and team capacity information
 */
@RestController
@RequestMapping("/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard metrics and analytics APIs")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/risk-overview")
    @Operation(summary = "Get risk overview metrics", 
               description = "Retrieves high-level risk metrics for the dashboard overview cards")
    public ResponseEntity<ApiResponse<RiskOverviewResponse>> getRiskOverview() {
        RiskOverviewResponse response = dashboardService.getRiskOverview();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/workflow-distribution")
    @Operation(summary = "Get workflow status distribution", 
               description = "Returns case count distribution across workflow statuses for pie chart visualization")
    public ResponseEntity<ApiResponse<WorkflowDistributionResponse>> getWorkflowDistribution() {
        WorkflowDistributionResponse response = dashboardService.getWorkflowDistribution();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/escalation-trends")
    @Operation(summary = "Get escalation trends", 
               description = "Weekly escalation patterns by destination role for trend analysis")
    public ResponseEntity<ApiResponse<EscalationTrendsResponse>> getEscalationTrends(
            @Parameter(description = "Number of weeks to retrieve") 
            @RequestParam(defaultValue = "4") int weeks) {
        EscalationTrendsResponse response = dashboardService.getEscalationTrends(weeks);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/turnaround-times")
    @Operation(summary = "Get turnaround time metrics", 
               description = "Average case processing times by role with target comparisons")
    public ResponseEntity<ApiResponse<TurnaroundTimesResponse>> getTurnaroundTimes() {
        TurnaroundTimesResponse response = dashboardService.getTurnaroundTimes();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recent-activity")
    @Operation(summary = "Get recent workflow activity", 
               description = "Recent case activities and workflow events across all users")
    public ResponseEntity<ApiResponse<RecentActivityResponse>> getRecentActivity(
            @Parameter(description = "Number of activities to retrieve") 
            @RequestParam(defaultValue = "10") int limit) {
        RecentActivityResponse response = dashboardService.getRecentActivity(limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/quick-actions")
    @Operation(summary = "Get role-specific quick actions", 
               description = "Returns action cards with counts based on user role")
    public ResponseEntity<ApiResponse<QuickActionsResponse>> getQuickActions(
            @Parameter(description = "User role: hra-analyst, hra-manager, flu-aml, gfc") 
            @RequestParam String userRole) {
        QuickActionsResponse response = dashboardService.getQuickActions(userRole);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/team-capacity")
    @Operation(summary = "Get team capacity overview", 
               description = "Team workload and capacity metrics (Manager and above only)")
    public ResponseEntity<ApiResponse<TeamCapacityResponse>> getTeamCapacity() {
        TeamCapacityResponse response = dashboardService.getTeamCapacity();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
