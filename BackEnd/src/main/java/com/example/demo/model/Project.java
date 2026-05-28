package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String client;
    private String location;
    private String status; 
    
    // FIX: Added new fields from React UI
    private String budget;
    private String priority;
    private Integer progress;
    
    // Linking to the specific contractor
    private Long contractorId;
}