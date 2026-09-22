package CampusConnect.service;

import CampusConnect.entity.Application;
import CampusConnect.entity.Company;
import CampusConnect.entity.Job;
import CampusConnect.entity.Student;
import CampusConnect.repository.ApplicationRepository;
import CampusConnect.repository.CompanyRepository;
import CampusConnect.repository.JobRepository;
import CampusConnect.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository,
            CompanyRepository companyRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    // =========================================================
    // STUDENT APPLY FOR JOB
    // =========================================================

    public Application applyForJob(Long userId, Long jobId) {

        Student student = studentRepository.findByUserId(userId);

        if (student == null) {
            throw new RuntimeException(
                    "Student profile not found for this user"
            );
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        boolean alreadyApplied =
                applicationRepository
                        .existsByStudent_IdAndJob_Id(
                                student.getId(),
                                job.getId()
                        );

        if (alreadyApplied) {
            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

        Application application = new Application();

        application.setStudent(student);
        application.setJob(job);
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }


    // =========================================================
    // GET STUDENT APPLICATIONS
    // =========================================================

    public List<Application> getStudentApplications(Long userId) {

        Student student = studentRepository.findByUserId(userId);

        if (student == null) {
            throw new RuntimeException(
                    "Student profile not found for this user"
            );
        }

        return applicationRepository.findByStudent_Id(
                student.getId()
        );
    }


    // =========================================================
    // GET APPLICATION BY ID
    // =========================================================

    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found"
                        )
                );
    }


    // =========================================================
    // GET APPLICATIONS FOR A JOB
    // =========================================================

    public List<Application> getJobApplications(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        return applicationRepository.findByJob_Id(
                job.getId()
        );
    }


    // =========================================================
    // GET ALL APPLICATIONS FOR COMPANY
    // =========================================================

    public List<Application> getCompanyApplications(Long userId) {

        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company profile not found for this user"
                        )
                );

        List<Job> companyJobs =
                jobRepository.findByCompanyId(company.getId());

        return companyJobs.stream()
                .flatMap(job ->
                        applicationRepository
                                .findByJob_Id(job.getId())
                                .stream()
                )
                .toList();
    }


    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    public Application updateApplicationStatus(
            Long applicationId,
            String status
    ) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException(
                    "Application status is required"
            );
        }

        String normalizedStatus =
                status.trim().toUpperCase();

        if (!normalizedStatus.equals("APPLIED")
                && !normalizedStatus.equals("SHORTLISTED")
                && !normalizedStatus.equals("REJECTED")
                && !normalizedStatus.equals("SELECTED")) {

            throw new RuntimeException(
                    "Invalid application status"
            );
        }

        application.setStatus(normalizedStatus);

        return applicationRepository.save(application);
    }
}