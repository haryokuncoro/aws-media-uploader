package com.haryokuncoro.springboot_template.service;

import com.haryokuncoro.springboot_template.entity.User;
import com.haryokuncoro.springboot_template.exception.BadRequestException;
import com.haryokuncoro.springboot_template.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service @Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public void register(String email, String password) {
        userRepo.findByEmail(email).ifPresent(u -> {
            throw new BadRequestException("Invalid request");
        });

        if (!password.matches("^(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            throw new BadRequestException("Weak password");
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setEnabled(true);
        userRepo.save(user);
    }

    public String login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return jwtService.generate(user.getId());
    }

}