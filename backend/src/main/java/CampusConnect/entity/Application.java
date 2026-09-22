
package CampusConnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // STUDENT
    // =========================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;


    // =========================================================
    // JOB
    // =========================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;


    // =========================================================
    // APPLICATION STATUS
    // =========================================================

    private String status;


    // =========================================================
    // APPLICATION DATE
    // =========================================================

    private LocalDateTime appliedAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Application() {
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }


    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET STUDENT
    // =========================================================

    public Student getStudent() {
        return student;
    }


    // =========================================================
    // SET STUDENT
    // =========================================================

    public void setStudent(Student student) {
        this.student = student;
    }


    // =========================================================
    // GET JOB
    // =========================================================

    public Job getJob() {
        return job;
    }


    // =========================================================
    // SET JOB
    // =========================================================

    public void setJob(Job job) {
        this.job = job;
    }


    // =========================================================
    // GET STATUS
    // =========================================================

    public String getStatus() {
        return status;
    }


    // =========================================================
    // SET STATUS
    // =========================================================

    public void setStatus(String status) {
        this.status = status;
    }


    // =========================================================
    // GET APPLIED AT
    // =========================================================

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }


    // =========================================================
    // SET APPLIED AT
    // =========================================================

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}
