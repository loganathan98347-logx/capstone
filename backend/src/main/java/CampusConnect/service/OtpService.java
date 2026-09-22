package CampusConnect.service;

import CampusConnect.entity.EmailOtp;
import CampusConnect.repository.EmailOtpRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final EmailOtpRepository otpRepository;
    private final EmailService emailService;

    public OtpService(
            EmailOtpRepository otpRepository,
            EmailService emailService) {

        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public String generateOtp(
            String email,
            String name,
            String password,
            String role,
            String companyName,
            String college,
            String graduationYear,
            String cgpa) {

        String otp = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        EmailOtp emailOtp = new EmailOtp(
                email,
                otp,
                LocalDateTime.now().plusMinutes(5),
                name,
                password,
                role,
                companyName,
                college,
                graduationYear,
                cgpa
        );

        otpRepository.save(emailOtp);

        emailService.sendOtpEmail(email, otp);

        return otp;
    }

    public boolean verifyOtp(
            String email,
            String otp) {

        var latestOtp =
                otpRepository
                        .findTopByEmailOrderByIdDesc(email);

        if (latestOtp.isEmpty()) {
            return false;
        }

        EmailOtp emailOtp = latestOtp.get();

        if (emailOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            return false;
        }

        return emailOtp
                .getOtp()
                .equals(otp);
    }

    public EmailOtp getLatestOtp(String email) {

        return otpRepository
                .findTopByEmailOrderByIdDesc(email)
                .orElse(null);
    }
}