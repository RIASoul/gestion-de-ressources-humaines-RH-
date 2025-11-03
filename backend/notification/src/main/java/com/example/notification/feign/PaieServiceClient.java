package com.example.notification.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "paie-service", url = "http://localhost:8082/api/paie")
public interface PaieServiceClient {

    @GetMapping("/salaires/employee/{employeeId}/salaire-base")
    Double getSalaireBase(@PathVariable("employeeId") Long employeeId);
}
