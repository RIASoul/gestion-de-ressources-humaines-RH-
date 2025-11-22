# API Documentation - HR Management System

## Base URL

All API requests should be made to the API Gateway:

```
http://localhost:8222/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2025-11-22T00:00:00Z"
}
```

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

**Roles:**
- `ADMIN` - Administrator with full access
- `EMPLOYEE` - Regular employee with limited access

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "EMPLOYEE"
}
```

---

### Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "EMPLOYEE"
}
```

**Default Admin Account:**
- Email: `admin@rh.com`
- Password: `admin123`

---

## Employee Endpoints

All employee endpoints require authentication.

### List All Employees
**GET** `/api/employees`

Get all employees.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "position": "Developer",
    "department": {
      "id": 1,
      "name": "IT"
    },
    "salary": 50000,
    "hireDate": "2024-01-15"
  }
]
```

---

### Get Employee by ID
**GET** `/api/employees/{id}`

Get details of a specific employee.

**Response:** `200 OK`
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "position": "Developer",
  "department": {
    "id": 1,
    "name": "IT"
  },
  "salary": 50000,
  "hireDate": "2024-01-15"
}
```

---

### Create Employee
**POST** `/api/employees`

Create a new employee. (Admin only)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "position": "Manager",
  "departmentId": 1,
  "salary": 60000,
  "hireDate": "2024-02-01"
}
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "position": "Manager",
  "department": {
    "id": 1,
    "name": "IT"
  },
  "salary": 60000,
  "hireDate": "2024-02-01"
}
```

---

### Update Employee
**PUT** `/api/employees/{id}`

Update employee information. (Admin only)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "position": "Senior Manager",
  "departmentId": 1,
  "salary": 70000
}
```

**Response:** `200 OK` (Same as create response)

---

### Delete Employee
**DELETE** `/api/employees/{id}`

Delete an employee. (Admin only)

**Response:** `204 No Content`

---

### Search Employees
**GET** `/api/employees/search?name={name}`

Search employees by name.

**Query Parameters:**
- `name` - Search term for first or last name

**Response:** `200 OK` (Array of employees)

---

### Get Employees by Department
**GET** `/api/employees/department/{departmentId}`

Get all employees in a specific department.

**Response:** `200 OK` (Array of employees)

---

### Get Employee with Salary Details
**GET** `/api/employees/{id}/with-salary`

Get employee with detailed salary information.

**Response:** `200 OK`
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "salaryDetails": {
    "baseSalary": 50000,
    "bonus": 5000,
    "deductions": 2000,
    "netSalary": 53000
  }
}
```

---

### Get Employee Statistics
**GET** `/api/employees/stats`

Get overall employee statistics. (Admin only)

**Response:** `200 OK`
```json
{
  "totalEmployees": 50,
  "averageSalary": 55000,
  "departmentCount": 5,
  "newHiresThisMonth": 3
}
```

---

## Department Endpoints

### List All Departments
**GET** `/api/departments`

Get all departments.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "IT",
    "description": "Information Technology",
    "managerName": "John Manager"
  },
  {
    "id": 2,
    "name": "HR",
    "description": "Human Resources",
    "managerName": "Jane HR"
  }
]
```

---

### Get Department by ID
**GET** `/api/departments/{id}`

Get details of a specific department.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "IT",
  "description": "Information Technology",
  "managerName": "John Manager",
  "employeeCount": 15
}
```

---

### Create Department
**POST** `/api/departments`

Create a new department. (Admin only)

**Request Body:**
```json
{
  "name": "Marketing",
  "description": "Marketing and Sales",
  "managerName": "Sarah Marketing"
}
```

**Response:** `200 OK` (Same as get department response)

---

### Update Department
**PUT** `/api/departments/{id}`

Update department information. (Admin only)

**Request Body:** Same as create

**Response:** `200 OK`

---

### Delete Department
**DELETE** `/api/departments/{id}`

Delete a department. (Admin only)

**Response:** `204 No Content`

---

## Leave (Congé) Endpoints

### Request Leave
**POST** `/api/conges/demander`

Submit a leave request.

**Request Body:**
```json
{
  "employeeId": 1,
  "type": "VACATION",
  "dateDebut": "2024-03-01",
  "dateFin": "2024-03-10",
  "motif": "Family vacation"
}
```

**Leave Types:**
- `VACATION` - Paid vacation
- `SICK` - Sick leave
- `UNPAID` - Unpaid leave
- `MATERNITY` - Maternity leave
- `PATERNITY` - Paternity leave

**Response:** `200 OK`
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Doe",
  "type": "VACATION",
  "dateDebut": "2024-03-01",
  "dateFin": "2024-03-10",
  "motif": "Family vacation",
  "statut": "PENDING",
  "nombreJours": 10
}
```

---

### Get All Leaves
**GET** `/api/conges`

Get all leave requests. (Admin only)

**Response:** `200 OK` (Array of leave requests)

---

### Get Leaves by Employee
**GET** `/api/conges/employee/{employeeId}`

Get all leave requests for a specific employee.

