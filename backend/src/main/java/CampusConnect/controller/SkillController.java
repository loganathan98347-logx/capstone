package CampusConnect.controller;

import CampusConnect.entity.Skill;
import CampusConnect.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSkillById(@PathVariable Long id) {
        Skill skill = skillService.getSkillById(id);
        if (skill == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Skill not found"));
        }
        return ResponseEntity.ok(skill);
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(skillService.createSkill(request.get("name")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkill(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Skill updated = skillService.updateSkill(id, request.get("name"));
        if (updated == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Skill not found"));
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
