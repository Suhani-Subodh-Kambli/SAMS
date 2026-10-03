package com.sams.backend.repository;
import com.sams.backend.entity.Activity;
import com.sams.backend.entity.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentId(Long studentId);
    List<Activity> findByStatus(ActivityStatus status);
    @Query("SELECT COUNT(a) FROM Activity a WHERE a.student.id = :studentId")
    long countByStudentId(@Param("studentId") Long studentId);
    long countByStatus(ActivityStatus status);
}