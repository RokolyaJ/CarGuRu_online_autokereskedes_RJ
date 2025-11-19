package com.autokereskedes.backend.security;

import com.autokereskedes.backend.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private final Key key;
    private final long expirationMillis;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-millis}") long expirationMillis) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret túl rövid! Minimum 32 karakter szükséges.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());   
        claims.put("email", user.getEmail());

        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setSubject(user.getEmail())                   
                .addClaims(claims)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationMillis))  
                .signWith(key, SignatureAlgorithm.HS256)         
                .compact();
    }

    public Jws<Claims> parse(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
        } catch (ExpiredJwtException e) {
            System.out.println("Token lejárt: " + e.getMessage());
            throw e;
        } catch (JwtException e) {
            System.out.println("Érvénytelen JWT token: " + e.getMessage());
            throw e;
        }
    }

    public String extractEmail(String token) {
        try {
            return parse(token).getBody().getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parse(token).getBody();
            return claims.getExpiration().after(new Date());
        } catch (JwtException e) {
            return false;
        }
    }
}
