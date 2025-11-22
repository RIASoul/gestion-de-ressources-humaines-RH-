# Configuration Guide

## Overview

This guide explains the configuration setup for the HR Management System microservices architecture.

## Configuration Hierarchy

1. **Config Server** - Centralized configuration repository
2. **application.properties** - Local bootstrap configuration
3. **YAML files in config-repo** - Service-specific configurations

## Config Server Setup

### Location
```
backend/config-server/src/main/resources/application.properties
```

### Configuration
```properties
server.port=8888
spring.application.name=config-server
spring.profiles.active=native
spring.cloud.config.server.native.search-locations=file:${user.dir}/../config-repo
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
```

### Key Points
- Uses **native** profile for local file system
- Config files stored in `backend/config-repo/`
- Registers with Eureka for discovery

## Service Configuration Files

### Gateway Server (gateway-server.yml)

```yaml
server:
  port: 8222

spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1
```

**Key Features:**
- Routes incoming requests based on path
- Uses load balancer (lb://) with Eureka
- StripPrefix removes `/api` before forwarding
- Global CORS configuration

### Auth Service (auth-service.yml)

```yaml
server:
  port: 8085

spring:
  datasource:
    url: jdbc:mysql://localhost:3361/auth_db
    username: employee_user
    password: motdepasse123

jwt:
  secret: 5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
  expiration: 86400000  # 24 hours
```

**Key Features:**
- Database configuration
- JWT secret and expiration
- Swagger configuration

### Employee Service (employee.yml)

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3361/employee_db
    username: employee_user
    password: motdepasse123
    hikari:
      maximum-pool-size: 10
```

**Key Features:**
- Connection pool configuration
- JPA/Hibernate settings
- Eureka registration

## Microservice Bootstrap Configuration

Each microservice has a minimal `application.properties`:

```properties
spring.application.name=service-name
spring.config.import=configserver:http://localhost:8888
```

This tells the service to:
1. Register with this name in Eureka
2. Fetch configuration from Config Server

## Gateway Routing Explained

### Route Structure

```yaml
- id: unique-route-id
  uri: lb://service-name
  predicates:
    - Path=/api/path/**
  filters:
    - StripPrefix=1
```

### Components:
- **id**: Unique identifier for the route
- **uri**: Destination (lb:// for load-balanced Eureka service)
- **predicates**: Conditions to match (usually Path)
- **filters**: Transformations to apply (StripPrefix removes path segments)

### Example Flow:

Request: `http://localhost:8222/api/auth/login`

1. Gateway receives request
2. Matches route with predicate `Path=/api/auth/**`
3. Applies `StripPrefix=1` → removes `/api`
4. Forwards to `auth-service` as `/auth/login`
5. Auth service controller handles `/auth/login`

## CORS Configuration

### Gateway Level (Recommended)

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Collections.singletonList("*"));
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
```

### YAML Alternative (in gateway-server.yml)

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders: "*"
```

## JWT Configuration

### Secret Generation

Generate a secure secret:
```bash
openssl rand -base64 64
```

### Configuration Properties

```yaml
jwt:
  secret: your-secret-here
  expiration: 86400000  # milliseconds (24 hours)
```

### Usage in Code

```java
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    // JWT generation and validation methods
}
```

## Eureka Configuration

### Server (Discovery Server)

```properties
server.port=8761
spring.application.name=discovery-server
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

### Client (All Services)

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
    enabled: true
  instance:
    prefer-ip-address: true
```

## Database Configuration

### Connection Settings

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3361/database_name?useSSL=false&serverTimezone=UTC
    username: employee_user
    password: motdepasse123
```

### JPA/Hibernate Settings

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # create, create-drop, validate, update, none
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
```

### Connection Pool (HikariCP)

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

## Frontend Configuration

### Environment Files

**environment.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8222/api'
};
```

**environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

### App Configuration

```typescript
import { environment } from '../../environments/environment';

export const AppConfig = {
  endpoints: {
    AUTH: `${environment.apiUrl}/auth`,
    EMPLOYEE: `${environment.apiUrl}/employees`,
    CONGE: `${environment.apiUrl}/conges`,
    PAIE: `${environment.apiUrl}/paie`
  }
};
```

## Configuration Best Practices

### 1. Never Commit Secrets
- Use environment variables for sensitive data
- Use Spring Cloud Config with encryption
- Use secret management tools (Vault, AWS Secrets Manager)

### 2. Use Profiles
```properties
spring.profiles.active=dev
```

Create profile-specific files:
- `application-dev.yml`
- `application-prod.yml`

### 3. Externalize Configuration
- Keep config separate from code
- Use Config Server for centralization
- Override with environment variables

### 4. Validate Configuration
- Use `@ConfigurationProperties` with validation
- Fail fast on invalid configuration
- Log configuration on startup

### 5. Document Configuration
- Comment all non-obvious settings
- Maintain this guide
- Include examples

## Troubleshooting Configuration Issues

### Service Can't Connect to Config Server
```
Failed to load property source from config server
```

**Solutions:**
1. Ensure Config Server is running
2. Check `spring.config.import` URL
3. Verify network connectivity
4. Check Config Server logs

### Configuration Not Updating
```
Service using old configuration values
```

**Solutions:**
1. Restart the service
2. Use Spring Cloud Bus for refresh
3. Check config file syntax
4. Verify file is in config-repo

### Eureka Registration Issues
```
Service not appearing in Eureka dashboard
```

**Solutions:**
1. Check `eureka.client.enabled=true`
2. Verify `defaultZone` URL
3. Check network between service and Eureka
4. Verify service name is unique

### Gateway Routing Not Working
```
404 or 503 errors from gateway
```

**Solutions:**
1. Check route configuration in gateway-server.yml
2. Verify service name matches Eureka registration
3. Check service is UP in Eureka
4. Review gateway logs for routing decisions

### CORS Errors
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solutions:**
1. Verify CORS configuration in Gateway
2. Check allowed origins
3. Ensure OPTIONS requests are handled
4. Check for CORS configs in individual services (may conflict)

## Configuration Checklist

- [ ] Config Server running on port 8888
- [ ] Config files present in config-repo
- [ ] Eureka Server running on port 8761
- [ ] All services have correct `spring.application.name`
- [ ] All services import config from Config Server
- [ ] Database credentials configured
- [ ] JWT secret configured
- [ ] Gateway routes defined
- [ ] CORS configured on Gateway
- [ ] Frontend environment.ts points to Gateway
- [ ] All services registered with Eureka

## Next Steps

1. Review configuration files
2. Test service connectivity
3. Verify gateway routing
4. Test authentication flow
5. Monitor Eureka dashboard
6. Check service health endpoints

For more information, see [ARCHITECTURE.md](./ARCHITECTURE.md).
