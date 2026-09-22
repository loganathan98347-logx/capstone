package CampusConnect.controller;

import CampusConnect.entity.Company;
import CampusConnect.service.CompanyService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // =========================================================
    // GET ALL COMPANIES
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {

        return ResponseEntity.ok(
                companyService.getAllCompanies()
        );
    }


    // =========================================================
    // GET COMPANY BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                companyService.getCompanyById(id)
        );
    }


    // =========================================================
    // GET COMPANY BY USER ID
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCompanyByUserId(
            @PathVariable Long userId
    ) {

        try {

            Company company =
                    companyService.getCompanyByUserId(userId);

            return ResponseEntity.ok(company);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // SEARCH COMPANIES
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                companyService.searchCompanies(keyword)
        );
    }
}