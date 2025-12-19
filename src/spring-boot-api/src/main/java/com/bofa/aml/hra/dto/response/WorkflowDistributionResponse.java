package com.bofa.aml.hra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for Workflow Distribution
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowDistributionResponse {
    
    private List<WorkflowStatus> data;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkflowStatus {
        private String status;
        private Integer count;
        private String color;
    }
}
