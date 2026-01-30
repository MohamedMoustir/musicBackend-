import { createAction, props } from '@ngrx/store';
import { CreateTrackDTO, Track } from '../models/track';
export const loadTracks = createAction('[Track list ] Load Tracks');

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