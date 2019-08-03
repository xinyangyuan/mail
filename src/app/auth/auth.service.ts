import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AuthData } from './auth-data.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Attributes:
  private BACKEND_URL = environment.apiURL + '/user/';

  private authStatusListener = new Subject<boolean>();
  private tokenExpireTimer: any;

  // Constructor:
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  /*
     Method: sign-up function
  */

  signUp(email: string, password: string, isSender: boolean) {
    const authData: AuthData = { email, password, isSender };

    this.http
      // send user sign-up request to backend server
      .post<{ token: string; expiresDuration: number; userId: string; isSender: boolean }>(
        this.BACKEND_URL + 'signup',
        authData
      )
      // handling the response from backend server
      .subscribe(
        res => {
          // trigger additional callback funcs
          this.autoSignOut(res.expiresDuration);
          this.saveAuthInCookie(res.token, res.expiresDuration, res.isSender);
          // push auth listener
          this.authStatusListener.next(true);
          console.log('You have been logged in!');
        },
        err => {
          console.log('unable to sign-up new user');
        }
      );
  }

  /*
     $ Method: sign-up function
  */

  _signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isSender: boolean
  ): Observable<{ message: string }> {
    // pack all required post data
    const authData = { firstName, lastName, email, password, isSender };

    return (
      this.http
        // send user sign-up request to backend server
        .post<{ message: string }>(this.BACKEND_URL + 'signup', authData)
        // handling the response from backend server
        .pipe(
          tap(
            _ => {
              console.log('You have been logged in!');
            },
            _ => {
              console.log('Unable to sign-up new user');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: request server to send new verification email
  */

  _sendEmailConfirmation(email: string): Observable<{ message: string }> {
    return (
      this.http
        // request user to send new verification email
        .get<{ message: string }>(this.BACKEND_URL + 'confirmation/' + email)
        // handling the response from backend server
        .pipe(
          tap(
            _ => {
              console.log('New verification email is sent!');
            },
            _ => {
              console.log('Failed to send new email verification');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: request server to verify the user's email address
  */

  _verifyEmailConfirmation(
    password: string,
    emailToken: string
  ): Observable<{ token: string; expiresDuration: number; userId: string; isSender: boolean }> {
    return (
      this.http
        // send user log-in request to backend server
        .post<{ token: string; expiresDuration: number; userId: string; isSender: boolean }>(
          this.BACKEND_URL + 'confirmation/' + emailToken,
          { password }
        )
        // handling the response from backend server
        .pipe(
          tap(
            res => {
              // trigger additional callback funcs
              this.autoSignOut(res.expiresDuration);
              this.saveAuthInCookie(res.token, res.expiresDuration, res.isSender);
              // push auth listener
              this.authStatusListener.next(true);
              console.log('You have been logged in!');
            },
            err => {
              console.log('get error response from server');
              console.log('unable to sign in the user');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: sign-in function
  */

  signIn(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      // send user log-in request to backend server
      .post<{ token: string; expiresDuration: number; userId: string; isSender: boolean }>(
        this.BACKEND_URL + 'signin',
        authData
      )
      // handling the response from backend server
      .subscribe(
        res => {
          // trigger additional callback funcs
          this.autoSignOut(res.expiresDuration);
          this.saveAuthInCookie(res.token, res.expiresDuration, res.isSender);
          // push auth listener
          this.authStatusListener.next(true);
          console.log('You have been logged in!');
        },
        err => {
          console.log('unable to sign in the user');
        }
      );
  }

  /*
    $ Method: sign-in function
  */

  _signIn(
    email: string,
    password: string
  ): Observable<{ token: string; expiresDuration: number; userId: string; isSender: boolean }> {
    // pack all required post data
    const authData: AuthData = { email, password };

    return (
      this.http
        // send user log-in request to backend server
        .post<{ token: string; expiresDuration: number; userId: string; isSender: boolean }>(
          this.BACKEND_URL + 'signin',
          authData
        )
        // handling the response from backend server
        .pipe(
          tap(res => {
            // trigger additional callback funcs
            this.autoSignOut(res.expiresDuration);
            this.saveAuthInCookie(res.token, res.expiresDuration, res.isSender);
            // push auth listener
            this.authStatusListener.next(true);
            console.log('You have been logged in!');
          })
        )
    );
  }

  /*
    $ Method: send password reset request
  */

  _resetPassword(email: string): Observable<{ message: string }> {
    return (
      this.http
        // send password reset request to backend server
        .get<{ message: string }>(this.BACKEND_URL + 'reset/' + email)
        // handling the response from backend server
        .pipe(
          tap(
            res => {
              console.log('Password reset email is sent!');
            },
            err => {
              console.log('Unable to send password reset email');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    $ Method: update user's account with new password
  */

  _verifyReset(
    password: string,
    emailToken: string
  ): Observable<{ token: string; expiresDuration: number; userId: string; isSender: boolean }> {
    return (
      this.http
        // send password reset request to backend server
        .post<{ token: string; expiresDuration: number; userId: string; isSender: boolean }>(
          this.BACKEND_URL + 'reset/' + emailToken,
          { password }
        )
        // handling the response from backend server
        .pipe(
          tap(
            res => {
              // trigger additional callback funcs
              this.autoSignOut(res.expiresDuration);
              this.saveAuthInCookie(res.token, res.expiresDuration, res.isSender);
              // push auth listener
              this.authStatusListener.next(true);
              console.log('You have been logged in!');
            },
            err => {
              console.log('Unable to reset your password');
            }
          ),
          catchError(error => throwError(error))
        )
    );
  }

  /*
    Method: auto sigin-in using credentials in cookies
  */
  autoSignIn(): boolean {
    // get auth information from cookies
    const authInfo = this.getAuthInfo();
    if (!authInfo) {
      return false;
    }

    // valid expiration time
    const now = new Date(); // unit: mili-second ms
    const expiresDuration = new Date(authInfo.expiresIn).getTime() - now.getTime();

    if (expiresDuration > 0) {
      // it does not call backend to verify the token
      this.autoSignOut(expiresDuration / 1000);
      this.authStatusListener.next(true);
      console.log('You have been logged in!');
      return true;
    }
  }

  /*
    Method: sign-out function
  */

  signOut() {
    // clear the autoSignOut timer, since already sign-out
    clearTimeout(this.tokenExpireTimer);
    this.cookieService.deleteAll();
    this.authStatusListener.next(false);
    // TODELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.router.navigate(['']);
    console.log('You have been logged out!');
  }

  /*
    Method: automatically sign-out when token expires
  */
  autoSignOut(duration: number) {
    this.tokenExpireTimer = setTimeout(() => {
      this.signOut();
    }, duration * 1000);
  }

  /*
    Method: get the existed token [should I get from local storage?]
  */

  getAuthInfo() {
    if (
      this.cookieService.check('token') &&
      this.cookieService.check('expiresIn') &&
      this.cookieService.check('authStatus') &&
      this.cookieService.check('accountType')
    ) {
      return {
        authStatus: this.cookieService.get('authStatus'),
        expiresIn: this.cookieService.get('expiresIn'),
        token: this.cookieService.get('token'),
        isSender: this.cookieService.get('accountType') === 'sender'
      };
    } else {
      return null;
    }
  }

  /*
    Method: get the existed token [should I get from local storage?]
  */

  getAuthToken() {
    if (this.cookieService.check('token')) {
      return this.cookieService.get('token');
    }
  }

  /*
    Method: get the auth status from cookie
  */

  getAuthStatus() {
    if (!this.cookieService.check('authStatus')) {
      return false;
    }
    // get authentication status from cookie
    const authStatus: string = this.cookieService.get('authStatus');

    if (authStatus !== 'true') {
      return false;
    }
    return true;
  }

  /*
    Method: get the sender from cookie
  */

  getSenderStatus() {
    if (!this.cookieService.check('accountType')) {
      return false;
    }
    // get authentication status from cookie
    const authStatus: string = this.cookieService.get('accountType');

    if (authStatus !== 'sender') {
      return false;
    }
    return true;
  }

  /*
    Method: listen to observable that push auth status
  */

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /*
    Method: save authorization data in local cookies
  */
  saveAuthInCookie(token: string, expiresDuration: number, isSender: boolean) {
    this.cookieService.set('token', token, expiresDuration / (3600 * 24));
    this.cookieService.set('authStatus', 'true', expiresDuration / (3600 * 24));

    // convert to actual expiration time and save to cookies
    const now = new Date(); // browser compatibility WARN: IE 8 or earlier maybe not working
    const expiresIn = new Date(now.getTime() + expiresDuration * 1000).toISOString();
    this.cookieService.set('expiresIn', expiresIn, expiresDuration / (3600 * 24));

    // convert isSender from boolean to string
    const accountType: string = isSender ? 'sender' : 'user';
    this.cookieService.set('accountType', accountType, expiresDuration / (3600 * 24));
  }
}
