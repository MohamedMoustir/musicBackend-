import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


import { FormatTimePipe } from '../../shared/pipes/format-time.pipe';
import { TrackService } from '../../core/services/track.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { Track } from '../../core/models/track';

import { deleteTrack  } from '../../core/store/track.actions';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormatTimePipe, DatePipe],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent implements OnInit {

  
  private route = inject(ActivatedRoute); 
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private store = inject(Store);
  
  protected trackService = inject(TrackService);
  protected playerService = inject(AudioPlayerService);

  track: Track | undefined;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id) {
   
      this.trackService.getTrackById(id).subscribe({
        next: (t) => {
          if (t) {
            this.track = t;
          } else {
            this.router.navigate(['/library']);
          }
        },
        error: () => this.router.navigate(['/library'])
      });
    }
  }

getCoverUrl(track: Track): string {
  return track.coverUrl || 'assets/images/default-cover.png';
}

  play() {
    if (this.track) {
      this.playerService.playTrack(this.track, [this.track]);
    }
  }

  delete() {
    if (this.track && this.track.id && confirm('Voulez-vous vraiment supprimer ce morceau ?')) {
      
      this.store.dispatch(deleteTrack({ id: this.track.id }));
      
      this.router.navigate(['/library']);
    }
  }
}