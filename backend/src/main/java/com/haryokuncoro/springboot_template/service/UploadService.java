package com.haryokuncoro.springboot_template.service;

import com.haryokuncoro.springboot_template.dto.CompleteUploadRequest;
import com.haryokuncoro.springboot_template.dto.PresignRequest;
import com.haryokuncoro.springboot_template.dto.PresignResponse;
import com.haryokuncoro.springboot_template.entity.Media;
import com.haryokuncoro.springboot_template.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final S3Presigner s3Presigner;
    private final MediaRepository mediaRepository;

    @Value("${aws.bucketName}")
    private String bucketName;

    public PresignResponse generatePresignedUrl(
            UUID userId,
            PresignRequest request
    ) {

        String extension =
                request.getFileName()
                        .substring(
                                request.getFileName().lastIndexOf(".")
                        );

        String fileKey =
                "users/" +
                        userId +
                        "/" +
                        UUID.randomUUID() +
                        extension;

        PutObjectRequest objectRequest =
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileKey)
                        .contentType(request.getContentType())
                        .build();

        PutObjectPresignRequest presignRequest =
                PutObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(10))
                        .putObjectRequest(objectRequest)
                        .build();

        PresignedPutObjectRequest presignedRequest =
                s3Presigner.presignPutObject(presignRequest);

        return PresignResponse.builder()
                .uploadUrl(
                        presignedRequest.url().toString()
                )
                .fileKey(fileKey)
                .build();
    }

    public void completeUpload(
            UUID userId,
            CompleteUploadRequest request
    ) {

        Media media = Media.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .fileKey(request.getFileKey())
                .mediaType(request.getMediaType())
                .status("READY")
                .createdAt(LocalDateTime.now())
                .build();

        mediaRepository.save(media);
    }

    public List<Media> getUserMedia(UUID userId) {
        return mediaRepository.findByUserId(userId);
    }
}