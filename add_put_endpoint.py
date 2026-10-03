import os

base_dir = r"c:/Users/HP PROBOOK/Downloads/SAMS-main/SAMS-main/sams-backend/src/main/java/com/sams/backend"

# 1. Update ActivityController to add PUT
ctrl = f"{base_dir}/controller/ActivityController.java"
with open(ctrl, "r") as f:
    content = f.read()

if "@PutMapping" not in content:
    put_endpoint = """
    @PutMapping("/{id}") @PreAuthorize("hasRole('STUDENT')")
    public ActivityDto updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityRequest req) { return activityService.updateActivity(id, req); }
}"""
    content = content.replace("}\n", put_endpoint)
    with open(ctrl, "w") as f:
        f.write(content)

# 2. Update ActivityService to add updateActivity
svc = f"{base_dir}/service/ActivityService.java"
with open(svc, "r") as f:
    content = f.read()

if "updateActivity" not in content:
    update_method = """
    @Transactional
    public ActivityDto updateActivity(Long id, ActivityRequest req) {
        Activity a = activityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        Student student = studentRepository.findByUserId(getCurrentUserId()).orElseThrow();
        if(!a.getStudent().getId().equals(student.getId())) throw new AccessDeniedException("Not your activity");
        if(a.getStatus() != ActivityStatus.PENDING) throw new InvalidStatusTransitionException("Only PENDING activities can be updated");
        
        Category cat = categoryRepository.findByName(req.getCategory()).orElseGet(() -> {
            Category c = new Category(); c.setName(req.getCategory()); return categoryRepository.save(c);
        });
        a.setTitle(req.getTitle());
        a.setDescription(req.getDescription());
        a.setOrganizer(req.getOrganizer());
        a.setDate(req.getDate());
        a.setCategory(cat);
        return toDto(activityRepository.save(a));
    }
}"""
    content = content.replace("}\n", update_method)
    with open(svc, "w") as f:
        f.write(content)

print("PUT endpoints added")
