package com.example.demo.controller;

import com.example.demo.model.Material;
import com.example.demo.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class MaterialController {
    @Autowired
    private MaterialService materialService;

    @GetMapping("/contractor/{contractorId}")
    public List<Material> getMaterialsByContractor(@PathVariable Long contractorId) {
        return materialService.getMaterialsByContractor(contractorId);
    }
    @PostMapping
    public Material createMaterial(@RequestBody Material material) {
        return materialService.createMaterial(material);
    }
    @PutMapping("/{id}")
    public Material updateMaterial(@PathVariable Long id, @RequestBody Material material) {
        return materialService.updateMaterial(id, material);
    }
    @DeleteMapping("/{id}")
    public void deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
    }
}