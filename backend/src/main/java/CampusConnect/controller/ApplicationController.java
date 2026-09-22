package CampusConnect.controller;

import CampusConnect.entity.Application;
import CampusConnect.service.ApplicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService
    ) {
        this.applicationService = applicationService;
    }


    // =========================================================
    // STUDENT APPLY FOR JOB
    // =========================================================

    @PostMapping
    public ResponseEntity<?> apply(
            @RequestBody Map<String, Long> request
    ) {

        try {

            Long userId = request.get("userId");
            Long jobId = request.get("jobId");

            if (userId == null || jobId == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "userId and jobId are required"
                                )
                        );
            }

            Application application =
                    applicationService.applyForJob(
                            userId,
                            jobId
                    );

            return ResponseEntity.ok(application);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET STUDENT APPLICATIONS
    // =========================================================

    @GetMapping("/student")
    public ResponseEntity<?> getStudentApplications(
            @RequestParam Long userId
    ) {

        try {

            List<Application> applications =
                    applicationService
                            .getStudentApplications(userId);

            return ResponseEntity.ok(applications);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET APPLICATIONS FOR ONE JOB
    // =========================================================

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(
            @PathVariable Long jobId
    ) {

        try {

            List<Application> applications =
                    applicationService
                            .getJobApplications(jobId);

            return ResponseEntity.ok(applications);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET ALL APPLICATIONS FOR COMPANY
    // =========================================================

    @GetMapping("/company")
    public ResponseEntity<?> getCompanyApplications(
            @RequestParam Long userId
    ) {

        try {

            List<Application> applications =
                    applicationService
                            .getCompanyApplications(userId);

            return ResponseEntity.ok(applications);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {

        try {

            String status = request.get("status");

            if (status == null || status.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "status is required"
                                )
                        );
            }

            Application application =
                    applicationService
                            .updateApplicationStatus(
                                    id,
                                    status
                            );

            return ResponseEntity.ok(application);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // GET APPLICATION BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(
            @PathVariable Long id
    ) {

        try {

            Application application =
                    applicationService
                            .getApplicationById(id);

            return ResponseEntity.ok(application);

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
}