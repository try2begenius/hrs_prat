package com.bofa.aml.hra.controller;

import com.bofa.aml.hra.dto.request.*;
import com.bofa.aml.hra.dto.response.*;
import com.bofa.aml.hra.service.WorkflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * REST Controller for Workflow APIs
 * Handles workbasket management, case assignment, escalation, and bulk operations
 */
@RestController
@RequestMapping("/v1/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflows", description = "Workflow management and case processing APIs")
@CrossOrigin(origins = "*")
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping("/workbasket/my-cases")
    @Operation(summary = "Get my workbasket cases", 
               description = "Retrieve cases assigned to current user")
    public ResponseEntity<ApiResponse<WorkbasketResponse>> getMyWorkbasket(
            @Parameter(description = "Filter: all, active, escalations, completed, returned") 
            @RequestParam(defaultValue = "all") String filter,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        WorkbasketResponse response = workflowService.getMyWorkbasket(filter, limit, offset);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/work-queue")
    @Operation(summary = "Get work queue", 
               description = "Get unassigned cases in the work queue (Manager view)")
    public ResponseEntity<ApiResponse<WorkQueueResponse>> getWorkQueue(
            @Parameter(description = "Line of Business filter") 
            @RequestParam(required = false) String lob,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        WorkQueueResponse response = workflowService.getWorkQueue(lob, limit, offset);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/get-next-case")
    @Operation(summary = "Get next case (FIFO)", 
               description = "Assign next available case to analyst using FIFO logic")
    public ResponseEntity<ApiResponse<CaseAssignmentResponse>> getNextCase() {
        CaseAssignmentResponse response = workflowService.getNextCase();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/escalate")
    @Operation(summary = "Escalate case", 
               description = "Escalate case to Manager, FLU AML, or GFC")
    public ResponseEntity<ApiResponse<EscalationResponse>> escalateCase(
            @Valid @RequestBody EscalateRequest request) {
        EscalationResponse response = workflowService.escalateCase(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/return")
    @Operation(summary = "Return case", 
               description = "Return case to analyst for corrections")
    public ResponseEntity<ApiResponse<ReturnCaseResponse>> returnCase(
            @Valid @RequestBody ReturnCaseRequest request) {
        ReturnCaseResponse response = workflowService.returnCase(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/bulk-reassign")
    @Operation(summary = "Bulk reassignment", 
               description = "Reassign multiple cases to different analyst or LOB")
    public ResponseEntity<ApiResponse<BulkReassignmentResponse>> bulkReassign(
            @Valid @RequestBody BulkReassignRequest request) {
        BulkReassignmentResponse response = workflowService.bulkReassign(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/disposition")
    @Operation(summary = "Submit disposition", 
               description = "Submit final disposition for escalated case (Manager/FLU/GFC)")
    public ResponseEntity<ApiResponse<DispositionResponse>> submitDisposition(
            @Valid @RequestBody DispositionRequest request) {
        DispositionResponse response = workflowService.submitDisposition(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
