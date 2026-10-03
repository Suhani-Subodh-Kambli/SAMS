package com.sams.backend.service;
import com.sams.backend.dto.*;
import com.sams.backend.entity.*;
import com.sams.backend.exception.*;
import com.sams.backend.repository.*;
import com.sams.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {
    @Autowired ActivityRepository activityRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired StudentRepository studentRepository;

    private Long getCurrentUserId() {
        return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
    }
    
    private ActivityDto toDto(Activity a) {
        ActivityDto d = new ActivityDto();
        d.setId(a.getId());
        d.setStudentId(a.getStudent().getId());
        d.setStudentName(a.getStudent().getUser().getName());
        d.setTitle(a.getTitle());
        d.setCategory(a.getCategory().getName());
        d.setDescription(a.getDescription());
        d.setOrganizer(a.getOrganizer());
        d.setDate(a.getDate());
        d.setStatus(a.getStatus().name());
        return d;
    }

    public List<ActivityDto> getMyActivities() {
        Long userId = getCurrentUserId();
        Student student = studentRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user " + userId));
        return activityRepository.findByStudentId(student.getId()).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ActivityDto> getAllActivities(String status) {
        if(status != null && !status.isEmpty()) {
            return activityRepository.findByStatus(ActivityStatus.valueOf(status.toUpperCase())).stream().map(this::toDto).collect(Collectors.toList());
        }
        return activityRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ActivityDto createActivity(ActivityRequest req) {
        Student student = studentRepository.findByUserId(getCurrentUserId()).orElseThrow(() -> new ResourceNotFoundException("Student profile not found for the current user"));
        Category cat = categoryRepository.findByNameIgnoreCase(req.getCategory()).orElseGet(() -> {
            Category c = new Category(); c.setName(req.getCategory()); return categoryRepository.save(c);
        });
        Activity a = Activity.builder().title(req.getTitle()).description(req.getDescription()).organizer(req.getOrganizer()).date(req.getDate()).student(student).category(cat).status(ActivityStatus.PENDING).build();
        return toDto(activityRepository.save(a));
    }

    @Transactional
    public void deleteActivity(Long id) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        if(!isAdmin) {
            Student student = studentRepository.findByUserId(getCurrentUserId()).orElseThrow(() -> new ResourceNotFoundException("Student profile not found for the current user"));
            if(!a.getStudent().getId().equals(student.getId())) throw new AccessDeniedException("Not your activity");
            if(a.getStatus() != ActivityStatus.PENDING) throw new InvalidStatusTransitionException("Only PENDING activities can be deleted");
        }
        activityRepository.delete(a);
    }
    
    @Transactional
    public ActivityDto updateStatus(Long id, String status) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        if(a.getStatus() != ActivityStatus.PENDING) throw new InvalidStatusTransitionException("Can only update status from PENDING");
        a.setStatus(ActivityStatus.valueOf(status.toUpperCase()));
        return toDto(activityRepository.save(a));
    }

    @Transactional
    public ActivityDto updateActivity(Long id, ActivityRequest req) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        Student student = studentRepository.findByUserId(getCurrentUserId()).orElseThrow(() -> new ResourceNotFoundException("Student profile not found for the current user"));
        if(!a.getStudent().getId().equals(student.getId())) throw new AccessDeniedException("Not your activity");
        if(a.getStatus() != ActivityStatus.PENDING) throw new InvalidStatusTransitionException("Only PENDING activities can be updated");
        
        Category cat = categoryRepository.findByNameIgnoreCase(req.getCategory()).orElseGet(() -> {
            Category c = new Category(); c.setName(req.getCategory()); return categoryRepository.save(c);
        });
        a.setTitle(req.getTitle());
        a.setDescription(req.getDescription());
        a.setOrganizer(req.getOrganizer());
        a.setDate(req.getDate());
        a.setCategory(cat);
        return toDto(activityRepository.save(a));
    }
}