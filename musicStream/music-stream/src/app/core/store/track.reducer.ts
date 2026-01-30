import { createReducer, on } from "@ngrx/store";
import * as TrackActions from "./track.actions";
import { Track } from '../models/track'; 

export interface TrackState {
    tracks: Track[];
    loading: boolean;
    error: string | null;
}

export const initialTrackState: TrackState = {
    tracks: [],
    loading: false,
    error: null
}

export const trackReducer = createReducer(
    initialTrackState,
    on(TrackActions.loadTracks, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({
        ...state,
        tracks: tracks,  
        loading: false,
        error: null
    })),
    on(TrackActions.addTrackSuccess, (state, { track }) => ({
        ...state,
        tracks: [...state.tracks, track], 
        loading: false
    })),
    on(TrackActions.loadTracksFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),
    on(TrackActions.updateTrackSuccess, (state, { track }) => ({
        ...state,
        tracks: state.tracks.map(t => t.id === track.id ? track : t),
        error: null
    })),
    on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
        ...state,
        tracks: state.tracks.filter(t => t.id !== id), 
        loading: false
    })) 
);

