package CampusConnect.repository;

import CampusConnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByCompanyId(Long companyId);

    List<Job> findByTitleContainingIgnoreCase(String title);

    List<Job> findByJobType(String jobType);
}
