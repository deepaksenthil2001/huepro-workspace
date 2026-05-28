package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // அனைத்து API-களுக்கும் அனுமதி (Auth, Projects, Materials)
                        .allowedOrigins("http://localhost:5173") // React ஓடும் போர்ட்
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // அனைத்து Methods-கும் அனுமதி
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}