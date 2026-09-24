package CampusConnect.service;

import CampusConnect.dto.ApplicationResponse;
import CampusConnect.entity.Application;
import CampusConnect.entity.Company;
import CampusConnect.entity.Job;
import CampusConnect.entity.Skill;
import CampusConnect.entity.Student;
import CampusConnect.repository.ApplicationRepository;
import CampusConnect.repository.CompanyRepository;
import CampusConnect.repository.JobRepository;
import CampusConnect.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    // OLD APPLY FOR JOB
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
                applicationRepository.existsByStudent_IdAndJob_Id(
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
    // NEW APPLICATION FORM SUBMISSION
    // =========================================================

    public Application submitApplication(
            Long userId,
            Long jobId,
            String fullName,
            String phoneNumber,
            String email,
            String candidateType,
            String experienceYears,
            String projects,
            String degree,
            String department,
            String address,
            String country,
            String state,
            String district,
            String town,
            MultipartFile resume
    ) {

        // -----------------------------------------------------
        // FIND STUDENT
        // -----------------------------------------------------

        Student student = studentRepository.findByUserId(userId);

        if (student == null) {
            throw new RuntimeException(
                    "Student profile not found for this user"
            );
        }

        // -----------------------------------------------------
        // FIND JOB
        // -----------------------------------------------------

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found")
                );

        // -----------------------------------------------------
        // DUPLICATE CHECK
        // -----------------------------------------------------

        boolean alreadyApplied =
                applicationRepository.existsByStudent_IdAndJob_Id(
                        student.getId(),
                        job.getId()
                );

        if (alreadyApplied) {
            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

        // -----------------------------------------------------
        // VALIDATE RESUME
        // -----------------------------------------------------

        if (resume == null || resume.isEmpty()) {
            throw new RuntimeException(
                    "Resume is required"
            );
        }

        String fileName = resume.getOriginalFilename();

        if (fileName == null || fileName.trim().isEmpty()) {
            throw new RuntimeException(
                    "Invalid resume file"
            );
        }

        String lowerName = fileName.toLowerCase();

        if (!lowerName.endsWith(".pdf")
                && !lowerName.endsWith(".doc")
                && !lowerName.endsWith(".docx")) {

            throw new RuntimeException(
                    "Resume must be PDF, DOC or DOCX"
            );
        }

        // -----------------------------------------------------
        // VALIDATE CANDIDATE TYPE
        // -----------------------------------------------------

        if (candidateType == null
                || candidateType.trim().isEmpty()) {

            throw new RuntimeException(
                    "Please select Fresher or Experienced"
            );
        }

        String normalizedType =
                candidateType.trim().toUpperCase();

        if (!normalizedType.equals("FRESHER")
                && !normalizedType.equals("EXPERIENCED")) {

            throw new RuntimeException(
                    "Invalid candidate type"
            );
        }

        // -----------------------------------------------------
        // EXPERIENCED VALIDATION
        // -----------------------------------------------------

        Double parsedExperience = null;

        if (normalizedType.equals("EXPERIENCED")) {

            if (experienceYears == null
                    || experienceYears.trim().isEmpty()) {

                throw new RuntimeException(
                        "Please enter years of experience"
                );
            }

            try {

                parsedExperience =
                        Double.parseDouble(
                                experienceYears
                        );

                if (parsedExperience < 0) {
                    throw new RuntimeException(
                            "Experience cannot be negative"
                    );
                }

            } catch (NumberFormatException e) {

                throw new RuntimeException(
                        "Invalid years of experience"
                );
            }

        }

        // -----------------------------------------------------
        // FRESHER VALIDATION
        // -----------------------------------------------------

        if (normalizedType.equals("FRESHER")) {

            if (projects == null
                    || projects.trim().isEmpty()) {

                throw new RuntimeException(
                        "Please mention your projects"
                );
            }
        }

        // -----------------------------------------------------
        // CREATE APPLICATION
        // -----------------------------------------------------

        Application application = new Application();

        application.setStudent(student);
        application.setJob(job);

        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());

        application.setFullName(fullName);
        application.setPhoneNumber(phoneNumber);
        application.setEmail(email);

        application.setCandidateType(
                normalizedType
        );

        application.setExperienceYears(
                parsedExperience
        );

        application.setProjects(projects);

        application.setDegree(degree);
        application.setDepartment(department);
        application.setAddress(address);

        application.setCountry(country);
        application.setState(state);
        application.setDistrict(district);
        application.setTown(town);

        // -----------------------------------------------------
        // SAVE RESUME
        // -----------------------------------------------------

        try {

            application.setResumeFileName(
                    fileName
            );

            application.setResumeContentType(
                    resume.getContentType()
            );

            application.setResumeData(
                    resume.getBytes()
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to save resume"
            );
        }

        // -----------------------------------------------------
        // SAVE APPLICATION
        // -----------------------------------------------------

        return applicationRepository.save(application);
    }

    // =========================================================
    // GET STUDENT APPLICATIONS
    // =========================================================

    public List<ApplicationResponse> getStudentApplications(
            Long userId
    ) {

        Student student = studentRepository.findByUserId(userId);

        if (student == null) {
            throw new RuntimeException(
                    "Student profile not found for this user"
            );
        }

        List<Application> applications =
                applicationRepository.findByStudent_Id(
                        student.getId()
                );

        return applications.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // CONVERT APPLICATION ENTITY TO RESPONSE
    // =========================================================

    private ApplicationResponse convertToResponse(
            Application application
    ) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(application.getId());

        response.setStatus(
                application.getStatus()
        );

        if (application.getAppliedAt() != null) {

            response.setAppliedAt(
                    application.getAppliedAt().toString()
            );
        }

        // -----------------------------------------------------
        // STUDENT
        // -----------------------------------------------------

        Student student = application.getStudent();

        if (student != null) {

            response.setStudentName(
                    student.getName()
            );

            response.setStudentEmail(
                    student.getEmail()
            );
        }

        // -----------------------------------------------------
        // JOB
        // -----------------------------------------------------

        Job job = application.getJob();

        if (job != null) {

            response.setJobId(
                    job.getId()
            );

            response.setJobTitle(
                    job.getTitle()
            );

            response.setLocation(
                    job.getLocation()
            );

            response.setJobType(
                    job.getJobType()
            );

            response.setSalary(
                    job.getSalary()
            );

            // -------------------------------------------------
            // COMPANY
            // -------------------------------------------------

            Company company = job.getCompany();

            if (company != null) {

                response.setCompany(
                        company.getName()
                );

            } else {

                response.setCompany(
                        "Company"
                );
            }

            // -------------------------------------------------
            // SKILLS
            // -------------------------------------------------

            if (job.getSkills() != null) {

                List<String> skillNames =
                        job.getSkills()
                                .stream()
                                .filter(skill -> skill != null)
                                .map(Skill::getName)
                                .filter(name -> name != null)
                                .toList();

                response.setSkills(
                        skillNames
                );

            } else {

                response.setSkills(
                        List.of()
                );
            }

        } else {

            response.setSkills(
                    List.of()
            );
        }

        return response;
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

    public List<Application> getJobApplications(
            Long jobId
    ) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        return applicationRepository.findByJob_Id(
                job.getId()
        );
    }

    // =========================================================
    // GET COMPANY APPLICATIONS
    // =========================================================

    public List<Application> getCompanyApplications(
            Long userId
    ) {

        Company company =
                companyRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company profile not found for this user"
                                )
                        );

        List<Job> companyJobs =
                jobRepository.findByCompanyId(
                        company.getId()
                );

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

        if (status == null
                || status.trim().isEmpty()) {

            throw new RuntimeException(
                    "Application status is required"
            );
        }

        String normalizedStatus =
                status.trim().toUpperCase();

        if (!normalizedStatus.equals("APPLIED")
                && !normalizedStatus.equals("SHORTLISTED")
                && !normalizedStatus.equals("INTERVIEW")
                && !normalizedStatus.equals("OFFERED")
                && !normalizedStatus.equals("REJECTED")) {

            throw new RuntimeException(
                    "Invalid application status. " +
                    "Allowed values: APPLIED, SHORTLISTED, " +
                    "INTERVIEW, OFFERED, REJECTED"
            );
        }

        application.setStatus(
                normalizedStatus
        );

        return applicationRepository.save(
                application
        );
    }
}