# Production Configuration Example

## ⚠️ Security Checklist for Production

Before deploying to production, ensure you've addressed these security concerns:

### 1. CORS Configuration

**Current (Development):**
```yaml
allowedOrigins: "*"
```

**Production Fix:**
```yaml
allowedOrigins: "https://yourdomain.com"
```

**Location to Update:**
- `backend/config-repo/gateway-server.yml` (line 16)
- `backend/gateway-server/src/main/java/com/example/gatewayserver/config/CorsConfig.java` (line 15)

### 2. JWT Secret

**Current (Development):**
```yaml
jwt:
  secret: 5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
```

**Production Fix:**
```bash
# Generate a new secret
openssl rand -base64 64

# Use environment variable
jwt:
  secret: ${JWT_SECRET}
```

**Location to Update:**
- `backend/config-repo/auth-service.yml`

### 3. Database Credentials

**Current (Development):**
```yaml
datasource:
  username: employee_user
  password: motdepasse123
```

**Production Fix:**
```yaml
datasource:
  username: ${DB_USERNAME}
  password: ${DB_PASSWORD}
```

**Location to Update:**
- All service configuration files in `backend/config-repo/`

### 4. Actuator Endpoints

**Production Configuration:**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: when-authorized
```

### 5. Logging

**Production Configuration:**
```yaml
logging:
  level:
    root: INFO
    com.example: INFO
  file:
    name: /var/log/app/application.log
    max-size: 10MB
    max-history: 30
```

### 6. SSL/TLS Configuration

**Enable HTTPS:**
```yaml
server:
  port: 8443
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: tomcat
```

### 7. Rate Limiting

**Add to Gateway:**
```yaml
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
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

### 8. Environment Variables

Create `.env` file (never commit this):

```bash
# Database
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-very-long-and-secure-secret-key

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Eureka
EUREKA_URL=https://eureka.yourdomain.com/eureka

# Config Server
CONFIG_SERVER_URL=https://config.yourdomain.com
```

### 9. Docker Production Configuration

**Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network

  discovery-server:
    build: ./backend/discovery-server
    ports:
      - "8761:8761"
    networks:
      - app-network

  config-server:
    build: ./backend/config-server
    depends_on:
      - discovery-server
    environment:
      EUREKA_URL: http://discovery-server:8761/eureka
    networks:
      - app-network

  gateway-server:
    build: ./backend/gateway-server
    depends_on:
      - config-server
      - discovery-server
    environment:
      EUREKA_URL: http://discovery-server:8761/eureka
      CONFIG_URL: http://config-server:8888
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
    ports:
      - "8222:8222"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
```

### 10. Monitoring & Logging

**Add Prometheus & Grafana:**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'spring-actuator'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8085', 'localhost:8081', 'localhost:8083', 'localhost:8082']
```

**Add to pom.xml:**
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### 11. Backup Strategy

**Database Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

databases=("auth_db" "employee_db" "conge_db" "paie_db")

for db in "${databases[@]}"; do
    mysqldump -u $DB_USERNAME -p$DB_PASSWORD $db > $BACKUP_DIR/${db}_$DATE.sql
    gzip $BACKUP_DIR/${db}_$DATE.sql
done

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 12. CI/CD Pipeline

**GitHub Actions Example:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'
          
      - name: Build with Maven
        run: mvn clean package -DskipTests
        
      - name: Build Docker images
        run: |
          docker build -t myapp/gateway ./backend/gateway-server
          docker build -t myapp/auth ./backend/auth-service
          
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push myapp/gateway
          docker push myapp/auth
```

### 13. Health Checks

**Kubernetes Liveness & Readiness:**
```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 5
```

### 14. Security Headers

**Add to Gateway:**
```java
@Bean
public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    http.headers()
        .frameOptions().disable()
        .contentSecurityPolicy("default-src 'self'")
        .and()
        .referrerPolicy()
        .policy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN);
    return http.build();
}
```

## Production Deployment Checklist

- [ ] Update CORS to specific origins
- [ ] Generate new JWT secret
- [ ] Use environment variables for credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure log aggregation
- [ ] Set up database backups
- [ ] Configure CI/CD pipeline
- [ ] Add health checks
- [ ] Enable security headers
- [ ] Configure firewall rules
- [ ] Set up reverse proxy (nginx)
- [ ] Enable database connection pooling
- [ ] Configure cache (Redis)
- [ ] Set up alerting
- [ ] Document disaster recovery plan
- [ ] Perform security audit
- [ ] Load testing
- [ ] Penetration testing

## Additional Security Measures

1. **API Rate Limiting**: Prevent abuse
2. **Input Validation**: Always validate on backend
3. **SQL Injection Prevention**: Use parameterized queries
4. **XSS Prevention**: Sanitize outputs
5. **CSRF Protection**: Enable for state-changing operations
6. **Dependency Scanning**: Regular security updates
7. **Log Monitoring**: Watch for suspicious activity
8. **Backup & Recovery**: Regular backups and tested recovery
9. **Access Control**: Principle of least privilege
10. **Audit Logging**: Track all sensitive operations

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Kubernetes Security](https://kubernetes.io/docs/concepts/security/)
