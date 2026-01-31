package com.musicstream.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "tracks")
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String artist;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private MusicCategory category;

    private Double duration;

    private LocalDateTime addedDate;


    private String audioUrl;
    private String audioPublicId;

    private String coverUrl;
    private String coverPublicId;
}