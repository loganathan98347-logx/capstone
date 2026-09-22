package CampusConnect.repository;

import CampusConnect.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUserId(Long userId);

    List<Company> findByNameContainingIgnoreCase(String name);
}