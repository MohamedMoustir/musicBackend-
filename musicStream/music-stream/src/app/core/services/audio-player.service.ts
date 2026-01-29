import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track';
import { single } from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  private audio = new Audio();
  currentTrack = signal<Track | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);
  playlist = signal<Track[]>([]);

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime)
    })

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration)
    })

    this.audio.addEventListener('ended', () => {
      this.next();
    })


  }

 playTrack(track: Track, currentPlaylist: Track[] = []) {
   
    if (currentPlaylist.length > 0) this.playlist.set(currentPlaylist);

    if (this.currentTrack()?.id === track.id) {
      this.togglePlay();
      return;
    }
    
    if (this.audio.src.startsWith('blob:')) {
      URL.revokeObjectURL(this.audio.src);
    }

    this.currentTrack.set(track);

    if (track.file instanceof File || track.file instanceof Blob) {
    
      const fileUrl = URL.createObjectURL(track.file);
      this.audio.src = fileUrl;
    } else {
     
      if (track['streamUrl']) {
          this.audio.src = track['streamUrl'];
      } else {
          
          this.audio.src = `${environment.apiUrl}/${track.id}/stream`;
      }
    }

    console.log('Audio source set to:', this.audio.src);
    
    this.audio.load();
    if (track.duration) this.duration.set(track.duration);
    this.play();
}

  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }


  private play() {
    this.audio.play()
      .then(() => this.isPlaying.set(true))
      .catch(err => console.log('Error playing audio:', err));

  }

  private pause() {
    this.audio.pause();
    this.isPlaying.set(false);
  }
  seekTo(seconds: number) {
    this.audio.currentTime = seconds;
  }
  setVolume(vol: number) {
    this.audio.volume = vol;
    this.volume.set(vol);
  }

  next() {
    const list = this.playlist();
    const current = this.currentTrack();
    if (!current || list.length === 0) return;

    const currentIndex = list.findIndex(t => t.id === current.id);
    if (currentIndex < list.length - 1) {
      this.playTrack(list[currentIndex + 1]);
    } else {
      this.pause();
      this.currentTime.set(0);
      this.audio.currentTime = 0;
    }
  }

  previous() {
    const list = this.playlist();
    const current = this.currentTrack();
    if (!current || list.length === 0) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    const currentIndex = list.findIndex(t => t.id === current.id);
    if (currentIndex > 0){
      this.playTrack(list[currentIndex  -1])

    }
  }

  seStop(){
   this.audio.currentTime = 0;
   this.audio.pause()
  }

}
