package com.sams.backend.dto;
import lombok.Data;
@Data public class AuthResponse {
    private String token;
    private UserDto user;
}