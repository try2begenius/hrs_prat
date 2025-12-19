package com.bofa.aml.hra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TurnaroundTimesResponse {
    private List<TurnaroundMetric> data;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TurnaroundMetric {
        private String role;
        private Double avgDays;
        private Double target;
        private String status; // "on-target" or "over-target"
    }
}
