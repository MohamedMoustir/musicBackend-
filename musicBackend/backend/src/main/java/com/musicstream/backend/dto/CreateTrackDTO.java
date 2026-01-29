package com.musicstream.backend.dto;

import com.musicstream.backend.model.MusicCategory;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateTrackDTO {
    private String title;
    private String artist;
    private String description;
    private MusicCategory category;
    private Double duration;

    private MultipartFile file;
    private MultipartFile cover;
}