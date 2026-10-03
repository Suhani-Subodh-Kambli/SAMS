package com.sams.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity @Table(name="students") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true) private String studentId;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="department_id") private Department department;
    private String year;
    private String division;
    @OneToOne @JoinColumn(name="user_id") @ToString.Exclude @EqualsAndHashCode.Exclude private User user;
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL) private List<Activity> activities;
}