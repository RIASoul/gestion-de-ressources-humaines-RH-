# Quick Start Guide - HR Management System

## 🚀 Get Started in 5 Minutes

### Prerequisites Check

```bash
# Check Java version (need 17+)
java -version

# Check Maven
mvn -version

# Check Node.js (need 18+)
node -version

# Check MySQL
mysql --version
```

## Step 1: Setup Database (2 minutes)

```sql
-- Connect to MySQL
mysql -u root -p -P 3361

-- Create databases
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS employee_db;
CREATE DATABASE IF NOT EXISTS conge_db;
CREATE DATABASE IF NOT EXISTS paie_db;

-- Create user
CREATE USER IF NOT EXISTS 'employee_user'@'localhost' IDENTIFIED BY 'motdepasse123';
GRANT ALL PRIVILEGES ON auth_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON employee_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON conge_db.* TO 'employee_user'@'localhost';
GRANT ALL PRIVILEGES ON paie_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Step 2: Start Backend Services (3 minutes)

**Open 7 terminal windows** (or use tmux/screen):

### Terminal 1 - Discovery Server (Required First!)
```bash
cd backend/discovery-server/discovery-server
mvn spring-boot:run
```
Wait for: `Eureka Server started on port 8761`
Check: http://localhost:8761

### Terminal 2 - Config Server (Required Second!)
```bash
cd backend/config-server
mvn spring-boot:run
```
Wait for: `Config Server started on port 8888`

### Terminal 3 - Gateway Server (Required Third!)
```bash
cd backend/gateway-server
mvn spring-boot:run
```
Wait for: `Gateway Server started on port 8222`

### Terminal 4 - Auth Service
```bash
cd backend/auth-service
mvn spring-boot:run
```
Wait for: `Auth Service registered with Eureka`

### Terminal 5 - Employee Service
```bash
cd backend/employee/employee/employee
mvn spring-boot:run
```

### Terminal 6 - Conge Service
```bash
cd backend/conge/conge/conge
mvn spring-boot:run
```

### Terminal 7 - Paie Service
```bash
cd backend/paie/paie/paie
mvn spring-boot:run
```

**Verify all services are registered:**
Open http://localhost:8761 and check all services appear.

## Step 3: Start Frontend

```bash
cd frontend/rh-portal
npm install
ng serve
```

Access: http://localhost:4200

## Step 4: Test the System

### Default Login Credentials
- **Admin**: admin@rh.com / admin123
- **Employee**: (create via register)

### Test Login via Terminal

```bash
# Login as admin
curl -X POST http://localhost:8222/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rh.com",
    "password": "admin123"
  }'
```

You should get a response with a JWT token!

### Test via Browser

1. Go to http://localhost:4200
2. Login with admin@rh.com / admin123
3. You should be redirected to admin dashboard

## 📊 System Status Checks

After starting all services, verify:

✅ **Eureka Dashboard**: http://localhost:8761
- Should show: auth-service, employee, conge-service, paie-service, gateway-server, config-server

✅ **Config Server**: http://localhost:8888/actuator/health
- Should return: `{"status":"UP"}`

✅ **Gateway**: http://localhost:8222/actuator/health
- Should return: `{"status":"UP"}`

✅ **Auth Service**: http://localhost:8085/actuator/health
- Should return: `{"status":"UP"}`

## 🐛 Common Issues & Quick Fixes

### Issue: "Config Server refused connection"
**Fix:** Start Config Server before other services

### Issue: "Service not registered in Eureka"
**Fix:** 
1. Check Discovery Server is running
2. Verify `eureka.client.enabled=true` in config
3. Wait 30 seconds for registration

### Issue: "MySQL connection refused"
**Fix:**
1. Ensure MySQL is running
2. Check port 3361 is correct
3. Verify databases exist: `SHOW DATABASES;`

### Issue: "Gateway returns 503"
**Fix:**
1. Check service is UP in Eureka
2. Verify route configuration in gateway-server.yml
3. Check service name matches Eureka registration

### Issue: "CORS error in browser"
**Fix:**
1. Ensure Gateway CorsConfig is present
2. Check browser console for specific error
3. Verify gateway is running

### Issue: "JWT token error"
**Fix:**
1. Check jwt.secret is configured in auth-service.yml
2. Verify token is being sent in Authorization header
3. Check token hasn't expired (24 hours)

## 🔍 Quick Test Commands

### Test Auth Service (Direct - Bypass Gateway)
```bash
curl -X POST http://localhost:8085/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rh.com","password":"admin123"}'
```

### Test Through Gateway (Recommended)
```bash
curl -X POST http://localhost:8222/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rh.com","password":"admin123"}'
```

### Test Employee Service (with token)
```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:8222/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Gateway Routes
```bash
curl http://localhost:8222/actuator/gateway/routes | jq
```

