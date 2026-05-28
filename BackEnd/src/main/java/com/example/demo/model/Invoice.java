package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "invoices")
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String invoiceNumber;
    private String client;
    private String project;
    private String amount;
    private String date;
    private String status;

    // Added missing fields from React Frontend
    private String dueDate;
    private Double taxRate;
    
    // Core relation for user-specific data filtering
    private Long contractorId;
}