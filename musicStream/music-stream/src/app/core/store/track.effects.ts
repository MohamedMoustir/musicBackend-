import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TrackActions from "./track.actions";
import { TrackService } from "../services/track.service";
import { catchError, map, mergeMap, of } from "rxjs";
import { Router } from "@angular/router";

export const loadTracksEffect = createEffect(
    (action$ = inject(Actions), trackService = inject(TrackService), router = inject(Router)) => {
        return action$.pipe(
            ofType(TrackActions.loadTracks),
            mergeMap(() =>
                trackService.getAllTracks().pipe(
                    map(tracks => {
                        router.navigate(['/library'])
                        return TrackActions.loadTracksSuccess({ tracks });

                    }),
                    catchError(error => of(TrackActions.loadTracksFailure({ error: error.message })))
                ))
        );
    },
    { functional: true }

);
export const addTrackEffect = createEffect(
    (actions$ = inject(Actions), trackService = inject(TrackService), router = inject(Router)) => {
        return actions$.pipe(
            ofType(TrackActions.addTrack),
            mergeMap(({ file, metadata }) =>
                trackService.createTrack(file, metadata).pipe(
                    map(track => {
                        router.navigate(['/library']);
                        return TrackActions.addTrackSuccess({ track });
                    }),
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
            mergeMap(({ track }) =>
                trackService.updateTrack(track).pipe(
                    map((updatedTrack) => {
                        router.navigate(['/library'])
                        return TrackActions.updateTrackSuccess({ track: updatedTrack });
                    }),
                    catchError((error) => of(TrackActions.loadTracksFailure({ error: error.message })))
                )
            )
        );
    },
    { functional: true }
)
export const deleteTrackEffect = createEffect(
  (actions$ = inject(Actions), trackService = inject(TrackService)) => {
    return actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(({ id }) =>
        trackService.deleteTrack(id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id })),
          catchError((error) => of(TrackActions.loadTracksFailure({ error: error.message })))
        )
      )
    );
  },
  { functional: true }
);