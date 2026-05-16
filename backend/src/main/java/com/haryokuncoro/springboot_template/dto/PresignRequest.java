package com.haryokuncoro.springboot_template.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignRequest {

    private String fileName;
    private String contentType;
}