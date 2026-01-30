import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Track } from '../models/track';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl);
  }

  
  getTrackById(id: string | number): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  createTrack(file: File, metadata: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => formData.append(key, metadata[key]));

    return this.http.post(this.apiUrl, formData);
  }

  
  updateTrack(track: Partial<Track>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${track.id}`, track);
  }

  deleteTrack(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}