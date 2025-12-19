# AML High Risk Assessment API - Spring Boot

## Overview
Spring Boot REST API implementation for the AML High Risk Assessment Tool based on the comprehensive API specifications.

## Technology Stack
- **Java**: 17+
- **Spring Boot**: 3.2.0
- **Spring Web**: RESTful API development
- **Spring Data JPA**: Data persistence
- **Lombok**: Reduce boilerplate code
- **SpringDoc OpenAPI**: API documentation (Swagger UI)
- **Maven**: Build tool

## Project Structure
```
src/main/java/com/bofa/aml/hra/
├── AmlHraApplication.java              # Main Spring Boot Application
├── config/                              # Configuration classes
│   ├── CorsConfig.java                 # CORS configuration
│   ├── OpenApiConfig.java              # Swagger/OpenAPI configuration
│   └── SecurityConfig.java             # Security configuration
├── controller/                          # REST Controllers
│   ├── DashboardController.java
│   ├── RiskAssessmentController.java
│   ├── PopulationController.java
│   ├── CaseCreationController.java
│   ├── WorkflowController.java
│   └── ReportsController.java
├── service/                             # Business logic layer
│   ├── DashboardService.java
│   ├── RiskAssessmentService.java
│   ├── PopulationService.java
│   ├── CaseCreationService.java
│   ├── WorkflowService.java
│   └── ReportsService.java
├── dto/                                 # Data Transfer Objects
│   ├── request/                         # Request DTOs
│   └── response/                        # Response DTOs
├── model/                               # Entity/Domain models
├── repository/                          # Data access layer
├── exception/                           # Custom exceptions
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── ValidationException.java
└── util/                                # Utility classes
    └── ResponseUtil.java
```

## API Base URL
```
http://localhost:8080/api/v1
```

## Endpoints Summary

### Dashboard APIs (7 endpoints)
- `GET /api/v1/dashboard/risk-overview` - Risk Overview Metrics
- `GET /api/v1/dashboard/workflow-distribution` - Workflow Status Distribution
- `GET /api/v1/dashboard/escalation-trends` - Escalation Trends
- `GET /api/v1/dashboard/turnaround-times` - Turnaround Time Metrics
- `GET /api/v1/dashboard/recent-activity` - Recent Workflow Activity
- `GET /api/v1/dashboard/quick-actions` - Role-Specific Quick Actions
- `GET /api/v1/dashboard/team-capacity` - Team Capacity Overview

### Risk Assessment APIs (6 endpoints)
- `GET /api/v1/risk-assessment/companies/search` - Company Search
- `GET /api/v1/risk-assessment/customer/{clientId}` - Customer Information
- `GET /api/v1/risk-assessment/crr-factors/{caseId}` - CRR Risk Factors
- `GET /api/v1/risk-assessment/additional-factors/{caseId}` - Additional Risk Factors
- `GET /api/v1/risk-assessment/mitigants/{caseId}` - Risk Mitigants
- `POST /api/v1/risk-assessment/summary` - Risk Summary Assessment

### Population Identification APIs (4 endpoints)
- `GET /api/v1/population/overview` - Population Overview Stats
- `GET /api/v1/population/criteria-matrix` - Criteria Matrix
- `GET /api/v1/population/cases` - HRA Case Tracking
- `POST /api/v1/population/escalations` - Client Escalation Submit

### Case Creation APIs (5 endpoints)
- `GET /api/v1/cases/dashboard` - Case Processing Dashboard
- `GET /api/v1/cases/clients/search` - Client Search
- `POST /api/v1/cases/manual` - Create Manual Case
- `POST /api/v1/cases/bulk-upload` - Bulk Case Upload
- `GET /api/v1/cases/bulk-jobs/{jobId}` - Bulk Job Status

### Workflow APIs (7 endpoints)
- `GET /api/v1/workflows/workbasket/my-cases` - My Workbasket
- `GET /api/v1/workflows/work-queue` - Work Queue
- `POST /api/v1/workflows/get-next-case` - Get Next Case (FIFO)
- `POST /api/v1/workflows/escalate` - Escalate Case
- `POST /api/v1/workflows/return` - Return Case
- `POST /api/v1/workflows/bulk-reassign` - Bulk Reassignment
- `POST /api/v1/workflows/disposition` - Submit Disposition

### Reports APIs (6 endpoints)
- `GET /api/v1/reports/operational` - Operational Reporting Dashboard
- `GET /api/v1/reports/spi-performance` - SPI Performance Metrics
- `GET /api/v1/reports/available-reports` - HRA Reports Table
- `POST /api/v1/reports/generate` - Generate Custom Report
- `GET /api/v1/reports/client-type-analysis` - Client Type Analysis
- `GET /api/v1/reports/jurisdiction-risk` - Jurisdiction Risk Map

## Running the Application

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Build
```bash
mvn clean install
```

### Run
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation
Once the application is running, access Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## Configuration
Edit `src/main/resources/application.yml` for:
- Server port
- Database connection
- JWT secret
- CORS settings
- Logging levels

## Security
- OAuth 2.0 Bearer Token authentication
- Role-based access control (RBAC)
- Roles: HRA_ANALYST, HRA_MANAGER, FLU_AML, GFC

## Response Format
All API responses follow this standard format:
```json
{
  "data": { ... },
  "timestamp": "2024-11-10T10:30:00Z",
  "status": "success"
}
```

Error responses:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": []
  },
  "timestamp": "2024-11-10T10:30:00Z",
  "status": "error"
}
```

## Development Notes
- All mock data is provided in the service layer
- Replace mock implementations with actual database calls
- Implement proper security with Spring Security
- Add validation annotations to DTOs
- Implement audit logging
- Add caching where appropriate

## License
Bank of America - Internal Use Only
