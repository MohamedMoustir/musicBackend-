import { AsyncPipe, CommonModule } from '@angular/common';
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
import { Store } from '@ngrx/store';
import { selectAllTracks, selectIsLoading } from '../../core/store/track.selectors';
import { loadTracks } from '../../core/store/track.actions';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink, FormatTimePipe, FormsModule, DragDropModule, AsyncPipe],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent {

  playerService = inject(AudioPlayerService);
  private sanitizer = inject(DomSanitizer);
  private store = inject(Store);

  private trackSignal = toSignal(this.store.select(selectAllTracks), { initialValue: [] });
  loading$ = this.store.select(selectIsLoading);
  private coverCache = new Map<number, SafeUrl | string>();

  searchQuery = signal<string>('');
  selectedFilter = signal<string>('Tout');
  ngOnInit() {
    this.store.dispatch(loadTracks());
  }


 

  filteredTracks = computed(() => {

    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();
    const tracks = this.trackSignal();

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

    if (track.cover instanceof File || track.cover instanceof Blob) {
      if (this.coverCache.has(track.id)) {
        return this.coverCache.get(track.id)!;
      }

      const url = URL.createObjectURL(track.cover);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);

      if (track.id) {
        this.coverCache.set(track.id, safeUrl);
      }

      return safeUrl;
    }

    if (track.coverUrl) {
      return track.coverUrl;
    }

    if (typeof track.cover === 'string' && track.cover.length > 0) {
      return track.cover;
    }

    return 'assets/images/placeholder.png';
  }

  async deleteTrack(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer ce morceau ?')) {
      // this.store.dispatch(deleteTrack({ id }));
    }
  }

  drop(event: CdkDragDrop<Track[]>) {
   
    // moveItemInArray(currentList, event.previousIndex, event.currentIndex);
    
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

  previous() {this.playerService.previous();}
  next() {this.playerService.next();}
  togglePlay() {this.playerService.togglePlay(); }
  onstop() {this.playerService.seStop();}

}
