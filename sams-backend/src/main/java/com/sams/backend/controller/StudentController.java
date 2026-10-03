package com.sams.backend.controller;
import com.sams.backend.dto.StudentDto;
import com.sams.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/students")
public class StudentController {
    @Autowired StudentService studentService;
    
    @GetMapping @PreAuthorize("hasRole('ADMIN')")
    public List<StudentDto> getAllStudents() { return studentService.getAllStudents(); }

    @GetMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    public StudentDto getStudentById(@PathVariable Long id) { return studentService.getStudentById(id); }
}