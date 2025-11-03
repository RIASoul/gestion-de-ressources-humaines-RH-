package com.example.employee.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String position;
    private Long departmentId;
    private String departmentName;
    private LocalDate hireDate;

    // ✅ AJOUTER ces 2 lignes :
    private BigDecimal baseSalary;
    private Boolean hasSalaryRecord;
}