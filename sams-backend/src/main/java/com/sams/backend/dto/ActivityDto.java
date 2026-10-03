package com.sams.backend.dto;
import lombok.Data;
import java.time.LocalDate;
@Data public class ActivityDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String title;
    private String category;
    private String description;
    private String organizer;
    private LocalDate date;
    private String status;
}