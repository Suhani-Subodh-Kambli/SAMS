package com.sams.backend.service;
import com.sams.backend.dto.*;
import com.sams.backend.entity.*;
import com.sams.backend.exception.DuplicateResourceException;
import com.sams.backend.repository.*;
import com.sams.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired DepartmentRepository departmentRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication.getName());
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        UserDto dto = new UserDto();
        dto.setId(user.getId()); dto.setName(user.getName()); dto.setEmail(user.getEmail()); dto.setRole(user.getRole().name());
        if(user.getRole() == Role.STUDENT && user.getStudent() != null) {
            dto.setStudentId(user.getStudent().getStudentId());
            dto.setDepartment(user.getStudent().getDepartment().getName());
            dto.setYear(user.getStudent().getYear());
            dto.setDivision(user.getStudent().getDivision());
        }
        AuthResponse res = new AuthResponse(); res.setToken(jwt); res.setUser(dto);
        return res;
    }

    @Transactional
    public void register(RegisterRequest req) {
        if(userRepository.existsByEmail(req.getEmail())) throw new DuplicateResourceException("Email already in use");
        if(studentRepository.findByStudentId(req.getStudentId()).isPresent()) throw new DuplicateResourceException("Student ID already exists");
        
        Department dept = departmentRepository.findByName(req.getDepartment()).orElseGet(() -> {
            Department d = new Department(); d.setName(req.getDepartment()); return departmentRepository.save(d);
        });

        User user = User.builder().name(req.getName()).email(req.getEmail()).password(encoder.encode(req.getPassword())).role(Role.STUDENT).build();
        user = userRepository.save(user);
        
        Student student = Student.builder().user(user).studentId(req.getStudentId()).department(dept).year(req.getYear()).division(req.getDivision()).build();
        studentRepository.save(student);
    }
}