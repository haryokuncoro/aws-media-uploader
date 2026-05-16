package com.haryokuncoro.springboot_template.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteUploadRequest {

    private String fileKey;
    private String mediaType;
}