package com.musicstream.backend;

import com.musicstream.backend.dto.CreateTrackDTO;
import com.musicstream.backend.dto.TrackDTO;
import com.musicstream.backend.model.MusicCategory;
import com.musicstream.backend.model.Track;
import com.musicstream.backend.repository.TrackRepository;
import com.musicstream.backend.service.CloudinaryService;
import com.musicstream.backend.service.TrackService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackServiceTest {

    @Mock
    private TrackRepository trackRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private TrackService trackService;

    @BeforeEach
    void setup() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void saveTrack_ShouldSaveAndReturnTrack() throws IOException {
        MockMultipartFile audioFile = new MockMultipartFile(
                "file", "test.mp3", "audio/mpeg", "fake audio content".getBytes()
        );
        MockMultipartFile coverFile = new MockMultipartFile(
                "cover", "cover.jpg", "image/jpeg", "fake image content".getBytes()
        );

        CreateTrackDTO dto = new CreateTrackDTO();
        dto.setTitle("Test Title");
        dto.setArtist("Test Artist");
        dto.setCategory(MusicCategory.Pop);
        dto.setFile(audioFile);
        dto.setCover(coverFile);

        Track savedTrack = Track.builder()
                .id(1L)
                .title("Test Title")
                .artist("Test Artist")
                .audioUrl("http://cloudinary.com/audio.mp3")
                .coverUrl("http://cloudinary.com/cover.jpg")
                .build();

        when(cloudinaryService.uploadFile(any(), anyString())).thenReturn("http://cloudinary.com/fake-url");
        when(trackRepository.save(any(Track.class))).thenReturn(savedTrack);

        Track result = trackService.saveTrack(dto);

        assertNotNull(result);
        assertEquals("Test Title", result.getTitle());

        verify(cloudinaryService, times(2)).uploadFile(any(), anyString());
        verify(trackRepository, times(1)).save(any(Track.class));
    }

    @Test
    void getAllTracks_ShouldReturnListOfDTOs() {
        Track track1 = Track.builder().id(1L).title("T1").artist("A1").audioUrl("http://url1.com").addedDate(LocalDateTime.now()).build();
        Track track2 = Track.builder().id(2L).title("T2").artist("A2").audioUrl("http://url2.com").addedDate(LocalDateTime.now()).build();

        when(trackRepository.findAll()).thenReturn(Arrays.asList(track1, track2));

        List<TrackDTO> result = trackService.getAllTracks();

        assertEquals(2, result.size());
        assertEquals("T1", result.get(0).getTitle());

        assertEquals("http://url1.com", result.get(0).getStreamUrl());
    }

    @Test
    void getTrackById_ShouldReturnTrack_WhenFound() {
        Track track = Track.builder().id(1L).title("Song").build();
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));

        Track result = trackService.getTrackById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getTrackById_ShouldThrowException_WhenNotFound() {
        when(trackRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            trackService.getTrackById(99L);
        });

        assertTrue(exception.getMessage().contains("Track not found"));
    }

    @Test
    void getTrackDetails_ShouldReturnDTO() {
        Track track = Track.builder().id(10L).title("Details").audioUrl("http://details-url.com").addedDate(LocalDateTime.now()).build();
        when(trackRepository.findById(10L)).thenReturn(Optional.of(track));

        TrackDTO dto = trackService.getTrackDetails(10L);

        assertNotNull(dto);
        assertEquals("Details", dto.getTitle());
        assertEquals("http://details-url.com", dto.getStreamUrl());
    }
}