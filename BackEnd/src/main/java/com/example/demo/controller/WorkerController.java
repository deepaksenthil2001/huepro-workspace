package com.example.demo.controller;

import com.example.demo.model.Worker;
import com.example.demo.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    @Autowired
    private WorkerService workerService;

    // Fetch workers only for the logged-in contractor
    @GetMapping("/contractor/{contractorId}")
    public List<Worker> getWorkersByContractor(@PathVariable Long contractorId) {
        return workerService.getWorkersByContractor(contractorId);
    }

    @PostMapping
    public Worker addWorker(@RequestBody Worker worker) {
        return workerService.createWorker(worker);
    }

    // FIX: Added PutMapping to handle Update/Edit operations
    @PutMapping("/{id}")
    public Worker updateWorker(@PathVariable Long id, @RequestBody Worker workerDetails) {
        return workerService.updateWorker(id, workerDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
    }
}