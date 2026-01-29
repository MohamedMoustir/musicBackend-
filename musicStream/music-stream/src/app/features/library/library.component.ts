import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackService } from '../../core/services/track.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { FormatTimePipe } from '../../shared/pipes/format-time.pipe';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Track } from '../../core/models/track';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink, FormatTimePipe, FormsModule, DragDropModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent {

  trackService = inject(TrackService);
  playerService = inject(AudioPlayerService)
  private sanitizer = inject(DomSanitizer);

  private coverCache = new Map<number, SafeUrl | string>();
  tracks$ = this.trackService.getAllTracks();

  searchQuery = signal<string>('');
  selectedFilter = signal<string>('Tout');
  private allTrack = signal<Track[]>([]);

  constructor() {
    this.trackService.getAllTracks()
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        this.allTrack.set(data);
      });
  }

  filteredTracks = computed(() => {

    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();
    const tracks = this.allTrack();

    return tracks.filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query);

      const matchesCategory = filter === 'Tout' || track.category === filter;

      return matchesSearch && matchesCategory;
    })

  })



  onPlay(track: any) {
    console.log('Playing track:', track);
    this.playerService.playTrack(track, this.filteredTracks());
  }

  getCoverUrl(track: any): SafeUrl | string {
    if (!track.cover) return 'assets/images/placeholder.png';

    if (typeof track.cover === 'string') return track.cover;

    if (this.coverCache.has(track.id)) {
      return this.coverCache.get(track.id)!;
    }

    if (track.cover instanceof Blob || track.cover instanceof File) {
      const url = URL.createObjectURL(track.cover);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);

      this.coverCache.set(track.id, safeUrl);

      return safeUrl;
    }

    return '';
  }

  async deleteTrack(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer ce morceau ?')) {
      await this.trackService.deleteTrack(id);
    }
  }

  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (!isNaN(value) && isFinite(value)) {
      this.playerService.seekTo(value);
    }
  }

  onVolume(event: any) {
    const value = event.target.value;
    this.playerService.setVolume(value);
  }

  previous() {
    this.playerService.previous();
  }

  next() {
    this.playerService.next();
  }

  togglePlay() {
    this.playerService.togglePlay();
  }

  drop(event: CdkDragDrop<Track[]>) {
    if (this.searchQuery() !== '' || this.selectedFilter() !== 'Tout') {
      return;
    }

    const currentList = [...this.allTrack()];
    moveItemInArray(currentList, event.previousIndex, event.currentIndex);
    this.allTrack.set(currentList);
  }

  onstop() {
    this.playerService.seStop();
  }

}
