package CampusConnect.service;

import CampusConnect.dto.JobRequest;
import CampusConnect.dto.JobResponse;
import CampusConnect.entity.Company;
import CampusConnect.entity.Job;
import CampusConnect.entity.Skill;
import CampusConnect.repository.CompanyRepository;
import CampusConnect.repository.JobRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobService(
            JobRepository jobRepository,
            CompanyRepository companyRepository
    ) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    // =========================================================
    // GET ALL JOBS
    // =========================================================

    public List<JobResponse> getAllJobs() {

        List<Job> jobs = jobRepository.findAll();

        return jobs.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // GET JOB BY ID
    // =========================================================

    public JobResponse getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElse(null);

        if (job == null) {
            return null;
        }

        return convertToResponse(job);
    }

    // =========================================================
    // GET JOBS BY COMPANY ID
    // =========================================================

    public List<JobResponse> getJobsByCompanyId(Long companyId) {

        List<Job> jobs =
                jobRepository.findByCompanyId(companyId);

        return jobs.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // SEARCH JOBS
    // =========================================================

    public List<JobResponse> searchJobs(String title) {

        List<Job> jobs =
                jobRepository.findByTitleContainingIgnoreCase(title);

        return jobs.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // FILTER JOBS BY TYPE
    // =========================================================

    public List<JobResponse> filterByType(String jobType) {

        List<Job> jobs =
                jobRepository.findByJobType(jobType);

        return jobs.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // CREATE JOB
    // =========================================================

    public JobResponse createJob(
            JobRequest request,
            Long userId
    ) {

        // Find company using logged-in user's ID
        Company company = companyRepository
                .findByUserId(userId)
                .orElse(null);

        if (company == null) {

            throw new RuntimeException(
                    "Company profile not found for this user"
            );
        }

        // Create new job
        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalary(request.getSalary());
        job.setDeadline(request.getDeadline());
        job.setOpenings(request.getOpenings());

        // Connect job with company
        job.setCompany(company);

        // Set created date
        job.setCreatedAt(LocalDate.now());

        // Save job
        Job savedJob = jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    // =========================================================
    // UPDATE JOB
    // =========================================================

    public JobResponse updateJob(
            Long id,
            Job updated
    ) {

        Job job = jobRepository.findById(id)
                .orElse(null);

        if (job == null) {
            return null;
        }

        job.setTitle(updated.getTitle());
        job.setDescription(updated.getDescription());
        job.setLocation(updated.getLocation());
        job.setJobType(updated.getJobType());
        job.setSalary(updated.getSalary());
        job.setDeadline(updated.getDeadline());
        job.setOpenings(updated.getOpenings());
        job.setSkills(updated.getSkills());

        Job savedJob = jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    // =========================================================
    // DELETE JOB
    // =========================================================

    public void deleteJob(Long id) {

        if (!jobRepository.existsById(id)) {

            throw new RuntimeException(
                    "Job not found"
            );
        }

        jobRepository.deleteById(id);
    }

    // =========================================================
    // CONVERT JOB TO RESPONSE
    // =========================================================

    private JobResponse convertToResponse(Job job) {

        JobResponse response = new JobResponse();

        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setSalary(job.getSalary());
        response.setDeadline(job.getDeadline());
        response.setOpenings(job.getOpenings());
        response.setCreatedAt(job.getCreatedAt());

        // =====================================================
        // COMPANY INFORMATION
        // =====================================================

        if (job.getCompany() != null) {

            response.setCompanyId(
                    job.getCompany().getId()
            );

            response.setCompanyName(
                    job.getCompany().getName()
            );
        }

        // =====================================================
        // SKILLS
        // =====================================================

        if (job.getSkills() != null) {

            List<String> skillNames =
                    job.getSkills()
                            .stream()
                            .map(Skill::getName)
                            .toList();

            response.setSkills(skillNames);

        } else {

            response.setSkills(
                    new ArrayList<>()
            );
        }

        return response;
    }
}