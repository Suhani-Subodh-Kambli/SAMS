package com.sams.backend.controller;
import com.sams.backend.dto.*;
import com.sams.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired AuthService authService;
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest req) { return authService.login(req); }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public void register(@Valid @RequestBody RegisterRequest req) { authService.register(req); }
}