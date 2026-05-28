package com.example.demo.repository;

import com.example.demo.model.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {
    // Email-ஐ வைத்து யூசரைத் தேட உதவும் கஸ்டம் லாஜிக்
    Optional<Contractor> findByEmail(String email);
}