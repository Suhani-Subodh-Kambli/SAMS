package com.sams.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity @Table(name="categories") @Data @NoArgsConstructor @AllArgsConstructor
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true) private String name;
    @OneToMany(mappedBy = "category") private List<Activity> activities;
}