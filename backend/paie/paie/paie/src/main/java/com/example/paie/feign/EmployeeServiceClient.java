package com.example.paie.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employee-service", url = "http://localhost:8081")
public interface EmployeeServiceClient {

    @GetMapping("/api/employees/{employeeId}/exists")
    Boolean checkEmployeeExists(@PathVariable Long employeeId);
}