# HR Management System - Microservices Architecture

## 📋 Architecture Overview

This is a complete HR Management System built with Spring Boot microservices and Angular frontend.

### Microservices Stack
- **Discovery Server**: Eureka Server (Port 8761)
- **Config Server**: Centralized configuration (Port 8888)
- **Gateway Server**: API Gateway (Port 8222)
- **Auth Service**: Authentication & JWT (Port 8085)
- **Employee Service**: Employee management (Port 8081)
- **Conge Service**: Leave management (Port 8083)
- **Paie Service**: Payroll management (Port 8082)
- **Notification Service**: Notifications (Port TBD)

### Frontend
- **Angular 17**: rh-portal (Port 4200)

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+
- Angular CLI 17+

### Database Setup

Create databases in MySQL (Port 3361):

```sql
CREATE DATABASE auth_db;
CREATE DATABASE employee_db;
CREATE DATABASE conge_db;
CREATE DATABASE paie_db;

-- Create user
CREATE USER IF NOT EXISTS 'employee_user'@'localhost' IDENTIFIED BY 'motdepasse123';
GRANT ALL PRIVILEGES ON auth_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON employee_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON conge_db.* TO 'employee_user'@'localhost';
FLUSH PRIVILEGES;
```

### Starting the Backend (Correct Order)

**1. Start Discovery Server**
```bash
cd backend/discovery-server/discovery-server
mvn spring-boot:run
```
Wait for Eureka to start at http://localhost:8761

**2. Start Config Server**
```bash
cd backend/config-server
mvn spring-boot:run
```
Verify at http://localhost:8888/actuator/health

**3. Start Gateway Server**
```bash
cd backend/gateway-server
mvn spring-boot:run
```
Gateway available at http://localhost:8222

**4. Start Microservices** (any order)

Auth Service:
```bash
cd backend/auth-service
mvn spring-boot:run
```

Employee Service:
```bash
cd backend/employee/employee/employee
mvn spring-boot:run
```

Conge Service:
```bash
cd backend/conge/conge/conge
mvn spring-boot:run
```

Paie Service:
```bash
cd backend/paie/paie/paie
mvn spring-boot:run
```

### Starting the Frontend

```bash
cd frontend/rh-portal
npm install
ng serve
```

Access at http://localhost:4200

## 🔐 Authentication

### Default Admin Account
- Email: `admin@rh.com`
- Password: `admin123`

### API Endpoints

All API calls go through the Gateway at `http://localhost:8222/api`

#### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Employee Endpoints
- `GET /api/employees` - List all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

#### Department Endpoints
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department

#### Conge (Leave) Endpoints
- `GET /api/conges` - List all leaves
- `POST /api/conges/demander` - Request leave
- `PUT /api/conges/{id}/valider` - Validate leave

#### Paie (Payroll) Endpoints
- `GET /api/paie/salaires` - List all salaries
- `POST /api/paie/salaires` - Create/update salary
- `POST /api/paie/fiches-paie/generer` - Generate payslip

## 🔧 Configuration

### Gateway Routing

Gateway routes are defined in `backend/config-repo/gateway-server.yml`:

- `/api/auth/**` → auth-service
- `/api/employees/**` → employee service
- `/api/departments/**` → employee service
- `/api/conges/**` → conge-service
- `/api/paie/**` → paie-service

All routes use `StripPrefix=1` filter to remove `/api` before forwarding.

### CORS Configuration

CORS is configured globally on the Gateway Server:
- Allowed Origins: `*`
- Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allowed Headers: `*`

### JWT Configuration

JWT tokens are generated in auth-service with:
- Secret: Configured in `auth-service.yml`
- Expiration: 24 hours (86400000 ms)
- Algorithm: HS256

## 🏗️ Architecture Decisions

### Why Config Server?
Centralized configuration management allows:
- Single source of truth for configurations
- Environment-specific configurations
- Hot reload of configurations without restart

### Why Gateway?
API Gateway provides:
- Single entry point for all services
- Request routing based on path
- Load balancing via Eureka
- Global CORS handling
- Security filtering
- Rate limiting (future)

### Why Eureka?
Service discovery enables:
- Dynamic service registration
- Client-side load balancing
- Health checking
- Failover support

## 📝 Best Practices Implemented

### Backend
1. **Centralized Configuration**: All configs in config-repo
2. **Service Discovery**: Automatic service registration with Eureka
3. **API Gateway Pattern**: Single entry point with routing
4. **JWT Authentication**: Stateless authentication
5. **Clean Architecture**: Separation of concerns (Controller, Service, Repository)
6. **DTO Pattern**: Data Transfer Objects for API responses
7. **Exception Handling**: Centralized error handling
8. **Validation**: Bean validation on DTOs
9. **CORS**: Properly configured at gateway level

### Frontend
1. **Environment Configuration**: Centralized API URL
2. **Service Layer**: HTTP services for each domain
3. **Route Guards**: Role-based access control
4. **Reactive Forms**: Form validation
5. **Standalone Components**: Angular 17 best practice
6. **Feature Modules**: Lazy loading for better performance
7. **Clean Folder Structure**: core/, shared/, features/, utils/

## 🐛 Troubleshooting

### Services not registering with Eureka
1. Ensure Discovery Server is running first
2. Check `eureka.client.enabled=true` in application.properties
3. Verify `defaultZone` URL is correct

### Config Server not loading configurations
1. Verify config-repo path in config-server
2. Check YAML syntax in config files
3. Ensure spring.profiles.active=native is set

### Gateway not routing requests
1. Check routes configuration in gateway-server.yml
2. Verify service names match Eureka registration
3. Check gateway logs for routing decisions

### JWT Token errors
1. Verify JWT secret is configured
2. Check token expiration
3. Ensure token is being sent in Authorization header

### CORS errors
1. Verify CORS configuration in Gateway
2. Check browser console for specific errors
3. Ensure preflight OPTIONS requests are allowed

## 📦 Project Structure

```
backend/
├── discovery-server/       # Eureka Server
├── config-server/         # Config Server
├── config-repo/           # Centralized configs
├── gateway-server/        # API Gateway
├── auth-service/          # Authentication
├── employee/              # Employee management
├── conge/                 # Leave management
├── paie/                  # Payroll management
└── notification/          # Notifications

frontend/
└── rh-portal/
    └── src/
        └── app/
            ├── core/              # Services, guards, models
            ├── shared/            # Shared components
            ├── features/          # Feature modules
            ├── auth/              # Auth pages
            ├── admin/             # Admin pages
            ├── employee/          # Employee pages
            └── utils/             # Utilities, config
```

## 🔄 Development Workflow

1. Make changes to code
2. Test locally
3. Commit changes
4. Services auto-register with Eureka
5. Config changes reflected on app restart
6. Frontend makes calls through Gateway

## 🚦 Health Checks

- Eureka Dashboard: http://localhost:8761
- Config Server: http://localhost:8888/actuator/health
- Gateway: http://localhost:8222/actuator/health
- Auth Service: http://localhost:8085/actuator/health
- Employee Service: http://localhost:8081/actuator/health

## 📚 Additional Resources

- [Spring Cloud Gateway Documentation](https://spring.io/projects/spring-cloud-gateway)
- [Spring Cloud Netflix Eureka](https://spring.io/projects/spring-cloud-netflix)
- [Spring Cloud Config](https://spring.io/projects/spring-cloud-config)
- [Angular 17 Documentation](https://angular.io/docs)
- [JWT.io](https://jwt.io/)

## 📄 License

This project is for educational purposes.
