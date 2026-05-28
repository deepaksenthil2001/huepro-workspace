package com.example.demo.controller;

import com.example.demo.model.Contractor;
import com.example.demo.repository.ContractorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
// CORS எரரைத் தடுக்க இது மிகவும் அவசியம்
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private ContractorRepository contractorRepository;

    // 1. REGISTER API
    @PostMapping("/register")
    public ResponseEntity<?> registerContractor(@RequestBody Contractor contractor) {
        String safeEmail = contractor.getEmail().trim().toLowerCase();
        contractor.setEmail(safeEmail);
        contractor.setPassword(contractor.getPassword().trim());

        if(contractorRepository.findByEmail(safeEmail).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }
        
        Contractor savedContractor = contractorRepository.save(contractor);
        return ResponseEntity.ok(savedContractor);
    }

    // 2. LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> loginContractor(@RequestBody Contractor loginData) {
        String inputEmail = loginData.getEmail().trim().toLowerCase();
        String inputPassword = loginData.getPassword().trim();

        System.out.println("Login Attempt -> Email: " + inputEmail);
        
        Optional<Contractor> existingUser = contractorRepository.findByEmail(inputEmail);
        
        if(existingUser.isPresent()) {
            if(existingUser.get().getPassword().equals(inputPassword)) {
                return ResponseEntity.ok(existingUser.get());
            }
        }
        
        return ResponseEntity.status(401).body("Error: Invalid email or password!");
    }

    // 3. UPDATE USER PROFILE API
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateContractor(@PathVariable Long id, @RequestBody Contractor updatedData) {
        Optional<Contractor> existingUserOpt = contractorRepository.findById(id);
        
        if(existingUserOpt.isPresent()) {
            Contractor user = existingUserOpt.get();
            
            // அப்டேட் செய்யப்படும் புதிய டேட்டா
            user.setFullName(updatedData.getFullName());
            user.setCompanyName(updatedData.getCompanyName());
            
            // பாஸ்வேர்ட் மாற்றப்பட்டிருந்தால் மட்டும் அப்டேட் செய்யவும்
            if(updatedData.getPassword() != null && !updatedData.getPassword().trim().isEmpty()) {
                user.setPassword(updatedData.getPassword().trim());
            }
            
            Contractor savedUser = contractorRepository.save(user);
            return ResponseEntity.ok(savedUser);
        }
        
        return ResponseEntity.status(404).body("Error: User not found!");
    }
}