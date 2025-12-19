package com.bofa.aml.hra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityResponse {
    private List<Activity> data;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Activity {
        private String id;
        private String action;
        private String user;
        private String userId;
        private LocalDateTime timestamp;
        private String status; // "escalated", "returned", "assigned", "completed", "bulk"
        private String caseId;
        private Map<String, Object> metadata;
    }
}
