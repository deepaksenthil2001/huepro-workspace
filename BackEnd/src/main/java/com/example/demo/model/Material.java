package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "materials")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // e.g., Asian Paints Royal
    private String category; // Paint, Tool, Consumable
    private Double quantity;
    private String unit; // Liters, Kgs, Pieces
    
    // Linking to the specific contractor
    private Long contractorId;
}