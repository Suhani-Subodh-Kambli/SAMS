package com.sams.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank @Size(min = 4) private String password;
    @NotBlank private String studentId;
    @NotBlank private String department;
    @NotBlank private String year;
    @NotBlank private String division;
}