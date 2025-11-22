# HR Management System - Microservices Architecture

> Complete HR Management System built with Spring Boot 3, Spring Cloud, and Angular 17

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-Educational-yellow.svg)]()

## 📋 Overview

Professional HR Management System featuring employee management, leave tracking, payroll automation, and role-based dashboards. Built with modern microservices architecture using Spring Cloud ecosystem (Eureka, Config Server, Gateway) and Angular 17 frontend.

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication with 24-hour expiration
- Role-based access control (Admin, Employee)
- Protected routes with Angular guards
- Secure password encryption with BCrypt

### 👥 Employee Management
- Complete CRUD operations for employees
- Department and position management
- Employee search and filtering
- Position history tracking
- Statistical dashboards

### 🏖️ Leave Management
- Employee leave requests (Vacation, Sick, Unpaid, Maternity, Paternity)
- Admin approval workflow
- Leave status tracking (Pending, Approved, Rejected)
- Leave history and balance

### 💰 Payroll Management
- Salary record management
- Automatic payslip generation
- Salary history tracking
- Detailed salary breakdowns (base, bonuses, deductions)

### 📊 Dashboards
- **Admin Dashboard**: Company overview, statistics, pending approvals
- **Employee Dashboard**: Personal information, leave balance, payslips

## 🏗️ Architecture

### Microservices Stack

| Service | Port | Description |
|---------|------|-------------|
| **Discovery Server** | 8761 | Eureka service registry |
| **Config Server** | 8888 | Centralized configuration |
| **Gateway Server** | 8222 | API Gateway with routing & CORS |
| **Auth Service** | 8085 | Authentication & JWT |
| **Employee Service** | 8081 | Employee & department management |
| **Conge Service** | 8083 | Leave management |
| **Paie Service** | 8082 | Payroll management |
| **Frontend** | 4200 | Angular 17 SPA |

### API Gateway Routing

```
http://localhost:8222/api/auth/**       → auth-service
http://localhost:8222/api/employees/**  → employee
http://localhost:8222/api/departments/** → employee
http://localhost:8222/api/conges/**     → conge-service
http://localhost:8222/api/paie/**       → paie-service
```

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+
- Angular CLI 17+

### Setup Database

```sql
CREATE DATABASE auth_db;
CREATE DATABASE employee_db;
CREATE DATABASE conge_db;
CREATE DATABASE paie_db;

CREATE USER 'employee_user'@'localhost' IDENTIFIED BY 'motdepasse123';
GRANT ALL PRIVILEGES ON auth_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON employee_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON conge_db.* TO 'employee_user'@'localhost';
FLUSH PRIVILEGES;
```

### Start Backend Services (in order)

```bash
# 1. Discovery Server
cd backend/discovery-server/discovery-server && mvn spring-boot:run

# 2. Config Server
cd backend/config-server && mvn spring-boot:run

# 3. Gateway Server
cd backend/gateway-server && mvn spring-boot:run

# 4. Microservices (any order)
cd backend/auth-service && mvn spring-boot:run
cd backend/employee/employee/employee && mvn spring-boot:run
cd backend/conge/conge/conge && mvn spring-boot:run
cd backend/paie/paie/paie && mvn spring-boot:run
```

### Start Frontend

```bash
cd frontend/rh-portal
npm install
ng serve
```

Access at http://localhost:4200

### Default Credentials

- **Admin**: admin@rh.com / admin123

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Architecture Overview](./ARCHITECTURE.md)** - System design and components
- **[Configuration Guide](./CONFIGURATION.md)** - Setup and configuration details
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Best Practices](./BEST_PRACTICES.md)** - Development guidelines

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Cloud**: Spring Cloud 2023.0.3 (Eureka, Config, Gateway)
- **Security**: JWT (jjwt 0.12.6), Spring Security
- **Database**: MySQL 8 with JPA/Hibernate
- **Build Tool**: Maven
- **Java**: 17

### Frontend
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with Guards
- **Forms**: Reactive Forms

### DevOps
- **Version Control**: Git
- **API Testing**: Postman, cURL
- **Monitoring**: Spring Boot Actuator, Eureka Dashboard

## 📁 Project Structure

```
├── backend/
│   ├── discovery-server/      # Eureka Server
│   ├── config-server/         # Config Server
│   ├── config-repo/           # YAML configurations
│   ├── gateway-server/        # API Gateway
│   ├── auth-service/          # Authentication
│   ├── employee/              # Employee management
│   ├── conge/                 # Leave management
│   ├── paie/                  # Payroll
│   └── notification/          # Notifications (TBD)
├── frontend/
│   └── rh-portal/
│       └── src/
│           └── app/
│               ├── core/      # Services, guards, models
│               ├── shared/    # Shared components
│               ├── auth/      # Authentication pages
│               ├── admin/     # Admin dashboard
│               └── employee/  # Employee dashboard
├── ARCHITECTURE.md
├── CONFIGURATION.md
├── API_DOCUMENTATION.md
├── BEST_PRACTICES.md
└── QUICK_START.md
```

## 🧪 Testing

### Test Auth Endpoint

```bash
curl -X POST http://localhost:8222/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rh.com","password":"admin123"}'
```

### Test Employee Endpoint

```bash
curl http://localhost:8222/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Verify Service Registration

Open http://localhost:8761 to see all registered services.

## 🔧 Configuration

Configuration is centralized in `backend/config-repo/`:
- `gateway-server.yml` - Gateway routes and CORS
- `auth-service.yml` - Auth and JWT configuration
- `employee.yml` - Employee service configuration
- `conge-service.yml` - Leave service configuration
- `paie-service.yml` - Payroll service configuration

## 🐛 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Service not in Eureka | Check Discovery Server is running first |
| 503 from Gateway | Verify service is UP in Eureka dashboard |
| CORS errors | Check Gateway CorsConfig is present |
| JWT errors | Verify jwt.secret in auth-service.yml |
| Database connection | Check MySQL is running on port 3361 |

See [QUICK_START.md](./QUICK_START.md) for detailed troubleshooting.

## 📈 Features Roadmap

- [x] JWT Authentication
- [x] Role-based access control
- [x] Employee CRUD operations
- [x] Leave management workflow
- [x] Payroll management
- [x] Gateway routing
- [x] Centralized configuration
- [ ] Real-time notifications (WebSocket)
- [ ] Document management
- [ ] Performance reviews
- [ ] Reporting & analytics
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 👥 Contributing

This is an educational project. Feel free to fork and customize for your needs.

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

Built with modern enterprise patterns and best practices:
- Microservices Architecture
- API Gateway Pattern
- Service Discovery
- Centralized Configuration
- JWT Authentication
- Clean Architecture
- RESTful API Design

---

Made with ❤️ using Spring Boot and Angular
