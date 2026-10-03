package com.sams.backend.dto;
import lombok.Data;
@Data public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String studentId;
    private String department;
    private String year;
    private String division;
}