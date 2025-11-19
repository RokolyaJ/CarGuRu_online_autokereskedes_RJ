package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User register(User user) {
        String email = user.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Ez az email cím már foglalt!");
        }

        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email.toLowerCase().trim());
        User user = userOpt.orElseThrow(() -> new RuntimeException("Hibás email vagy jelszó!"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Hibás email vagy jelszó!");
        }

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void resetPassword(Long userId, String newRawPassword) {
        User user = findById(userId);
        user.setPasswordHash(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);
    }

    public void changeRole(Long userId, User.Role role) {
        User user = findById(userId);
        user.setRole(role);
        userRepository.save(user);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void transferFunds(String senderEmail, String recipientEmail, Long amount) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Küldő nem található"));
        User recipient = userRepository.findByEmail(recipientEmail)
                .orElseThrow(() -> new RuntimeException("Címzett nem található"));

        if (amount == null || amount <= 0) {
            throw new RuntimeException("Az utalási összegnek nagyobbnak kell lennie nullánál!");
        }

        if (sender.getBalance() < amount) {
            throw new RuntimeException("Nincs elegendő fedezet az utaláshoz!");
        }

        sender.setBalance(sender.getBalance() - amount);
        recipient.setBalance(recipient.getBalance() + amount);

        userRepository.save(sender);
        userRepository.save(recipient);
    }

    public void withdrawFunds(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));
        user.setBalance(0L);
        userRepository.save(user);
    }
}
