import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
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

        // Display error
        // alert(error.error.message);
        this.snackBar.open(error.error.message, '', {
          duration: 2200,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['red-snackbar']
        });

        // Return error to service subscriber
        return throwError(error);
      })
    );
  }
}
