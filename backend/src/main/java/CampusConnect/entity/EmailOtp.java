package CampusConnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_otp")
public class EmailOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private String name;

    private String password;

    private String role;

    private String companyName;

    private String college;

    private String graduationYear;

    private String cgpa;

    public EmailOtp() {
    }

    public EmailOtp(
            String email,
            String otp,
            LocalDateTime expiresAt,
            String name,
            String password,
            String role,
            String companyName,
            String college,
            String graduationYear,
            String cgpa) {

        this.email = email;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.name = name;
        this.password = password;
        this.role = role;
        this.companyName = companyName;
        this.college = college;
        this.graduationYear = graduationYear;
        this.cgpa = cgpa;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getOtp() {
        return otp;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getCollege() {
        return college;
    }

    public String getGraduationYear() {
        return graduationYear;
    }

    public String getCgpa() {
        return cgpa;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public void setGraduationYear(String graduationYear) {
        this.graduationYear = graduationYear;
    }

    public void setCgpa(String cgpa) {
        this.cgpa = cgpa;
    }
}