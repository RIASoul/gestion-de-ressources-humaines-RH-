package com.example.authservice.service;

import com.example.authservice.dto.AuthResponse;
import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.RegisterRequest;
import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(req.getRole());

        User saved = userRepository.save(u);
        // V1: pas de JWT -> token "no-token"
        return new AuthResponse("no-token", saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User u = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!encoder.matches(req.getPassword(), u.getPassword()))
            throw new RuntimeException("Mot de passe incorrect");

        return new AuthResponse("no-token", u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}