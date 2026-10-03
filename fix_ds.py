import os
import re

ds = r"c:/Users/HP PROBOOK/Downloads/SAMS-main/SAMS-main/sams-backend/src/main/java/com/sams/backend/util/DataSeeder.java"
with open(ds, "r") as f:
    content = f.read()

new_activities = """
                Student student = studentRepository.findByUserId(st.getId()).orElseThrow();
                Category cat = categoryRepository.findByName("Hackathon").orElseThrow();
                
                Activity a1 = Activity.builder().student(student).category(cat).title("React Hackathon").description("Built a cool app").organizer("XYZ Institute").date(java.time.LocalDate.now()).status(com.sams.backend.entity.ActivityStatus.PENDING).build();
                Activity a2 = Activity.builder().student(student).category(cat).title("Spring Boot Workshop").description("Learned API").organizer("XYZ Institute").date(java.time.LocalDate.now()).status(com.sams.backend.entity.ActivityStatus.VERIFIED).build();
                Activity a3 = Activity.builder().student(student).category(cat).title("Old Hackathon").description("Failed project").organizer("XYZ Institute").date(java.time.LocalDate.now()).status(com.sams.backend.entity.ActivityStatus.REJECTED).build();
                activityRepository.saveAll(java.util.List.of(a1, a2, a3));
"""
content = re.sub(r'Activity a1 = Activity\.builder\(\).*?activityRepository\.saveAll\(java\.util\.List\.of\(a1, a2, a3\)\);', new_activities, content, flags=re.DOTALL)
with open(ds, "w") as f:
    f.write(content)
print("Fixed DataSeeder")
