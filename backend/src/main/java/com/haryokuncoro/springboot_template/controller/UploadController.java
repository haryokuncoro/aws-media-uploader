package com.haryokuncoro.springboot_template.controller;

import com.haryokuncoro.springboot_template.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UploadController {

    private final UploadService uploadService;

    @GetMapping("/presigned-url")
    public Map<String, String> getUrl(@RequestParam String fileName) {
        String url = uploadService.generatePresignedUrl(fileName);
        return Map.of(
                "uploadUrl", url,
                "fileKey", fileName
        );
    }
}