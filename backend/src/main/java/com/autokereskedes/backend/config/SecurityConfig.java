package com.autokereskedes.backend.config;

import com.autokereskedes.backend.repository.UserRepository;
import com.autokereskedes.backend.security.JwtAuthFilter;
import com.autokereskedes.backend.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig implements WebMvcConfigurer {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public SecurityConfig(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtService, userRepository);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
           .cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowCredentials(true);
cfg.setAllowedOriginPatterns(List.of(
        "http://localhost:3000",
        "https://carguru.up.railway.app",
        "https://*.railway.app"
));

cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
cfg.setAllowedHeaders(List.of("*", "Authorization"));
cfg.setExposedHeaders(List.of("Authorization"));
    cfg.setMaxAge(3600L);
    return cfg;
}))

            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                        "/api/auth/**",
                        "/api/public/**",
                        "/api/test-email",
                        "/api/offer/**",
                        "/api/brands/**",
                        "/api/models/**",
                        "/api/variants/**",
                        "/api/stock/**",
                        "/api/test-drive/**",
                        "/api/stock-vehicle/**",
                        "/api/engines/**",
                        "/api/catalog/**",
                        "/api/images/**",
                        "/uploads/**",
                        "/images/**",
                        "/static/**",
                        "/resources/**",
                        "/webjars/**",
                        "/favicon.ico"
                ).permitAll()

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                .requestMatchers(HttpMethod.GET,
                        "/api/usedcars/featured",
                        "/api/usedcars/*"        
                ).permitAll()

                .requestMatchers(HttpMethod.POST,
                        "/api/usedcars/search"
                ).permitAll()

                .requestMatchers(HttpMethod.POST,
                        "/api/images/temp",
                        "/api/images/temp/**",
                        "/api/images/assign/**"
                ).permitAll()

                .requestMatchers(HttpMethod.POST, "/api/usedcars").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/usedcars/finalize").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/usedcars/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usedcars/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/usedcars/mine").hasAnyRole("USER", "ADMIN")

                .requestMatchers("/api/favorites/**").authenticated()

                .requestMatchers(
                        "/api/users/**",
                        "/api/tradein/**",
                        "/api/documents/**",
                        "/api/orders/**",
                        "/api/paymentinfo/**",
                        "/api/leasing/**",
                        "/api/insurance/**",
                        "/api/delivery/**"
                ).authenticated()

                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/usedcars/admin/**").hasRole("ADMIN")

                .requestMatchers("/api/messages/**").authenticated()

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)

            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    System.out.println("Auth hiba: " + e.getMessage());
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                })
                .accessDeniedHandler((req, res, e) -> {
                    System.out.println("Access denied: " + e.getMessage());
                    res.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                })
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
