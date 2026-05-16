package com.haryokuncoro.springboot_template.repository;


import com.haryokuncoro.springboot_template.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaRepository
        extends JpaRepository<Media, UUID> {

    List<Media> findByUserId(UUID userId);
}