package com.sams.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity @Table(name="activities") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Activity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    @Column(columnDefinition="TEXT") private String description;
    private String organizer;
    private LocalDate date;
    @Enumerated(EnumType.STRING) private ActivityStatus status;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="student_id") @ToString.Exclude @EqualsAndHashCode.Exclude private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="category_id") private Category category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); if(status == null) status = ActivityStatus.PENDING; }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}