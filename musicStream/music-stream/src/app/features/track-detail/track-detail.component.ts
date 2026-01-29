import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormatTimePipe } from '../../shared/pipes/format-time.pipe';
import { TrackService } from '../../core/services/track.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Track } from '../../core/models/track';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormatTimePipe, DatePipe, DecimalPipe],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent {

  private routr = inject(ActivatedRoute);
  private router = inject(Router);
  private trackService = inject(TrackService);
  public playerService = inject(AudioPlayerService);
  private sanitizer = inject(DomSanitizer);
  track: Track | undefined;

  ngOnInit() {
    const id = Number(this.routr.snapshot.paramMap.get('id'));
    if (id) {
      this.trackService.getTrackById(id).subscribe({
        next: (t) => {
          if (t) this.track = t;
          else this.router.navigate(['/library']);

        },
        error: () => this.router.navigate(['/library'])

      });

    }

  }

  getCoverUrl(track: Track): SafeUrl | string {
    if (!track.cover) return '';
    if (typeof track.cover === 'string') return track.cover;
    if (track.cover instanceof File || track.cover instanceof Blob) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(track.cover));
    }
    return '';
  }
  

  play() {
    if (this.track) {
      this.playerService.playTrack(this.track, [this.track]);
    }
  }
  
  delete() {
    if (this.track && confirm('Voulez-vous vraiment supprimer ce morceau ?')) {
      this.trackService.deleteTrack(this.track.id!).then(() => {
        this.router.navigate(['/library']);
      })
    }
  }





}
