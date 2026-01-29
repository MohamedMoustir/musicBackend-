import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Track, CreateTrackDTO } from '../models/track';
import { tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  tracks = signal<Track[]>([]);
  status = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  
  
  isLoading = computed(() => this.status() === 'loading');
  error = computed(() => this.status() === 'error' ? 'error' : null);

 
  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl).pipe(
      tap(data => this.tracks.set(data)),
      catchError(err => {
        this.status.set('error');
        return of([]);
      })
    );
  }

  getTrackById(id: string | number): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  
  async addTrack(file: File, metadata: any): Promise<any> {
    this.status.set('loading');
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => formData.append(key, metadata[key]));

    return this.http.post(this.apiUrl, formData).pipe(
      tap(() => {
        this.status.set('success');
        this.getAllTracks().subscribe(); 
      }),
      catchError(err => {
        this.status.set('error');
        throw err;
      })
    ).toPromise();
  }

  async updateTrack(track: Partial<Track>): Promise<any> {
    this.status.set('loading');
    return this.http.put(`${this.apiUrl}/${track.id}`, track).pipe(
      tap(() => this.status.set('success')),
      catchError(err => {
        this.status.set('error');
        throw err;
      })
    ).toPromise();
  }

  async deleteTrack(id: string | number): Promise<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.tracks.update(t => t.filter(track => track.id !== +id))),
      catchError(err => {
        this.status.set('error');
        throw err;
      })
    ).toPromise();
  }
}