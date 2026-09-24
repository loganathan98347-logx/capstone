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

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found with id: " + id
                        )
                );
    }

    public Company getCompanyByUserId(Long userId) {
        return companyRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found for user id: " + userId
                        )
                );
    }

    public List<Company> searchCompanies(String keyword) {
        return companyRepository.findByNameContainingIgnoreCase(keyword);
    }

    // UPDATE COMPANY
    public Company updateCompany(Long id, Company updatedCompany) {

        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company not found with id: " + id
                        )
                );

        existingCompany.setName(updatedCompany.getName());
        existingCompany.setDescription(updatedCompany.getDescription());
        existingCompany.setEmail(updatedCompany.getEmail());
        existingCompany.setIndustry(updatedCompany.getIndustry());
        existingCompany.setLocation(updatedCompany.getLocation());
        existingCompany.setWebsite(updatedCompany.getWebsite());

        return companyRepository.save(existingCompany);
    }
}