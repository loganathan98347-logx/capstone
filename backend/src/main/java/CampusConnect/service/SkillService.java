package CampusConnect.service;

import CampusConnect.entity.Skill;
import CampusConnect.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id).orElse(null);
    }

    public Skill createSkill(String name) {
        Skill existing = skillRepository.findByName(name);
        if (existing != null) {
            return existing;
        }
        Skill skill = new Skill();
        skill.setName(name);
        return skillRepository.save(skill);
    }

    public Skill updateSkill(Long id, String name) {
        Skill skill = skillRepository.findById(id).orElse(null);
        if (skill == null) {
            return null;
        }
        skill.setName(name);
        return skillRepository.save(skill);
    }

    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
