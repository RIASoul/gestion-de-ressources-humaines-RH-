# gestion-de-ressources-humaines-RH-
Système de gestion RH basé sur une architecture microservices (Spring Boot, Spring Cloud) avec un front Angular moderne. Gestion des employés, congés et paie, authentification JWT, dashboards Admin/Employé, intégration Spring Batch et Eureka pour une solution scalable et professionnelle.

🚀 Main Features
🔑 Authentication & Security

JWT-based authentication (Spring Security + Angular Guard).

Role management (Admin, Employee) with restricted access to dashboards.

Login / Register interfaces built using Angular Material.

👥 Employee Management

CRUD operations on employees (add, edit, delete, list).

Department and role assignment for each employee.

Real-time synchronization with the Employee microservice (Spring Boot + MySQL).

🏖️ Leave (Congé) Management

Employees can request leaves.

Admins validate or reject leave requests.

Status tracking and automatic notifications.

💰 Payroll Automation

Payroll microservice integrated with Spring Batch for automatic monthly payslip generation.

Secure visualization of salary history for each employee.

📊 Admin & Employee Dashboards

Admin Dashboard: HR overview (total employees, departments, pending leaves, generated payslips).
🏗️ Architecture Overview
| Service                  | Description                          |
| ------------------------ | ------------------------------------ |
| **Config Server**        | Centralized configuration management |
| **Eureka Server**        | Service discovery                    |
| **API Gateway**          | Routing and authentication filtering |
| **Employee Service**     | CRUD management of employee data     |
| **Conge Service**        | Leave management                     |
| **Paie Service**         | Payroll & Spring Batch processing    |
| **Notification Service** | Email and message notifications      |

All microservices communicate through Spring Cloud OpenFeign and are registered in Eureka.

🔸 Frontend (Angular)

Angular 20 + TypeScript

Angular Material UI

RxJS and Reactive Forms

Modular structure (auth/, admin/, employee/)

Environment configuration for API Gateway integration

Dashboard UX inspired by enterprise HR systems

🧰 Technologies Used
| Category           | Stack                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Frontend**       | Angular 20, TypeScript, Angular Material, RxJS, Flex Layout                              |
| **Backend**        | Spring Boot 3, Spring Cloud (Eureka, Config, Gateway, Feign, Resilience4J), Spring Batch |
| **Database**       | MySQL                                                                                    |
| **Security**       | JWT, Spring Security                                                                     |
| **DevOps / Tools** | Maven, Postman, VS Code / IntelliJ, npm, PowerShell                                      |
| **Architecture**   | Microservices, RESTful API, Clean Architecture                                           |



Built with Angular Material, Flex Layout, and responsive design for professional UX.
