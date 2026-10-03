# SAMS Backend and Frontend Integration

This repository contains the backend for the Student Activity Management System (SAMS) and the integrated React frontend.

## 1. Environment Setup

### MySQL Database Setup
Ensure you have MySQL running on port 3306.
Create the database:
```sql
CREATE DATABASE sams_db;
```

### Backend Setup
The backend is a Spring Boot application built with Java 17.
Environment Variables required (or defaults used in `application.properties`):
- `DB_URL`: `jdbc:mysql://localhost:3306/sams_db?createDatabaseIfNotExist=true&useSSL=false`
- `DB_USERNAME`: root (default)
- `DB_PASSWORD`: root (default)
- `JWT_SECRET`: your_secret
- `JWT_EXPIRATION`: 86400000

Run backend:
```bash
cd sams-backend
mvn spring-boot:run
```

Swagger UI will be available at: http://localhost:8080/swagger-ui.html

### Frontend Setup
In the `sams-frontend` folder, create a `.env` file:
```
VITE_API_URL=http://localhost:8080/api/v1
```

Run frontend:
```bash
cd sams-frontend
npm install
npm run dev
```

## 2. ER Description
- **User**: Core entity for login (id, email, password, role)
- **Student**: Tied one-to-one with User. Contains profile info (studentId, year, division).
- **Department**: One-to-Many with Student.
- **Category**: One-to-Many with Activity.
- **Activity**: The main resource. Linked to Student and Category. Status tracks PENDING, VERIFIED, REJECTED.

## 3. Endpoints Table

| Method | URL | Role | Description |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Any | Login and get JWT |
| POST | `/api/v1/auth/register` | Any | Register a student |
| GET | `/api/v1/activities` | ADMIN | Get all activities |
| GET | `/api/v1/activities/my` | STUDENT | Get own activities |
| POST | `/api/v1/activities` | STUDENT | Submit new activity |
| PATCH | `/api/v1/activities/{id}/status` | ADMIN | Verify/Reject activity |
| GET | `/api/v1/students` | ADMIN | List students |

## 4. Postman Collection
A collection skeleton would usually be imported into Postman. You can recreate the endpoints based on the table above and add a global `{{token}}` variable.

*Note: The scaffolding for entities, DTOs, security config, and repositories has been set up. The full set of services and controllers requires implementation.*
