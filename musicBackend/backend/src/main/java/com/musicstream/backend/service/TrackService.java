package com.musicstream.backend.service;

import com.musicstream.backend.dto.CreateTrackDTO;
import com.musicstream.backend.dto.TrackDTO;
import com.musicstream.backend.model.Track;
import com.musicstream.backend.repository.TrackRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TrackService {


    private  final TrackRepository trackRepository;


    private final CloudinaryService cloudinaryService;

    public Track saveTrack(CreateTrackDTO dto) throws IOException {
        Track track = Track.builder()
                .title(dto.getTitle())
                .artist(dto.getArtist())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .duration(dto.getDuration())
                .addedDate(LocalDateTime.now())
                .build();

        if (dto.getFile() != null && !dto.getFile().isEmpty()) {
            String audioUrl = cloudinaryService.uploadFile(dto.getFile(), "music_stream/tracks");
            track.setAudioUrl(audioUrl);
        }

        if (dto.getCover() != null && !dto.getCover().isEmpty()) {
            String coverUrl = cloudinaryService.uploadFile(dto.getCover(), "music_stream/covers");
            track.setCoverUrl(coverUrl);
        } else {
            track.setCoverUrl("https://res.cloudinary.com/demo/image/upload/v1/default_album_cover.png");
        }

        return trackRepository.save(track);
    }

    public Track updateTrack(Long id, CreateTrackDTO dto) throws IOException {
        Track track = getTrackById(id);

        track.setTitle(dto.getTitle());
        track.setArtist(dto.getArtist());
        track.setDescription(dto.getDescription());
        track.setCategory(dto.getCategory());

        if (dto.getDuration() != null) {
            track.setDuration(dto.getDuration());
        }

        // Update Audio only if a new file is sent
        if (dto.getFile() != null && !dto.getFile().isEmpty()) {
            String audioUrl = cloudinaryService.uploadFile(dto.getFile(), "music_stream/tracks");
            track.setAudioUrl(audioUrl);
        }

        // Update Cover only if a new file is sent
        if (dto.getCover() != null && !dto.getCover().isEmpty()) {
            String coverUrl = cloudinaryService.uploadFile(dto.getCover(), "music_stream/covers");
            track.setCoverUrl(coverUrl);
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

    public void deleteTrack(Long id){
        trackRepository.deleteById(id);
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

        dto.setStreamUrl(track.getAudioUrl());
        dto.setCoverUrl(track.getCoverUrl());

        return dto;
    }
}