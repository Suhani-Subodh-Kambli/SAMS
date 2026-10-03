package com.sams.backend.dto;
import lombok.Data;
@Data public class StudentDto {
    private Long id;
    private String name;
    private String studentId;
    private String email;
    private String department;
    private String year;
    private String division;
    private Long totalActivities;
}