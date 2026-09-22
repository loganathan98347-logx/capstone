package CampusConnect.controller;

import CampusConnect.entity.Company;
import CampusConnect.entity.EmailOtp;
import CampusConnect.entity.Student;
import CampusConnect.entity.User;

import CampusConnect.repository.CompanyRepository;
import CampusConnect.repository.StudentRepository;

import CampusConnect.service.AuthService;
import CampusConnect.service.OtpService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;

    public AuthController(
            AuthService authService,
            OtpService otpService,
            CompanyRepository companyRepository,
            StudentRepository studentRepository) {

        this.authService = authService;
        this.otpService = otpService;
        this.companyRepository = companyRepository;
        this.studentRepository = studentRepository;
    }

    // ==============================
    // REGISTER
    // ==============================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        try {

            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");
            String role = request.get("role");

            String companyName = request.get("companyName");
            String college = request.get("college");
            String graduationYear = request.get("graduationYear");
            String cgpa = request.get("cgpa");

            // NAME

            if (name == null || name.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Name is required"
                        ));
            }

            // EMAIL

            if (email == null || email.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Email is required"
                        ));
            }

            // PASSWORD

            if (password == null || password.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Password is required"
                        ));
            }

            if (password.length() < 6) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Password must contain at least 6 characters"
                        ));
            }

            // ROLE

            if (role == null || role.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Role is required"
                        ));
            }

            // COMPANY VALIDATION

            if (role.equalsIgnoreCase("COMPANY")) {

                if (companyName == null ||
                        companyName.trim().isEmpty()) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "Company name is required"
                            ));
                }
            }

            // STUDENT VALIDATION

            if (role.equalsIgnoreCase("STUDENT")) {

                if (college == null ||
                        college.trim().isEmpty()) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "College name is required"
                            ));
                }

                if (graduationYear == null ||
                        graduationYear.trim().isEmpty()) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "Graduation year is required"
                            ));
                }

                if (cgpa == null ||
                        cgpa.trim().isEmpty()) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "CGPA is required"
                            ));
                }

                // Graduation year validation

                try {

                    int year =
                            Integer.parseInt(
                                    graduationYear.trim()
                            );

                    if (year < 2020 || year > 2100) {

                        return ResponseEntity.badRequest()
                                .body(Map.of(
                                        "error",
                                        "Invalid graduation year"
                                ));
                    }

                } catch (NumberFormatException e) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "Graduation year must be a valid number"
                            ));
                }

                // CGPA validation

                try {

                    double cgpaValue =
                            Double.parseDouble(
                                    cgpa.trim()
                            );

                    if (cgpaValue < 0 ||
                            cgpaValue > 10) {

                        return ResponseEntity.badRequest()
                                .body(Map.of(
                                        "error",
                                        "CGPA must be between 0 and 10"
                                ));
                    }

                } catch (NumberFormatException e) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "CGPA must be a valid number"
                            ));
                }
            }

            // CHECK EMAIL

            if (authService.emailExists(email.trim())) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Email is already registered"
                        ));
            }

            // SEND EMAIL OTP

            otpService.generateOtp(
                    email.trim(),
                    name.trim(),
                    password,
                    role.trim(),
                    companyName,
                    college,
                    graduationYear,
                    cgpa
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP sent successfully to your email",

                            "email",
                            email.trim()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // ==============================
    // VERIFY EMAIL OTP
    // ==============================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");
            String otp = request.get("otp");

            // EMAIL

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Email is required"
                        ));
            }

            // OTP

            if (otp == null ||
                    otp.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "OTP is required"
                        ));
            }

            if (!otp.matches("^[0-9]{6}$")) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "OTP must contain exactly 6 digits"
                        ));
            }

            // VERIFY OTP

            boolean verified =
                    otpService.verifyOtp(
                            email.trim(),
                            otp.trim()
                    );

            if (!verified) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Invalid or expired OTP"
                        ));
            }

            // GET REGISTRATION DATA

            EmailOtp emailOtp =
                    otpService.getLatestOtp(
                            email.trim()
                    );

            if (emailOtp == null) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Registration information not found"
                        ));
            }

            // CREATE USER

            User user =
                    authService.register(
                            emailOtp.getName(),
                            emailOtp.getEmail(),
                            emailOtp.getPassword(),
                            emailOtp.getRole()
                    );

            user.setVerified(true);

            authService.saveUser(user);

            // ==============================
            // CREATE STUDENT
            // ==============================

            if (emailOtp.getRole() != null &&
                    emailOtp.getRole()
                            .equalsIgnoreCase("STUDENT")) {

                Student student =
                        new Student();

                student.setName(
                        user.getName()
                );

                student.setEmail(
                        user.getEmail()
                );

                student.setCollege(
                        emailOtp.getCollege()
                );

                if (emailOtp.getGraduationYear() != null &&
                        !emailOtp.getGraduationYear()
                                .trim()
                                .isEmpty()) {

                    student.setGraduationYear(
                            Integer.parseInt(
                                    emailOtp
                                            .getGraduationYear()
                                            .trim()
                            )
                    );
                }

                if (emailOtp.getCgpa() != null &&
                        !emailOtp.getCgpa()
                                .trim()
                                .isEmpty()) {

                    student.setCgpa(
                            Double.parseDouble(
                                    emailOtp
                                            .getCgpa()
                                            .trim()
                            )
                    );
                }

                student.setUser(user);

                studentRepository.save(student);
            }

            // ==============================
            // CREATE COMPANY
            // ==============================

            if (emailOtp.getRole() != null &&
                    emailOtp.getRole()
                            .equalsIgnoreCase("COMPANY")) {

                String companyName =
                        emailOtp.getCompanyName();

                if (companyName == null ||
                        companyName.trim().isEmpty()) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "error",
                                    "Company name is missing"
                            ));
                }

                Company company =
                        new Company();

                company.setName(
                        companyName.trim()
                );

                company.setEmail(
                        emailOtp.getEmail()
                );

                company.setUserId(
                        user.getId()
                );

                companyRepository.save(company);
            }

            // SUCCESS

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Email verified and registration successful",

                            "id",
                            user.getId(),

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail(),

                            "role",
                            user.getRole(),

                            "verified",
                            user.isVerified()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // ==============================
    // LOGIN
    // ==============================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        try {

            String email =
                    request.get("email");

            String password =
                    request.get("password");

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Email is required"
                        ));
            }

            if (password == null ||
                    password.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Password is required"
                        ));
            }

            User user =
                    authService.login(
                            email.trim(),
                            password
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "id",
                            user.getId(),

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail(),

                            "role",
                            user.getRole(),

                            "verified",
                            user.isVerified()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}