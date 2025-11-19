package com.autokereskedes.backend.security;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("JWT Filter: " + method + " " + path);

        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        if (path.startsWith("/uploads/")
                || path.startsWith("/images/")
                || path.equals("/favicon.ico")) {

            System.out.println("PUBLIC FILE → JWT SKIP");
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Jws<Claims> jws = jwtService.parse(token);
            String email = jws.getBody().getSubject();

            var userOpt = userRepository.findByEmail(email.toLowerCase().trim());
            if (userOpt.isEmpty()) {
                SecurityContextHolder.clearContext();
                chain.doFilter(request, response);
                return;
            }

            User user = userOpt.get();

            var authorities = Collections.singleton(
                    new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
            );

            var authToken = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    authorities
            );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);

            System.out.println("JWT AUTH OK: " + user.getEmail());

        } catch (Exception ex) {
            System.out.println("JWT ERROR: " + ex.getMessage());
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
    }
}
