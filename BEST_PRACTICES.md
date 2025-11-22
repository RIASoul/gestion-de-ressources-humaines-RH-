# Best Practices - HR Management System

## 🏆 Spring Boot & Microservices Best Practices

### 1. Configuration Management

#### ✅ DO:
- **Use Config Server** for centralized configuration
- **Externalize all configuration** - never hardcode values
- **Use profiles** for environment-specific settings (dev, prod, test)
- **Keep secrets out of git** - use environment variables or secret managers
- **Use YAML format** for better readability and structure

```yaml
# Good - environment-specific with profile
spring:
  profiles: dev
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3361/db}
    username: ${DB_USER:root}
    password: ${DB_PASSWORD}
```

#### ❌ DON'T:
- Hardcode URLs, credentials, or environment-specific values
- Commit secrets to version control
- Mix configuration with code
- Use different configuration mechanisms across services

### 2. API Gateway Pattern

#### ✅ DO:
- **Use API Gateway** as single entry point
- **Route based on path** for clear URL structure
- **Handle CORS globally** at gateway level
- **Implement rate limiting** for security
- **Use circuit breakers** for resilience

```yaml
# Good - clear routing structure
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

#### ❌ DON'T:
- Expose microservices directly to clients
- Duplicate CORS configuration in each service
- Skip authentication at gateway level
- Allow unlimited requests

### 3. Service Discovery (Eureka)

#### ✅ DO:
- **Register all services** with Eureka
- **Use meaningful service names** (lowercase, hyphen-separated)
- **Enable health checks** for automatic failover
- **Use IP addresses** when needed (prefer-ip-address: true)
- **Monitor Eureka dashboard** regularly

```properties
# Good - clear service registration
spring.application.name=employee-service
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
eureka.instance.prefer-ip-address=true
```

#### ❌ DON'T:
- Hardcode service URLs
- Use inconsistent naming conventions
- Disable health checks in production
- Register gateway with itself

### 4. JWT Authentication

#### ✅ DO:
- **Use strong secrets** (minimum 256 bits for HS256)
- **Set reasonable expiration** (not too long, not too short)
- **Include necessary claims** (userId, role, email)
- **Validate tokens properly** (signature, expiration, claims)
- **Refresh tokens** for long-lived sessions

```java
// Good - secure JWT generation
public String generateToken(String email, Long userId, String name, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", userId);
    claims.put("name", name);
    claims.put("role", role);
    
    return Jwts.builder()
            .claims(claims)
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
}
```

#### ❌ DON'T:
- Use weak or default secrets
- Store sensitive data in JWT claims
- Skip token validation
- Use overly long expiration times
- Expose JWT secret in logs or errors

### 5. Controller Design

#### ✅ DO:
- **Use clean RESTful paths** (/employees, /auth)
- **Apply proper HTTP methods** (GET, POST, PUT, DELETE)
- **Validate input** with @Valid and Bean Validation
- **Return proper status codes** (200, 201, 204, 400, 404, etc.)
- **Use DTOs** for request/response

```java
// Good - clean controller design
@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    
    private final EmployeeService service;
    
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

#### ❌ DON'T:
- Mix /api prefix in controller and gateway
- Use GET for operations that modify data
- Return entities directly (use DTOs)
- Ignore validation errors
- Use inconsistent path naming

### 6. Exception Handling

#### ✅ DO:
- **Centralize exception handling** with @ControllerAdvice
- **Return meaningful error messages**
- **Include error codes** for client reference
- **Log exceptions appropriately**
- **Hide sensitive information** from clients

```java
// Good - centralized exception handling
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            404,
            "Resource not found",
            ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

#### ❌ DON'T:
- Let exceptions propagate to clients unhandled
- Expose stack traces in production
- Use generic RuntimeException
- Return null or empty responses
- Log sensitive data in error messages

### 7. Database Best Practices

#### ✅ DO:
- **Use connection pooling** (HikariCP)
- **Configure pool sizes** appropriately
- **Use transactions** where needed
- **Optimize queries** with indexes
- **Use database migrations** (Flyway, Liquibase)

```yaml
# Good - optimized connection pool
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
  jpa:
    hibernate:
      ddl-auto: validate  # Use migrations instead
```

#### ❌ DON'T:
- Use ddl-auto=create or create-drop in production
- Leave default pool settings
- Load entire tables into memory
- Perform N+1 queries
- Skip database indexes

### 8. Service Layer Design

#### ✅ DO:
- **Keep business logic in service layer**
- **Use @Transactional** for atomic operations
- **Inject dependencies via constructor**
- **Return DTOs** from service methods
- **Handle exceptions** at service level

```java
// Good - clean service design
@Service
@RequiredArgsConstructor
public class EmployeeService {
    
