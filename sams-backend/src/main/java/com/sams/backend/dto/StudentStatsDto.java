package com.sams.backend.dto;
import lombok.Data;
import lombok.Builder;
@Data @Builder public class StudentStatsDto {
    private long total;
    private long verified;
    private long pending;
    private long rejected;
}