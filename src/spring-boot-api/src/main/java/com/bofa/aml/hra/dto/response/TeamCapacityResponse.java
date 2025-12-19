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
public class TeamCapacityResponse {
    private List<Team> teams;
    private Summary summary;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Team {
        private String lob;
        private Integer totalAnalysts;
        private Integer activeCases;
        private Double avgCaseload;
        private Integer capacityUtilization;
        private String status; // "healthy", "at-capacity", "over-capacity"
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private Integer totalAnalysts;
        private Integer totalCases;
        private Integer avgUtilization;
    }
}
