import { Injectable } from '@angular/core';
import { liveQuery } from "dexie";
import { db } from '../db/db-config'
import { Track } from '../models/track';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  getAllTracks(): Observable<Track[]> {
    return from(liveQuery((() => db.tracks.orderBy('addedDate').reverse().toArray())));
  }

  async AddTrack(track: Track): Promise<number> {
    return await db.tracks.add(track);
  }
  async deleteTrack(id: number): Promise<void> {
    return await db.tracks.delete(id);
  }
  async getTrackById(id: number): Promise<Track | undefined> {
    return await db.tracks.get(id);
  }
  async updateTrack(track: Track): Promise<number> {
    if (!track.id) throw new Error('Track ID missing');
    return await db.tracks.update(track.id, track);
  }

}
