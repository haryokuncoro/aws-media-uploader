package com.haryokuncoro.springboot_template.util;

import com.haryokuncoro.springboot_template.dto.ApiResponse;

import java.time.LocalDateTime;

public class ResponseUtil {

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ApiResponse<Void> success(String message) {
        return success(message, null);
    }

    public static ApiResponse<Void> error(String message) {
        return ApiResponse.<Void>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}