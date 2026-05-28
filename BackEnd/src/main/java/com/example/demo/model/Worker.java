package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "workers")
public class Worker {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String role; 
    private String phone;
    private Double dailyWage;
    
    private String status = "Active"; 
    private LocalDate joinedDate;

    // FIX: Added the missing contractorId field to link with User
    private Long contractorId;

    @PrePersist
    protected void onCreate() {
        this.joinedDate = LocalDate.now();
    }

    // Constructors
    public Worker() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getDailyWage() { return dailyWage; }
    public void setDailyWage(Double dailyWage) { this.dailyWage = dailyWage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getJoinedDate() { return joinedDate; }
    public void setJoinedDate(LocalDate joinedDate) { this.joinedDate = joinedDate; }

    // Getter and Setter for contractorId
    public Long getContractorId() { return contractorId; }
    public void setContractorId(Long contractorId) { this.contractorId = contractorId; }
}