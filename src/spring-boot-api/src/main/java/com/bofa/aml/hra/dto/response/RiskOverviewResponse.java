package com.bofa.aml.hra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for Risk Overview Metrics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskOverviewResponse {
    
    private MetricData highRiskClients;
    private MetricData activeInvestigations;
    private MetricData totalClients;
    private MetricData highRiskJurisdictions;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricData {
        private Integer value;
        private String change;
        private String changeType; // "increase" or "decrease"
        private String description;
    }
}
