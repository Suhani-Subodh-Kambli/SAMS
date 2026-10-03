package com.sams.backend.repository;
import com.sams.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByStudentId(String studentId);
}