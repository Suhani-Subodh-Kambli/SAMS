package com.sams.backend.util;
import com.sams.backend.entity.*;
import com.sams.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired UserRepository userRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired DepartmentRepository departmentRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired ActivityRepository activityRepository;
    @Autowired PasswordEncoder encoder;

    @Override public void run(String... args) throws Exception {
        if(userRepository.count() == 0) {
            User admin = User.builder().name("Admin User").email("admin@sams.edu").password(encoder.encode("admin")).role(Role.ADMIN).build();
            userRepository.save(admin);
            
            Department deptCS = new Department(); deptCS.setName("Computer Science"); deptCS = departmentRepository.save(deptCS);
            Department deptIT = new Department(); deptIT.setName("Information Technology"); deptIT = departmentRepository.save(deptIT);
            Department deptEN = new Department(); deptEN.setName("Electronics"); deptEN = departmentRepository.save(deptEN);
            Department deptME = new Department(); deptME.setName("Mechanical"); deptME = departmentRepository.save(deptME);
            
            Department[] departments = {deptCS, deptIT, deptEN, deptME};
            
            Category catHackathon = new Category(); catHackathon.setName("Hackathon"); catHackathon = categoryRepository.save(catHackathon);
            Category catSeminar = new Category(); catSeminar.setName("Seminar"); catSeminar = categoryRepository.save(catSeminar);
            Category catSports = new Category(); catSports.setName("Sports"); catSports = categoryRepository.save(catSports);
            Category catPaper = new Category(); catPaper.setName("Paper Publication"); catPaper = categoryRepository.save(catPaper);
            Category catAcademic = new Category(); catAcademic.setName("Academic"); catAcademic = categoryRepository.save(catAcademic);
            Category catTechnical = new Category(); catTechnical.setName("Technical"); catTechnical = categoryRepository.save(catTechnical);
            Category catInternship = new Category(); catInternship.setName("Internship"); catInternship = categoryRepository.save(catInternship);
            Category catCertification = new Category(); catCertification.setName("Certification"); catCertification = categoryRepository.save(catCertification);
            Category catWorkshop = new Category(); catWorkshop.setName("Workshop"); catWorkshop = categoryRepository.save(catWorkshop);
            Category catVolunteering = new Category(); catVolunteering.setName("Volunteering"); catVolunteering = categoryRepository.save(catVolunteering);
            
            Category[] categories = {catHackathon, catSeminar, catSports, catPaper, catAcademic, catTechnical, catInternship, catCertification, catWorkshop, catVolunteering};
            
            User studentUser = User.builder().name("Suhani").email("student@sams.edu").password(encoder.encode("student")).role(Role.STUDENT).build();
            studentUser = userRepository.save(studentUser);
            Student student = Student.builder().studentId("S12345").department(deptCS).year("3rd Year").division("A").user(studentUser).build();
            student = studentRepository.save(student);
            
            Activity a1 = Activity.builder().student(student).category(catHackathon).title("React Hackathon").description("Built a cool app").organizer("XYZ Institute").date(LocalDate.now()).status(ActivityStatus.PENDING).build();
            Activity a2 = Activity.builder().student(student).category(catHackathon).title("Spring Boot Workshop").description("Learned API").organizer("XYZ Institute").date(LocalDate.now()).status(ActivityStatus.VERIFIED).build();
            Activity a3 = Activity.builder().student(student).category(catHackathon).title("Old Hackathon").description("Failed project").organizer("XYZ Institute").date(LocalDate.now()).status(ActivityStatus.REJECTED).build();
            activityRepository.saveAll(List.of(a1, a2, a3));

            String[] names = {"Rahul", "Neha", "Amit", "Priya", "Vikram", "Anjali", "Rohan", "Sneha", "Karan", "Pooja"};
            String[] years = {"1st Year", "2nd Year", "3rd Year", "4th Year"};
            String[] divisions = {"A", "B", "C"};
            ActivityStatus[] statuses = {ActivityStatus.PENDING, ActivityStatus.VERIFIED, ActivityStatus.REJECTED};
            
            Random random = new Random();
            List<Activity> additionalActivities = new ArrayList<>();
            
            for (int i = 0; i < 10; i++) {
                String name = names[i];
                User u = User.builder().name(name).email(name.toLowerCase() + "@sams.edu").password(encoder.encode("student123")).role(Role.STUDENT).build();
                u = userRepository.save(u);
                
                Department d = departments[random.nextInt(departments.length)];
                String year = years[random.nextInt(years.length)];
                String div = divisions[random.nextInt(divisions.length)];
                
                Student s = Student.builder().studentId("S900" + i).department(d).year(year).division(div).user(u).build();
                s = studentRepository.save(s);
                
                int numActivities = random.nextInt(5) + 1; // 1 to 5
                for (int j = 0; j < numActivities; j++) {
                    Category c = categories[random.nextInt(categories.length)];
                    ActivityStatus status = statuses[random.nextInt(statuses.length)];
                    LocalDate date = LocalDate.now().minusDays(random.nextInt(365));
                    
                    Activity act = Activity.builder().student(s).category(c).title(c.getName() + " " + j).description("Description for " + c.getName()).organizer("College").date(date).status(status).build();
                    additionalActivities.add(act);
                }
            }
            activityRepository.saveAll(additionalActivities);
        }
    }
}