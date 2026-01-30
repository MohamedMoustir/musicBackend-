import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/store/interceptors/error.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { trackReducer } from './core/store/track.reducer';
import { provideEffects } from '@ngrx/effects';
import * as trackEffects from './core/store/track.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { max } from 'rxjs';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(withInterceptors([errorInterceptor])),
     provideStore(),
     provideState({name:'tracks',reducer:trackReducer}),
     provideEffects(trackEffects),
     provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()})

    
    ]

};
