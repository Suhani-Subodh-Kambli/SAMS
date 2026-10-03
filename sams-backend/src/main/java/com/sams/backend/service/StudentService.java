package com.sams.backend.service;
import com.sams.backend.dto.StudentDto;
import com.sams.backend.repository.ActivityRepository;
import com.sams.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    @Autowired StudentRepository studentRepository;
    @Autowired ActivityRepository activityRepository;

    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream().map(s -> {
            StudentDto d = new StudentDto();
            d.setId(s.getId());
            d.setName(s.getUser().getName());
            d.setStudentId(s.getStudentId());
            d.setEmail(s.getUser().getEmail());
            d.setDepartment(s.getDepartment().getName());
            d.setYear(s.getYear());
            d.setDivision(s.getDivision());
            d.setTotalActivities(activityRepository.countByStudentId(s.getId()));
            return d;
        }).collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long id) {
        return studentRepository.findById(id).map(s -> {
            StudentDto d = new StudentDto();
            d.setId(s.getId());
            d.setName(s.getUser().getName());
            d.setStudentId(s.getStudentId());
            d.setEmail(s.getUser().getEmail());
            d.setDepartment(s.getDepartment().getName());
            d.setYear(s.getYear());
            d.setDivision(s.getDivision());
            d.setTotalActivities(activityRepository.countByStudentId(s.getId()));
            return d;
        }).orElseThrow(() -> new com.sams.backend.exception.ResourceNotFoundException("Student not found"));
    }
}