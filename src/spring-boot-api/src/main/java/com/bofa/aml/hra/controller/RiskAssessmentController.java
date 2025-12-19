package com.bofa.aml.hra.controller;

import com.bofa.aml.hra.dto.request.RiskSummaryRequest;
import com.bofa.aml.hra.dto.response.*;
import com.bofa.aml.hra.service.RiskAssessmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for Risk Assessment APIs
 * Manages customer information, risk factors, mitigants, and assessment summaries
 */
@RestController
@RequestMapping("/v1/risk-assessment")
@RequiredArgsConstructor
@Tag(name = "Risk Assessment", description = "Risk assessment and analysis APIs")
@CrossOrigin(origins = "*")
public class RiskAssessmentController {

    private final RiskAssessmentService riskAssessmentService;

    @GetMapping("/companies/search")
    @Operation(summary = "Search companies", 
               description = "Search companies for risk assessment")
    public ResponseEntity<ApiResponse<List<CompanySearchResult>>> searchCompanies(
            @Parameter(description = "Search query") 
            @RequestParam String query,
            @Parameter(description = "Line of Business filter") 
            @RequestParam(required = false) String lob) {
        List<CompanySearchResult> results = riskAssessmentService.searchCompanies(query, lob);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/customer/{clientId}")
    @Operation(summary = "Get customer information", 
               description = "Retrieve detailed customer information for risk assessment")
    public ResponseEntity<ApiResponse<CustomerInfoResponse>> getCustomerInfo(
            @Parameter(description = "Client ID") 
            @PathVariable String clientId) {
        CustomerInfoResponse response = riskAssessmentService.getCustomerInfo(clientId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/crr-factors/{caseId}")
    @Operation(summary = "Get CRR risk factors", 
               description = "Current and previous CRR risk factors comparison")
    public ResponseEntity<ApiResponse<CrrRiskFactorsResponse>> getCrrRiskFactors(
            @Parameter(description = "Case ID") 
            @PathVariable String caseId) {
        CrrRiskFactorsResponse response = riskAssessmentService.getCrrRiskFactors(caseId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/additional-factors/{caseId}")
    @Operation(summary = "Get additional risk factors", 
               description = "CAM, TRMS, and escalation information")
    public ResponseEntity<ApiResponse<AdditionalRiskFactorsResponse>> getAdditionalRiskFactors(
            @Parameter(description = "Case ID") 
            @PathVariable String caseId) {
        AdditionalRiskFactorsResponse response = riskAssessmentService.getAdditionalRiskFactors(caseId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/mitigants/{caseId}")
    @Operation(summary = "Get risk mitigants", 
               description = "Active risk mitigation controls and measures")
    public ResponseEntity<ApiResponse<RiskMitigantsResponse>> getRiskMitigants(
            @Parameter(description = "Case ID") 
            @PathVariable String caseId) {
        RiskMitigantsResponse response = riskAssessmentService.getRiskMitigants(caseId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/summary")
    @Operation(summary = "Submit risk summary", 
               description = "Submit or retrieve risk summary and final disposition")
    public ResponseEntity<ApiResponse<RiskSummaryResponse>> submitRiskSummary(
            @Valid @RequestBody RiskSummaryRequest request) {
        RiskSummaryResponse response = riskAssessmentService.submitRiskSummary(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
