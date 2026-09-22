package CampusConnect.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // =========================================================
    // REGISTRATION OTP EMAIL
    // =========================================================

    public void sendOtpEmail(String recipientEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(recipientEmail);

        message.setSubject(
                "CampusConnect - Email Verification OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "Your CampusConnect verification OTP is:\n\n"
                + otp + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "Please do not share this OTP with anyone.\n\n"
                + "Thank you,\n"
                + "CampusConnect Team"
        );

        mailSender.send(message);
    }


    // =========================================================
    // LOGIN SUCCESS EMAIL
    // =========================================================

    public void sendLoginSuccessEmail(
            String recipientEmail,
            String userName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(recipientEmail);

        message.setSubject(
                "CampusConnect - Login Successful"
        );

        message.setText(
                "Hello " + userName + ",\n\n"
                + "YOU ARE SUCCESSFULLY LOGGED IN TO THE CAMPUSCONNECT.\n\n"
                + "Your login to CampusConnect was successful.\n\n"
                + "If you did not perform this login, please secure your account immediately.\n\n"
                + "Thank you,\n"
                + "CampusConnect Team"
        );

        mailSender.send(message);
    }
}