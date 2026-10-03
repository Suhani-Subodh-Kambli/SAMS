package com.sams.backend.controller;
import com.sams.backend.dto.*;
import com.sams.backend.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/activities")
public class ActivityController {
    @Autowired ActivityService activityService;
    
    @GetMapping("/my") @PreAuthorize("hasRole('STUDENT')")
    public List<ActivityDto> getMyActivities() { return activityService.getMyActivities(); }
    
    @GetMapping @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityDto> getAllActivities(@RequestParam(required=false) String status) { return activityService.getAllActivities(status); }
    
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('STUDENT')")
    public ActivityDto createActivity(@Valid @RequestBody ActivityRequest req) { return activityService.createActivity(req); }
    
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable Long id) { activityService.deleteActivity(id); }
    
    @PatchMapping("/{id}/status") @PreAuthorize("hasRole('ADMIN')")
    public ActivityDto updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) { return activityService.updateStatus(id, req.getStatus()); }

    @PutMapping("/{id}") @PreAuthorize("hasRole('STUDENT')")
    public ActivityDto updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityRequest req) { return activityService.updateActivity(id, req); }
}