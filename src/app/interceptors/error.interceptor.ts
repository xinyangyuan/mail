import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Construtor
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Console log error
        // console.log(error);

        // // Display error
        // // alert(error.error.message);

        if (
          error.error.message !== 'Please verify your email address!' &&
          !(error.error instanceof Blob)
        ) {
          this.snackBar.open(
            error.error.message ? error.error.message : 'Unknow error occured',
            'CLOSE',
            {
              duration: 2200,
              verticalPosition: 'bottom',
              horizontalPosition: 'left'
              // panelClass: ['red-snackbar']
            }
          );
        }

        // Return error to service subscriber
        return throwError(error);
      })
    );
  }
}
