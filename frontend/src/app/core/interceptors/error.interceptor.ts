import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Construtor:
  constructor(private snackBar: MatSnackBar) {}

  // Method: intercept http call
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Show error snackbar
        if (
          error.error.message !== 'Please verify your email address!' &&
          !(error.error instanceof Blob)
        ) {
          this.showSnackBar(error.error.message);
        }

        // Return error to service subscriber
        return throwError(error);
      })
    );
  }

  // Method: display snackbar
  private showSnackBar(message: string) {
    // set default message if none provided
    if (!message) {
      message = 'Service Temporarily Unavailable 🚧';
    }

    // open snack bar
    this.snackBar.open(message, 'CLOSE', {
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      panelClass: ['warning-snackbar']
    });
  }
}
