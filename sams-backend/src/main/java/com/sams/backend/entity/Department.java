package com.sams.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity @Table(name="departments") @Data @NoArgsConstructor @AllArgsConstructor
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true) private String name;
    @OneToMany(mappedBy = "department") private List<Student> students;
}