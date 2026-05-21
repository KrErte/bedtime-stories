package me.storyfor.backend.controller;

import jakarta.validation.Valid;
import me.storyfor.backend.dto.ChildDto;
import me.storyfor.backend.dto.ChildRequest;
import me.storyfor.backend.security.SecurityUtils;
import me.storyfor.backend.service.ChildService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    public ChildController(ChildService childService) {
        this.childService = childService;
    }

    @GetMapping
    public ResponseEntity<List<ChildDto>> getChildren() {
        return ResponseEntity.ok(childService.getChildren(SecurityUtils.getCurrentUser().getId()));
    }

    @PostMapping
    public ResponseEntity<ChildDto> createChild(@Valid @RequestBody ChildRequest request) {
        return ResponseEntity.ok(childService.createChild(SecurityUtils.getCurrentUser().getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChildDto> updateChild(@PathVariable UUID id, @Valid @RequestBody ChildRequest request) {
        return ResponseEntity.ok(childService.updateChild(SecurityUtils.getCurrentUser().getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable UUID id) {
        childService.deleteChild(SecurityUtils.getCurrentUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}
