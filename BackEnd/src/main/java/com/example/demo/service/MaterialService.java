package com.example.demo.service;

import com.example.demo.model.Material;
import com.example.demo.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MaterialService {
    @Autowired
    private MaterialRepository materialRepository;

    public List<Material> getMaterialsByContractor(Long contractorId) {
        return materialRepository.findByContractorId(contractorId);
    }
    public Material createMaterial(Material material) {
        return materialRepository.save(material);
    }
    public Material updateMaterial(Long id, Material materialDetails) {
        Material material = materialRepository.findById(id).orElseThrow();
        material.setName(materialDetails.getName());
        material.setCategory(materialDetails.getCategory());
        material.setQuantity(materialDetails.getQuantity());
        material.setUnit(materialDetails.getUnit());
        return materialRepository.save(material);
    }
    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }
}