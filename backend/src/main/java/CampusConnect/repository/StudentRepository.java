package CampusConnect.repository;

import CampusConnect.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Student findByEmail(String email);

    Student findByUserId(Long userId);
}