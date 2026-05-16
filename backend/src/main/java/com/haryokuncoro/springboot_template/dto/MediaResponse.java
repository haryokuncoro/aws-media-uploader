package com.haryokuncoro.springboot_template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class MediaResponse {

    private UUID id;

    private String mediaType;

    private String status;

    private String fileUrl;
}