**Response:** `200 OK` (Array of leave requests)

---

### Get Leaves by Status
**GET** `/api/conges/statut/{statut}`

Get leave requests by status.

**Status Values:**
- `PENDING` - Waiting for approval
- `APPROVED` - Approved
- `REJECTED` - Rejected

**Response:** `200 OK` (Array of leave requests)

---

### Validate Leave
**PUT** `/api/conges/{id}/valider`

Approve or reject a leave request. (Admin only)

**Request Body:**
```json
{
  "decision": "APPROVED",
  "commentaire": "Approved by manager"
}
```

**Decision Values:**
- `APPROVED`
- `REJECTED`

**Response:** `200 OK`
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Doe",
  "type": "VACATION",
  "dateDebut": "2024-03-01",
  "dateFin": "2024-03-10",
  "motif": "Family vacation",
  "statut": "APPROVED",
  "nombreJours": 10,
  "validatedBy": "Admin",
  "validatedAt": "2024-02-20T10:30:00",
  "commentaire": "Approved by manager"
}
```

---

### Get Leave by ID
**GET** `/api/conges/{id}`

Get details of a specific leave request.

**Response:** `200 OK`

---

### Delete Leave
**DELETE** `/api/conges/{id}`

Delete a leave request.

**Response:** `204 No Content`

---

## Payroll (Paie) Endpoints

### Get All Salaries
**GET** `/api/paie/salaires`

Get all salary records. (Admin only)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "employeeId": 1,
    "employeeName": "John Doe",
    "salaireBase": 50000,
    "primes": 5000,
    "deductions": 2000,
    "salaireNet": 53000
  }
]
```

---

### Get Salary by Employee
**GET** `/api/paie/salaires/employee/{employeeId}`

Get salary information for a specific employee.

**Response:** `200 OK`
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Doe",
  "salaireBase": 50000,
  "primes": 5000,
  "deductions": 2000,
  "salaireNet": 53000
}
```

---

### Create or Update Salary
**POST** `/api/paie/salaires`

Create or update salary information. (Admin only)

**Request Body:**
```json
{
  "employeeId": 1,
  "salaireBase": 55000,
  "primes": 6000,
  "deductions": 2500
}
```

**Response:** `200 OK` (Same as get salary response)

---

### Generate Payslip
**POST** `/api/paie/fiches-paie/generer`

Generate a payslip for an employee. (Admin only)

**Request Body:**
```json
{
  "employeeId": 1,
  "mois": 3,
  "annee": 2024
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Doe",
  "mois": 3,
  "annee": 2024,
  "salaireBase": 55000,
  "primes": 6000,
  "deductions": 2500,
  "salaireNet": 58500,
  "heuresTravaillees": 160,
  "joursConges": 2,
  "generatedAt": "2024-03-31T23:59:59"
}
```

---

### Get Payslips by Employee
**GET** `/api/paie/fiches-paie/employee/{employeeId}`

Get all payslips for a specific employee.

**Response:** `200 OK` (Array of payslips)

---

### Get Payslip by ID
**GET** `/api/paie/fiches-paie/{id}`

Get details of a specific payslip.

**Response:** `200 OK`

---

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content returned
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `500 Internal Server Error` - Server error

## Rate Limiting

API calls are rate limited to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per IP address

Exceeding these limits will result in a `429 Too Many Requests` response.

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**
- `page` - Page number (default: 0)
- `size` - Items per page (default: 10, max: 100)
- `sortBy` - Field to sort by (default varies by endpoint)

**Example:**
```
GET /api/employees?page=0&size=20&sortBy=lastName
```

**Response includes pagination info:**
```json
{
  "content": [...],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "size": 20
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "timestamp": "2024-11-22T00:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/employees",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8222/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "EMPLOYEE"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8222/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Employees (with token):**
```bash
curl http://localhost:8222/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the endpoints from this documentation
2. Create an environment with:
   - `base_url`: `http://localhost:8222/api`
   - `token`: (will be set after login)
3. Use `{{base_url}}/auth/login` to authenticate
4. Save the token from response to `{{token}}`
5. Use `Bearer {{token}}` in Authorization header

### Using Swagger

Access Swagger UI for each service:
- Auth Service: http://localhost:8085/swagger-ui.html
- Employee Service: http://localhost:8081/swagger-ui.html
- Conge Service: http://localhost:8083/swagger-ui.html
- Paie Service: http://localhost:8082/swagger-ui.html

**Note:** When using Swagger directly, you bypass the gateway. For production use, always use the gateway.

## WebSocket Endpoints (Future)

Future versions will include WebSocket support for real-time notifications:

```javascript
const socket = new WebSocket('ws://localhost:8222/ws/notifications');

socket.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Notification:', notification);
};
```

## Need Help?

- Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
- Check [CONFIGURATION.md](./CONFIGURATION.md) for setup details
- See [BEST_PRACTICES.md](./BEST_PRACTICES.md) for development guidelines
- Check Eureka dashboard: http://localhost:8761
- Review service logs for detailed error messages
