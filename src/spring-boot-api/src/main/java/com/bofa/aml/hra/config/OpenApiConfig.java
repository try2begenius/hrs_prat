package com.bofa.aml.hra.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger Configuration for API Documentation
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AML High Risk Assessment API")
                        .version("1.0.0")
                        .description("Comprehensive REST API for AML High Risk Assessment Tool - " +
                                "providing risk analytics, case management, workflow processing, " +
                                "and compliance reporting capabilities")
                        .contact(new Contact()
                                .name("Bank of America AML Team")
                                .email("aml-support@bofa.com")
                                .url("https://www.bankofamerica.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://www.bankofamerica.com/terms")))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token for authentication")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
