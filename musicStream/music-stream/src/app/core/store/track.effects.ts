import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TrackActions from "./track.actions";
import { TrackService } from "../services/track.service";
import { catchError, map, switchMap, concatMap, tap, of } from "rxjs"; // ✅ زدنا switchMap و concatMap و tap
import { Router } from "@angular/router";

export const loadTracksEffect = createEffect(
    (action$ = inject(Actions), trackService = inject(TrackService)) => {
        return action$.pipe(
            ofType(TrackActions.loadTracks),
            switchMap(() =>
                trackService.getAllTracks().pipe(
                    map(tracks => TrackActions.loadTracksSuccess({ tracks })),
                    catchError(error => of(TrackActions.loadTracksFailure({ error: error.message })))
                )
            )
        );
    },
    { functional: true }
);

export const addTrackEffect = createEffect(
    (actions$ = inject(Actions), trackService = inject(TrackService), router = inject(Router)) => {
        return actions$.pipe(
            ofType(TrackActions.addTrack),
            concatMap(({ file, metadata }) =>
                trackService.createTrack(file, metadata).pipe(
                    tap(() => router.navigate(['/library'])), 
                    map(track => TrackActions.addTrackSuccess({ track })),
                    catchError(error => of(TrackActions.loadTracksFailure({ error: error.message })))
                )
            )
        );
    },
    { functional: true }
);



export const updateTrackEffect = createEffect(
    (action$ = inject(Actions), trackService = inject(TrackService), router = inject(Router)) => {
        return action$.pipe(
            ofType(TrackActions.updateTrack),
            concatMap(({ trackId, formData }) =>
                trackService.updateTrack(trackId, formData).pipe(
                    tap(() => router.navigate(['/library'])), 
                    map((updatedTrack) => TrackActions.updateTrackSuccess({ track: updatedTrack })),
                    catchError((error) => of(TrackActions.loadTracksFailure({ error: error.message })))
                )
            )
        );
    },
    { functional: true }
);

export const deleteTrackEffect = createEffect(
  (actions$ = inject(Actions), trackService = inject(TrackService)) => {
    return actions$.pipe(
      ofType(TrackActions.deleteTrack),
      concatMap(({ id }) =>
        trackService.deleteTrack(id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id })),
          catchError((error) => of(TrackActions.loadTracksFailure({ error: error.message })))
        )
      )
    );
  },
  { functional: true }
);