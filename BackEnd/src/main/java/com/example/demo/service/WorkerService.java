package com.example.demo.service;

import com.example.demo.model.Worker;
import com.example.demo.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    public List<Worker> getWorkersByContractor(Long contractorId) {
        return workerRepository.findByContractorId(contractorId);
    }

    public Worker createWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    // FIX: Proper update logic mapped to frontend data
    public Worker updateWorker(Long id, Worker workerDetails) {
        Worker worker = workerRepository.findById(id).orElseThrow();

        // Update the basic details
        worker.setName(workerDetails.getName());
        worker.setRole(workerDetails.getRole());
        worker.setPhone(workerDetails.getPhone());
        worker.setDailyWage(workerDetails.getDailyWage());
        worker.setStatus(workerDetails.getStatus());
        
        // Note: contractorId is intentionally excluded here so it doesn't change on edit

        return workerRepository.save(worker);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }
}