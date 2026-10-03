package com.sams.backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
@Data public class ActivityRequest {
    @NotBlank private String title;
    @NotBlank private String category;
    @NotBlank private String description;
    @NotBlank private String organizer;
    @NotNull private LocalDate date;
}