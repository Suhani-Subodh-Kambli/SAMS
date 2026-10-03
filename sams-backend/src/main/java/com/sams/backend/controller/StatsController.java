package com.sams.backend.controller;
import com.sams.backend.dto.*;
import com.sams.backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/stats")
public class StatsController {
    @Autowired StatsService statsService;
    @GetMapping("/admin") @PreAuthorize("hasRole('ADMIN')") public AdminStatsDto getAdminStats() { return statsService.getAdminStats(); }
    @GetMapping("/me") @PreAuthorize("hasRole('STUDENT')") public StudentStatsDto getStudentStats() { return statsService.getStudentStats(); }
}