package com.haryokuncoro.springboot_template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PresignResponse {

    private String uploadUrl;
    private String fileKey;
}