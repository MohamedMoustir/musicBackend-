import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TrackState } from "./track.reducer";

export const selectTrackState = createFeatureSelector<TrackState>('tracks');

export const selectAllTracks = createSelector(
    selectTrackState,
    (state) => state.tracks
)
export const selectIsLoading = createSelector(
    selectTrackState,
    (state) => state.loading
)
export const selectError = createSelector(
  selectTrackState,
  (state) => state.error
);