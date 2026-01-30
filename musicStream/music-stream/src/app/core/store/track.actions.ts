import { createAction, props } from '@ngrx/store';
import { CreateTrackDTO, Track } from '../models/track';


export const loadTracks = createAction('[Track List] Load Tracks');

export const loadTracksSuccess = createAction(
  '[Track List] Load Tracks Success',
  props<{ tracks: Track[] }>()
);

export const loadTracksFailure = createAction(
  '[Track List] Load Tracks Failure',
  props<{ error: string }>()
);


export const addTrack = createAction(
  '[Track Manager] Add Track',
  props<{ file: File; metadata: CreateTrackDTO }>()
);

export const addTrackSuccess = createAction(
  '[Track Manager] Add Track Success',
  props<{ track: Track }>()
);


export const updateTrack = createAction(
  '[Track Manager] Update Track',
  props<{ track: Track }>()
);

export const updateTrackSuccess = createAction(
  '[Track Manager] Update Track Success',
  props<{ track: Track }>()
);

export const deleteTrack = createAction(
  '[Track Detail] Delete Track',
  props<{ id: number }>()
);

export const deleteTrackSuccess = createAction(
  '[Track Detail] Delete Track Success',
  props<{ id: number }>()
);