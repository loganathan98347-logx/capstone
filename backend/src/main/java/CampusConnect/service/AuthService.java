package CampusConnect.service;

import CampusConnect.entity.User;
import CampusConnect.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================================
    // CHECK WHETHER EMAIL ALREADY EXISTS
    // ==========================================

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // ==========================================
    // REGISTER USER
    // ==========================================

    public User register(
            String name,
            String email,
            String password,
            String role) {

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);

        user.setVerified(false);

        return userRepository.save(user);
    }

    // ==========================================
    // SAVE USER
    // ==========================================

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    public User login(
            String email,
            String password) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (!user.getPassword().equals(password)) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }
}