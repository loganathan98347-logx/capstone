package CampusConnect.service;

import CampusConnect.entity.Company;
import CampusConnect.repository.CompanyRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // =========================================================
    // GET ALL COMPANIES
    // =========================================================

    public List<Company> getAllCompanies() {

        return companyRepository.findAll();
    }

    // =========================================================
    // GET COMPANY BY ID
    // =========================================================

    public Company getCompanyById(Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found with id: " + id
                        )
                );
    }

    // =========================================================
    // GET COMPANY BY USER ID
    // =========================================================
    //
    // User ID
    //    ↓
    // company.user_id
    //    ↓
    // Company
    //
    // =========================================================

    public Company getCompanyByUserId(Long userId) {

        return companyRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found for user id: " + userId
                        )
                );
    }

    // =========================================================
    // SEARCH COMPANIES
    // =========================================================

    public List<Company> searchCompanies(String keyword) {

        return companyRepository
                .findByNameContainingIgnoreCase(keyword);
    }
}