package com.sams.backend.exception;
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
    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<?> handleNoSuchElement(java.util.NoSuchElementException ex, WebRequest request) {
        return build(HttpStatus.NOT_FOUND, "Not Found", "Resource not found: " + ex.getMessage(), request, null);
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
