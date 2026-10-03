package com.sams.backend.dto;
import lombok.Data;
import lombok.Builder;
@Data @Builder public class AdminStatsDto {
    private long totalStudents;
    private long totalActivities;
    private long pending;
    private long verified;
    private long rejected;
}