package CampusConnect.service;

import CampusConnect.entity.Student;
import CampusConnect.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Create student
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    // Get student by user ID
    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    // Update student
    public Student updateStudent(Long id, Student updated) {

        Student student =
                studentRepository.findById(id).orElse(null);

        if (student == null) {
            return null;
        }

        student.setName(updated.getName());

        student.setEmail(updated.getEmail());

        student.setDepartment(updated.getDepartment());

        student.setCollege(updated.getCollege());

        student.setGraduationYear(
                updated.getGraduationYear()
        );

        student.setCgpa(
                updated.getCgpa()
        );

        student.setSkills(
                updated.getSkills()
        );

        return studentRepository.save(student);
    }

    // Delete student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}