import os
import re

base_dir = r"c:/Users/HP PROBOOK/Downloads/SAMS-main/SAMS-main/sams-backend/src/main/java/com/sams/backend"

# 1. Update ActivityService
with open(f"{base_dir}/service/ActivityService.java", "r") as f:
    content = f.read()
content = content.replace("a.getStudent().getUser().getId()", "a.getStudent().getId()")
# Also fix mapping for creation
content = content.replace("studentRepository.findByUserId(userId)", "studentRepository.findByUserId(userId)")
with open(f"{base_dir}/service/ActivityService.java", "w") as f:
    f.write(content)

# 2. Update StudentService to include getStudentById
student_svc = f"{base_dir}/service/StudentService.java"
with open(student_svc, "r") as f:
    content = f.read()
if "getStudentById" not in content:
    add_method = """
    public StudentDto getStudentById(Long id) {
        return studentRepository.findById(id).map(s -> {
            StudentDto d = new StudentDto();
            d.setId(s.getId());
            d.setName(s.getUser().getName());
            d.setStudentId(s.getStudentId());
            d.setEmail(s.getUser().getEmail());
            d.setDepartment(s.getDepartment().getName());
            d.setYear(s.getYear());
            d.setDivision(s.getDivision());
            d.setTotalActivities(activityRepository.countByStudentId(s.getId()));
            return d;
        }).orElseThrow(() -> new com.sams.backend.exception.ResourceNotFoundException("Student not found"));
    }
}"""
    content = content.replace("}\n", add_method)
    with open(student_svc, "w") as f:
        f.write(content)

# 3. Update StudentController
student_ctrl = f"{base_dir}/controller/StudentController.java"
with open(student_ctrl, "r") as f:
    content = f.read()
if "getStudentById" not in content:
    add_endpoint = """
    @GetMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    public StudentDto getStudentById(@PathVariable Long id) { return studentService.getStudentById(id); }
}"""
    content = content.replace("}\n", add_endpoint)
    with open(student_ctrl, "w") as f:
        f.write(content)

# 4. GlobalExceptionHandler
geh = f"{base_dir}/exception/GlobalExceptionHandler.java"
new_geh = """package com.sams.backend.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.validation.FieldError;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex, WebRequest request) {
        return build(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request, null);
    }
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<?> handleSpringAccessDenied(org.springframework.security.access.AccessDeniedException ex, WebRequest request) {
        return build(HttpStatus.FORBIDDEN, "Forbidden", "Access is denied", request, null);
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleCustomAccessDenied(AccessDeniedException ex, WebRequest request) {
        return build(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage(), request, null);
    }
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<?> handleDuplicate(DuplicateResourceException ex, WebRequest request) {
        return build(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request, null);
    }
    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<?> handleInvalidTransition(InvalidStatusTransitionException ex, WebRequest request) {
        return build(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request, null);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, "Bad Request", "Validation Error", request, fieldErrors);
    }
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(Exception ex, WebRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Unauthorized", "Bad credentials", request, null);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobal(Exception ex, WebRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), request, null);
    }
    private ResponseEntity<?> build(HttpStatus status, String error, String message, WebRequest request, Map<String, String> fieldErrors) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));
        if (fieldErrors != null) body.put("fieldErrors", fieldErrors);
        return new ResponseEntity<>(body, status);
    }
}
"""
with open(geh, "w") as f:
    f.write(new_geh)

# 5. DataSeeder - Ensure 3 activities with different statuses
ds = f"{base_dir}/util/DataSeeder.java"
with open(ds, "r") as f:
    content = f.read()

new_activities = """
                Activity a1 = Activity.builder().student(s).category(c).title("React Hackathon").description("Built a cool app").organizer("XYZ Institute").date(java.time.LocalDate.now()).status(Activity.ActivityStatus.PENDING).build();
                Activity a2 = Activity.builder().student(s).category(c).title("Spring Boot Workshop").description("Learned API").organizer("XYZ Institute").date(java.time.LocalDate.now()).status(Activity.ActivityStatus.VERIFIED).build();
                Activity a3 = Activity.builder().student(s).category(c).title("Old Hackathon").description("Failed project").organizer("XYZ Institute").date(java.time.LocalDate.now()).status(Activity.ActivityStatus.REJECTED).build();
                activityRepository.saveAll(java.util.List.of(a1, a2, a3));
"""
content = re.sub(r'Activity a = Activity\.builder\(\).*?activityRepository\.save\(a\);', new_activities, content, flags=re.DOTALL)
with open(ds, "w") as f:
    f.write(content)

# 6. React Frontend: Login.jsx redirect
fe_dir = r"c:/Users/HP PROBOOK/Downloads/SAMS-main/SAMS-main/sams-frontend/src"
login_jsx = f"{fe_dir}/pages/Login.jsx"
with open(login_jsx, "r") as f:
    content = f.read()
# Replace the navigation logic
content = re.sub(r'if \(user\.role === ["\']ADMIN["\']\).*?\} else \{.*?\}', 
                 'if (user.role === "ADMIN") { navigate("/admin/dashboard"); } else { navigate("/student/dashboard"); }', 
                 content, flags=re.DOTALL)
with open(login_jsx, "w") as f:
    f.write(content)

# 7. React Frontend: Admin Dashboard.jsx stats
dashboard_jsx = f"{fe_dir}/pages/admin/Dashboard.jsx"
with open(dashboard_jsx, "r") as f:
    content = f.read()
content = content.replace("1250", "{stats.totalStudents || 0}")
with open(dashboard_jsx, "w") as f:
    f.write(content)
print("Done fixing Java and JSX files.")
