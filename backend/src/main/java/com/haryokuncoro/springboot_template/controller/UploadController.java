package com.haryokuncoro.springboot_template.controller;

import com.haryokuncoro.springboot_template.dto.CompleteUploadRequest;
import com.haryokuncoro.springboot_template.dto.MediaResponse;
import com.haryokuncoro.springboot_template.dto.PresignRequest;
import com.haryokuncoro.springboot_template.dto.PresignResponse;
import com.haryokuncoro.springboot_template.entity.User;
import com.haryokuncoro.springboot_template.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UploadController {

    private final UploadService uploadService;


    @PostMapping("/presign")
    public PresignResponse presign(@RequestBody PresignRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return uploadService.generatePresignedUrl(
                user.getId(),
                request
        );
    }

    @PostMapping("/complete")
    public ResponseEntity<Void> completeUpload(@RequestBody CompleteUploadRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        uploadService.completeUpload(
                user.getId(),
                request
        );

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public List<MediaResponse> getMyMedia(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return uploadService.getUserMedia(user.getId());
    }
}