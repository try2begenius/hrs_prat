package com.bofa.aml.hra.service;

import com.bofa.aml.hra.dto.response.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service layer for Dashboard business logic
 * Contains mock data - replace with actual database calls in production
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    public RiskOverviewResponse getRiskOverview() {
        log.debug("Fetching risk overview metrics");
        
        return RiskOverviewResponse.builder()
                .highRiskClients(RiskOverviewResponse.MetricData.builder()
                        .value(247)
                        .change("+12%")
                        .changeType("increase")
                        .description("Clients with risk score > 80")
                        .build())
                .activeInvestigations(RiskOverviewResponse.MetricData.builder()
                        .value(18)
                        .change("-3%")
                        .changeType("decrease")
                        .description("Ongoing compliance reviews")
                        .build())
                .totalClients(RiskOverviewResponse.MetricData.builder()
                        .value(12847)
                        .change("+5%")
                        .changeType("increase")
                        .description("All monitored entities")
                        .build())
                .highRiskJurisdictions(RiskOverviewResponse.MetricData.builder()
                        .value(23)
                        .change("+2")
                        .changeType("increase")
                        .description("Countries with elevated risk")
                        .build())
                .build();
    }

    public WorkflowDistributionResponse getWorkflowDistribution() {
        log.debug("Fetching workflow distribution");
        
        List<WorkflowDistributionResponse.WorkflowStatus> statuses = Arrays.asList(
                WorkflowDistributionResponse.WorkflowStatus.builder()
                        .status("Assigned").count(45).color("#3b82f6").build(),
                WorkflowDistributionResponse.WorkflowStatus.builder()
                        .status("In Progress").count(32).color("#eab308").build(),
                WorkflowDistributionResponse.WorkflowStatus.builder()
                        .status("Escalated").count(18).color("#f97316").build(),
                WorkflowDistributionResponse.WorkflowStatus.builder()
                        .status("Returned").count(12).color("#ef4444").build(),
                WorkflowDistributionResponse.WorkflowStatus.builder()
                        .status("Completed").count(89).color("#22c55e").build()
        );
        
        return WorkflowDistributionResponse.builder().data(statuses).build();
    }

    public EscalationTrendsResponse getEscalationTrends(int weeks) {
        log.debug("Fetching escalation trends for {} weeks", weeks);
        
        List<EscalationTrendsResponse.WeeklyTrend> trends = Arrays.asList(
                EscalationTrendsResponse.WeeklyTrend.builder()
                        .week("Week 1").toManager(12).toFLU(8).toGFC(4).build(),
                EscalationTrendsResponse.WeeklyTrend.builder()
                        .week("Week 2").toManager(15).toFLU(11).toGFC(6).build(),
                EscalationTrendsResponse.WeeklyTrend.builder()
                        .week("Week 3").toManager(18).toFLU(9).toGFC(8).build(),
                EscalationTrendsResponse.WeeklyTrend.builder()
                        .week("Week 4").toManager(14).toFLU(12).toGFC(5).build()
        );
        
        return EscalationTrendsResponse.builder().data(trends).build();
    }

    public TurnaroundTimesResponse getTurnaroundTimes() {
        log.debug("Fetching turnaround time metrics");
        
        List<TurnaroundTimesResponse.TurnaroundMetric> metrics = Arrays.asList(
                TurnaroundTimesResponse.TurnaroundMetric.builder()
                        .role("HRA Analyst").avgDays(2.4).target(3.0).status("on-target").build(),
                TurnaroundTimesResponse.TurnaroundMetric.builder()
                        .role("HRA Manager").avgDays(1.8).target(2.0).status("on-target").build(),
                TurnaroundTimesResponse.TurnaroundMetric.builder()
                        .role("FLU AML").avgDays(4.2).target(5.0).status("on-target").build(),
                TurnaroundTimesResponse.TurnaroundMetric.builder()
                        .role("GFC").avgDays(3.6).target(4.0).status("on-target").build()
        );
        
        return TurnaroundTimesResponse.builder().data(metrics).build();
    }

    public RecentActivityResponse getRecentActivity(int limit) {
        log.debug("Fetching {} recent activities", limit);
        
        List<RecentActivityResponse.Activity> activities = Arrays.asList(
                RecentActivityResponse.Activity.builder()
                        .id("act-001")
                        .action("Case HRA-2024-0156 escalated to Manager")
                        .user("Sarah Johnson")
                        .userId("USR-001")
                        .timestamp(LocalDateTime.now().minusMinutes(2))
                        .status("escalated")
                        .caseId("HRA-2024-0156")
                        .build(),
                RecentActivityResponse.Activity.builder()
                        .id("act-002")
                        .action("Case HRA-2024-0143 returned for corrections")
                        .user("Michael Chen")
                        .userId("USR-002")
                        .timestamp(LocalDateTime.now().minusMinutes(15))
                        .status("returned")
                        .caseId("HRA-2024-0143")
                        .build(),
                RecentActivityResponse.Activity.builder()
                        .id("act-003")
                        .action("Bulk reassignment: 12 cases to Investment Banking team")
                        .user("Manager - David Kim")
                        .userId("USR-003")
                        .timestamp(LocalDateTime.now().minusHours(2))
                        .status("bulk")
                        .metadata(Map.of("caseCount", 12, "lob", "Investment Banking"))
                        .build()
        );
        
        return RecentActivityResponse.builder()
                .data(activities.subList(0, Math.min(limit, activities.size())))
                .build();
    }

    public QuickActionsResponse getQuickActions(String userRole) {
        log.debug("Fetching quick actions for role: {}", userRole);
        
        List<QuickActionsResponse.Action> actions;
        
        switch (userRole.toLowerCase()) {
            case "hra-analyst":
                actions = Arrays.asList(
                        QuickActionsResponse.Action.builder()
                                .label("My Active Cases").count(24).icon("Users").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Ready to Escalate").count(8).icon("ArrowUpCircle").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Returned for Review").count(3).icon("RotateCcw").build()
                );
                break;
            case "hra-manager":
                actions = Arrays.asList(
                        QuickActionsResponse.Action.builder()
                                .label("Team Cases").count(156).icon("Users").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Pending Approvals").count(18).icon("CheckCircle").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Escalation Requests").count(12).icon("ArrowUpCircle").build()
                );
                break;
            case "flu-aml":
                actions = Arrays.asList(
                        QuickActionsResponse.Action.builder()
                                .label("AML Cases").count(34).icon("AlertTriangle").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Under Review").count(12).icon("Clock").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Completed").count(89).icon("CheckCircle").build()
                );
                break;
            case "gfc":
                actions = Arrays.asList(
                        QuickActionsResponse.Action.builder()
                                .label("GFC Cases").count(28).icon("ArrowUpCircle").build(),
                        QuickActionsResponse.Action.builder()
                                .label("High Priority").count(8).icon("AlertTriangle").build(),
                        QuickActionsResponse.Action.builder()
                                .label("Disposition Ready").count(23).icon("CheckCircle").build()
                );
                break;
            default:
                actions = Collections.emptyList();
        }
        
        return QuickActionsResponse.builder()
                .userRole(userRole)
                .actions(actions)
                .build();
    }

    public TeamCapacityResponse getTeamCapacity() {
        log.debug("Fetching team capacity overview");
        
        List<TeamCapacityResponse.Team> teams = Arrays.asList(
                TeamCapacityResponse.Team.builder()
                        .lob("Investment Banking")
                        .totalAnalysts(8)
                        .activeCases(156)
                        .avgCaseload(19.5)
                        .capacityUtilization(78)
                        .status("healthy")
                        .build(),
                TeamCapacityResponse.Team.builder()
                        .lob("Commercial Banking")
                        .totalAnalysts(6)
                        .activeCases(143)
                        .avgCaseload(23.8)
                        .capacityUtilization(95)
                        .status("at-capacity")
                        .build()
        );
        
        TeamCapacityResponse.Summary summary = TeamCapacityResponse.Summary.builder()
                .totalAnalysts(24)
                .totalCases(587)
                .avgUtilization(82)
                .build();
        
        return TeamCapacityResponse.builder()
                .teams(teams)
                .summary(summary)
                .build();
    }
}
