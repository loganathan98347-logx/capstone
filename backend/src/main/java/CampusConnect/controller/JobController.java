package CampusConnect.controller;

import CampusConnect.dto.JobRequest;
import CampusConnect.dto.JobResponse;
import CampusConnect.entity.Job;
import CampusConnect.service.JobService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // =========================================================
    // GET ALL JOBS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

    // =========================================================
    // GET JOB BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(
            @PathVariable Long id
    ) {

        JobResponse job = jobService.getJobById(id);

        if (job == null) {

            return ResponseEntity
                    .status(404)
                    .body(Map.of(
                            "error",
                            "Job not found"
                    ));
        }

        return ResponseEntity.ok(job);
    }

    // =========================================================
    // GET JOBS BY COMPANY
    // =========================================================

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobResponse>> getJobsByCompanyId(
            @PathVariable Long companyId
    ) {

        return ResponseEntity.ok(
                jobService.getJobsByCompanyId(companyId)
        );
    }

    // =========================================================
    // SEARCH JOBS
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> searchJobs(
            @RequestParam String title
    ) {

        return ResponseEntity.ok(
                jobService.searchJobs(title)
        );
    }

    // =========================================================
    // FILTER BY JOB TYPE
    // =========================================================

    @GetMapping("/filter")
    public ResponseEntity<List<JobResponse>> filterByType(
            @RequestParam String jobType
    ) {

        return ResponseEntity.ok(
                jobService.filterByType(jobType)
        );
    }

    // =========================================================
    // CREATE JOB
    // =========================================================
    //
    // Frontend sends:
    //
    // POST /api/jobs?userId=5
    //
    // userId → Company.user_id → Company
    //
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createJob(
            @RequestBody JobRequest request,
            @RequestParam Long userId
    ) {

        try {

            JobResponse response =
                    jobService.createJob(request, userId);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // =========================================================
    // UPDATE JOB
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @RequestBody Job job
    ) {

        JobResponse updated =
                jobService.updateJob(id, job);

        if (updated == null) {

            return ResponseEntity
                    .status(404)
                    .body(Map.of(
                            "error",
                            "Job not found"
                    ));
        }

        return ResponseEntity.ok(updated);
    }

    // =========================================================
    // DELETE JOB
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long id
    ) {

        try {

            jobService.deleteJob(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(404)
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}