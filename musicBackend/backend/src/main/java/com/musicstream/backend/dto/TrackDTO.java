package com.musicstream.backend.dto;

import com.musicstream.backend.model.MusicCategory;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TrackDTO {
    private Long id;
    private String title;
    private String artist;
    private String description;
    private MusicCategory category;
    private Double duration;
    private LocalDateTime addedDate;

    private String streamUrl;
    private String coverUrl;
}