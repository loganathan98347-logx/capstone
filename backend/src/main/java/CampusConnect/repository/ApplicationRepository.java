package CampusConnect.repository;

import CampusConnect.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    // Get all applications of a particular student
    List<Application> findByStudent_Id(Long studentId);

    // Get all applications for a particular job
    List<Application> findByJob_Id(Long jobId);

    // Check whether student already applied for this job
    boolean existsByStudent_IdAndJob_Id(
            Long studentId,
            Long jobId
    );
}