## 📁 File Locations Quick Reference

### Configuration Files
- **Gateway Routes**: `backend/config-repo/gateway-server.yml`
- **Auth Config**: `backend/config-repo/auth-service.yml`
- **Employee Config**: `backend/config-repo/employee.yml`
- **Angular Config**: `frontend/rh-portal/src/environments/environment.ts`

### Controllers
- **Auth**: `backend/auth-service/src/.../controller/AuthController.java`
- **Employee**: `backend/employee/.../controller/EmployeeController.java`
- **Department**: `backend/employee/.../controller/DepartmentController.java`
- **Conge**: `backend/conge/.../controller/CongeController.java`
- **Paie**: `backend/paie/.../controller/PaieController.java`

### Angular Services
- **Auth**: `frontend/rh-portal/src/app/core/services/auth.service.ts`
- **Employee**: `frontend/rh-portal/src/app/core/services/employee.service.ts`

### Guards
- **Auth Guard**: `frontend/rh-portal/src/app/core/guards/auth.guard.ts`
- **Admin Guard**: `frontend/rh-portal/src/app/core/guards/admin.guard.ts`
- **Employee Guard**: `frontend/rh-portal/src/app/core/guards/employee.guard.ts`

## 🎯 What to Do Next

1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. ✅ Read [CONFIGURATION.md](./CONFIGURATION.md) for detailed configuration
3. ✅ Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
4. ✅ Read [BEST_PRACTICES.md](./BEST_PRACTICES.md) for development guidelines
5. ✅ Test all endpoints using Postman or curl
6. ✅ Explore the Eureka dashboard
7. ✅ Try creating employees through the UI
8. ✅ Test leave requests workflow
9. ✅ Review the Angular components

## 🎨 Visual Studio Code Setup (Optional)

### Recommended Extensions
- Java Extension Pack
- Spring Boot Extension Pack
- Angular Language Service
- REST Client (for testing APIs)
- GitLens

### workspace settings.json
```json
{
  "java.configuration.updateBuildConfiguration": "automatic",
  "spring-boot.ls.java.home": "/path/to/java-17",
  "typescript.tsdk": "node_modules/typescript/lib",
  "angular.enableStrictMode": true
}
```

## 🐳 Docker Quick Start (Alternative)

If you prefer Docker (future enhancement):

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

## 📝 Development Workflow

### Making Changes to Backend

1. Modify Java files
2. Maven will auto-compile (if using spring-boot:run)
3. Or restart service
4. Check logs for errors

### Making Changes to Frontend

1. Modify TypeScript/HTML files
2. Angular auto-reloads (ng serve)
3. Check browser console for errors

### Modifying Configuration

1. Edit YAML file in `backend/config-repo/`
2. Restart affected service
3. Verify changes in logs

## 🎓 Learning Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Cloud Gateway**: https://spring.io/projects/spring-cloud-gateway
- **Angular Docs**: https://angular.io/docs
- **Eureka Wiki**: https://github.com/Netflix/eureka/wiki
- **JWT.io**: https://jwt.io/

## 💡 Pro Tips

1. **Use IntelliJ IDEA or VS Code** for better development experience
2. **Keep terminal windows organized** - label them clearly
3. **Watch Eureka dashboard** to see services register/deregister
4. **Check logs** when something doesn't work
5. **Use Postman** to test APIs before implementing in Angular
6. **Git commit often** - small, focused commits
7. **Read error messages carefully** - they usually tell you what's wrong

## 🆘 Need Help?

1. Check the logs in terminal where service is running
2. Review Eureka dashboard for service status
3. Test endpoints with curl to isolate issues
4. Check configuration files for typos
5. Verify database is running and accessible
6. Review the documentation files in this repository

## ✅ Success Checklist

Before considering setup complete, verify:

- [ ] All 7 backend services running without errors
- [ ] All services visible in Eureka dashboard
- [ ] Can login with admin@rh.com / admin123
- [ ] JWT token is generated on login
- [ ] Can access http://localhost:4200
- [ ] Can navigate to admin dashboard after login
- [ ] No CORS errors in browser console
- [ ] Can call API through gateway successfully

---

## 🎉 You're Ready!

If all checks pass, congratulations! You have a fully functional microservices-based HR management system running.

Explore the features, read the documentation, and happy coding! 🚀
