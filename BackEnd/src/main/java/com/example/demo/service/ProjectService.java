package com.example.demo.service;

import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getProjectsByContractor(Long contractorId) {
        return projectRepository.findByContractorId(contractorId);
    }
    
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id).orElseThrow();
        
        project.setName(projectDetails.getName());
        project.setClient(projectDetails.getClient());
        project.setLocation(projectDetails.getLocation());
        project.setStatus(projectDetails.getStatus());
        
        // FIX: Added new fields to update logic
        project.setBudget(projectDetails.getBudget());
        project.setPriority(projectDetails.getPriority());
        project.setProgress(projectDetails.getProgress());
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}