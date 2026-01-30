package com.musicstream.backend.controller;

import com.musicstream.backend.dto.CreateTrackDTO;
import com.musicstream.backend.dto.TrackDTO;
import com.musicstream.backend.model.MusicCategory;
import com.musicstream.backend.model.Track;
import com.musicstream.backend.service.TrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TrackController {

    @Autowired
    private TrackService trackService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTrack(@ModelAttribute CreateTrackDTO trackDTO) {
        try {
            trackService.saveTrack(trackDTO);
            return ResponseEntity.ok().body("{\"message\": \"Track saved successfully\"}");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error saving track");
        }
    }

    @GetMapping
    public ResponseEntity<List<TrackDTO>> getAllTracks() {
        return ResponseEntity.ok(trackService.getAllTracks());
    }
    @GetMapping("/{id}")
    public ResponseEntity<TrackDTO> getTrack(@PathVariable Long id) {
        return ResponseEntity.ok(trackService.getTrackDetails(id));
    }
    @GetMapping("/{id}/stream")
    public ResponseEntity<ByteArrayResource> streamAudio(@PathVariable Long id) {
        Track track = trackService.getTrackById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(track.getAudioContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"track-" + id + ".mp3\"")
                .body(new ByteArrayResource(track.getAudioData()));
    }

    @GetMapping("/{id}/cover")
    public ResponseEntity<ByteArrayResource> getCover(@PathVariable Long id) {
        Track track = trackService.getTrackById(id);
        if (track.getCoverData() == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(track.getCoverContentType()))
                .body(new ByteArrayResource(track.getCoverData()));
    }
}