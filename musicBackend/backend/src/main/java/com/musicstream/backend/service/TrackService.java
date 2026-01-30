package com.musicstream.backend.service;

import com.musicstream.backend.dto.CreateTrackDTO;
import com.musicstream.backend.dto.TrackDTO;
import com.musicstream.backend.model.Track;
import com.musicstream.backend.repository.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrackService {

    @Autowired
    private TrackRepository trackRepository;


    public Track saveTrack(CreateTrackDTO dto) throws IOException {

        Track track = Track.builder()
                .title(dto.getTitle())
                .artist(dto.getArtist())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .duration(dto.getDuration())
                .addedDate(LocalDateTime.now())
                .audioData(dto.getFile().getBytes())
                .audioContentType(dto.getFile().getContentType())
                .build();

        if (dto.getCover() != null && !dto.getCover().isEmpty()) {
            track.setCoverData(dto.getCover().getBytes());
            track.setCoverContentType(dto.getCover().getContentType());
        }

        return trackRepository.save(track);
    }

    @Transactional(readOnly = true)
    public List<TrackDTO> getAllTracks() {
        return trackRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Track getTrackById(Long id) {
        return trackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Track not found with id: " + id));
    }

    public TrackDTO getTrackDetails(Long id) {
        Track track = getTrackById(id);
        return mapToDTO(track);
    }
    private TrackDTO mapToDTO(Track track) {
        TrackDTO dto = new TrackDTO();
        dto.setId(track.getId());
        dto.setTitle(track.getTitle());
        dto.setArtist(track.getArtist());
        dto.setDescription(track.getDescription());
        dto.setCategory(track.getCategory());
        dto.setDuration(track.getDuration());
        dto.setAddedDate(track.getAddedDate());

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        dto.setStreamUrl(baseUrl + "/api/tracks/" + track.getId() + "/stream");

        if (track.getCoverData() != null) {
            dto.setCoverUrl(baseUrl + "/api/tracks/" + track.getId() + "/cover");
        }

        return dto;
    }
}