    private final EmployeeRepository repository;
    private final EmployeeMapper mapper;
    
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public EmployeeDTO create(EmployeeDTO dto) {
        Employee entity = mapper.toEntity(dto);
        Employee saved = repository.save(entity);
        return mapper.toDto(saved);
    }
}
```

#### ❌ DON'T:
- Put business logic in controllers
- Return entities directly
- Use field injection (@Autowired on fields)
- Skip transaction boundaries
- Catch exceptions without proper handling

## 🎨 Angular Best Practices

### 1. Project Structure

#### ✅ DO:
- **Use feature modules** for organization
- **Separate core, shared, and features**
- **Lazy load feature modules**
- **Use standalone components** (Angular 17+)
- **Keep components focused** (single responsibility)

```
src/app/
├── core/           # Singletons (services, guards, interceptors)
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── shared/         # Reusable components, pipes, directives
│   ├── components/
│   └── pipes/
├── features/       # Feature modules
│   ├── auth/
│   ├── employee/
│   └── admin/
└── utils/          # Utilities, configs
```

#### ❌ DON'T:
- Put everything in app component
- Mix shared and feature-specific code
- Create circular dependencies
- Load all modules eagerly

### 2. Services & HTTP

#### ✅ DO:
- **Use HttpClient** for API calls
- **Centralize API URLs** in config
- **Handle errors properly** with catchError
- **Use RxJS operators** effectively
- **Provide services at root** or module level

```typescript
// Good - clean service with error handling
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseUrl = `${environment.apiUrl}/employees`;
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong'));
  }
}
```

#### ❌ DON'T:
- Hardcode API URLs in services
- Subscribe in services (return Observable)
- Ignore error handling
- Create multiple service instances
- Use any type for responses

### 3. Routing & Guards

#### ✅ DO:
- **Use route guards** for access control
- **Implement lazy loading**
- **Use functional guards** (Angular 14+)
- **Handle navigation errors**
- **Use route resolvers** for data pre-loading

```typescript
// Good - functional guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
```

#### ❌ DON'T:
- Allow access without authentication
- Load all routes eagerly
- Skip error handling in navigation
- Create overly complex guard logic
- Forget to redirect after guard rejection

### 4. Forms

#### ✅ DO:
- **Use Reactive Forms** for complex forms
- **Implement validation** with Validators
- **Show validation errors** clearly
- **Disable submit** until form is valid
- **Use FormBuilder** for cleaner code

```typescript
// Good - reactive form with validation
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  constructor(private fb: FormBuilder) {}
  
  onSubmit() {
    if (this.loginForm.valid) {
      // Handle submission
    }
  }
}
```

#### ❌ DON'T:
- Use template-driven forms for complex scenarios
- Skip validation
- Allow invalid form submission
- Forget to unsubscribe from form changes
- Use any type for form values

### 5. State Management

#### ✅ DO:
- **Use services for simple state**
- **Consider NgRx** for complex state
- **Use BehaviorSubject** for reactive state
- **Unsubscribe properly** to prevent leaks
- **Keep state immutable**

```typescript
// Good - service with reactive state
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  
  setUser(user: User) {
    this.userSubject.next(user);
  }
  
  clearUser() {
    this.userSubject.next(null);
  }
}
```

#### ❌ DON'T:
- Mutate state directly
- Create memory leaks with subscriptions
- Use component state for shared data
- Skip unsubscribe in ngOnDestroy

### 6. Performance

#### ✅ DO:
- **Use OnPush change detection** when possible
- **Lazy load modules**
- **Use trackBy** in *ngFor
- **Implement virtual scrolling** for large lists
- **Optimize bundle size**

```typescript
// Good - OnPush with trackBy
@Component({
  selector: 'app-employee-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let emp of employees; trackBy: trackByEmployeeId">
      {{ emp.name }}
    </div>
  `
})
export class EmployeeListComponent {
  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.id;
  }
}
```

#### ❌ DON'T:
- Use default change detection everywhere
- Load all modules eagerly
- Skip trackBy in loops
- Load large datasets without pagination
- Bundle third-party libraries with app code

## 🔒 Security Best Practices

### 1. Authentication & Authorization

#### ✅ DO:
- Use HTTPS in production
- Implement JWT properly
- Store tokens securely (httpOnly cookies or localStorage with precautions)
- Validate on both frontend and backend
- Implement refresh tokens

#### ❌ DON'T:
- Store passwords in plain text
- Skip server-side validation
- Trust client-side checks alone
- Use predictable secrets

### 2. Input Validation

#### ✅ DO:
- Validate all inputs on backend
- Use Bean Validation annotations
- Sanitize user input
- Implement rate limiting
- Log suspicious activity

#### ❌ DON'T:
- Trust client input
- Skip validation
- Expose detailed error messages
- Allow unlimited requests

### 3. CORS

#### ✅ DO:
- Configure CORS properly
- Use specific origins in production
- Handle preflight requests
- Set appropriate headers

#### ❌ DON'T:
- Allow all origins in production
- Skip CORS configuration
- Expose all headers
- Allow credentials with wildcard origin

## 📊 Monitoring & Logging

### ✅ DO:
- Use Spring Boot Actuator
- Implement structured logging
- Monitor application metrics
- Set up health checks
- Use correlation IDs for distributed tracing

### ❌ DON'T:
- Log sensitive information
- Skip health checks
- Ignore error logs
- Use System.out.println
- Leave actuator endpoints exposed

## 🚀 Deployment

### ✅ DO:
- Use Docker containers
- Implement CI/CD pipelines
- Use environment variables for config
- Scale services independently
- Implement blue-green deployments

### ❌ DON'T:
- Deploy to production without testing
- Hardcode production credentials
- Skip database backups
- Deploy all services at once
- Ignore monitoring in production

## 📚 Additional Resources

- [Spring Boot Best Practices](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Microservices Patterns](https://microservices.io/patterns/)
- [12-Factor App](https://12factor.net/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
