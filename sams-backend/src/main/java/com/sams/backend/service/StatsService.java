package com.sams.backend.service;
import com.sams.backend.dto.*;
import com.sams.backend.entity.ActivityStatus;
import com.sams.backend.repository.ActivityRepository;
import com.sams.backend.repository.StudentRepository;
import com.sams.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class StatsService {
    @Autowired ActivityRepository activityRepository;
    @Autowired StudentRepository studentRepository;

    public AdminStatsDto getAdminStats() {
        return AdminStatsDto.builder()
            .totalStudents(studentRepository.count())
            .totalActivities(activityRepository.count())
            .pending(activityRepository.countByStatus(ActivityStatus.PENDING))
            .verified(activityRepository.countByStatus(ActivityStatus.VERIFIED))
            .rejected(activityRepository.countByStatus(ActivityStatus.REJECTED))
            .build();
    }
    
    public StudentStatsDto getStudentStats() {
        Long userId = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long studentId = studentRepository.findByUserId(userId).orElseThrow().getId();
        long total = activityRepository.countByStudentId(studentId);
        long pending = activityRepository.findByStudentId(studentId).stream().filter(a -> a.getStatus()==ActivityStatus.PENDING).count();
        long verified = activityRepository.findByStudentId(studentId).stream().filter(a -> a.getStatus()==ActivityStatus.VERIFIED).count();
        long rejected = total - pending - verified;
        return StudentStatsDto.builder().total(total).pending(pending).verified(verified).rejected(rejected).build();
    }
}