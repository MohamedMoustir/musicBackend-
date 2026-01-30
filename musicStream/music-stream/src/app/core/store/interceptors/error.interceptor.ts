import { HttpInterceptorFn } from "@angular/common/http";
import { throwError } from "rxjs/internal/observable/throwError";
import { catchError } from "rxjs/internal/operators/catchError";


export const errorInterceptor :HttpInterceptorFn =  (req, next) => {
    return next(req).pipe(
        catchError((error) => {
            console.error('HTTP Error:', error);
            return throwError(() => error);
        })
    );
}