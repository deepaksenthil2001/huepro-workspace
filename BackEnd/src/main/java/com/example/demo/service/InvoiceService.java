package com.example.demo.service;

import com.example.demo.model.Invoice;
import com.example.demo.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public List<Invoice> getInvoicesByContractor(Long contractorId) {
        return invoiceRepository.findByContractorId(contractorId);
    }

    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(Long id, Invoice invoiceDetails) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        
        invoice.setInvoiceNumber(invoiceDetails.getInvoiceNumber());
        invoice.setClient(invoiceDetails.getClient());
        invoice.setProject(invoiceDetails.getProject());
        invoice.setAmount(invoiceDetails.getAmount());
        invoice.setDate(invoiceDetails.getDate());
        invoice.setStatus(invoiceDetails.getStatus());
        
        // Include new fields in the update logic
        invoice.setDueDate(invoiceDetails.getDueDate());
        invoice.setTaxRate(invoiceDetails.getTaxRate());
        
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}