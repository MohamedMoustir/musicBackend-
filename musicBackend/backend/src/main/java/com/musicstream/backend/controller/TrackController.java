package com.musicstream.backend.controller;

import com.musicstream.backend.dto.CreateTrackDTO;
import com.musicstream.backend.dto.TrackDTO;
import com.musicstream.backend.model.Track;
import com.musicstream.backend.service.TrackService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@AllArgsConstructor
public class TrackController {

    private final TrackService trackService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTrack(@ModelAttribute CreateTrackDTO trackDTO) {
        try {
            trackService.saveTrack(trackDTO);
            return ResponseEntity.ok().body("{\"message\": \"Track saved successfully\"}");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving track: " + e.getMessage());
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Track> updateTrack(
            @PathVariable Long id,
            @ModelAttribute CreateTrackDTO createTrackDTO) throws IOException {

        Track updatedTrack = trackService.updateTrack(id, createTrackDTO);
        return ResponseEntity.ok(updatedTrack);
    }

    @DeleteMapping("/{id}")
    public void deleteTrack(@PathVariable Long id){
        trackService.deleteTrack(id);
    }
}