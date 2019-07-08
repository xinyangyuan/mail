import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Attributes:
  private BACKEND_URL = 'http://localhost:3000/api/user/';
  private authStatusListener = new Subject<boolean>();
  private tokenExpireTimer: any;

  // Constructor:
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /*
    Method: sign-up function
  */

  signUp(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      // send user sign-up request to backend server
      .post<{ token: string; expiresDuration: number; userId: string }>(
        this.BACKEND_URL + 'signup',
        authData
      )
      // handling the response from backend server
      .subscribe(
        res => {
          // localStorage.setItem('token', res.token);
          this.autoSignOut(res.expiresDuration);
          this.saveAuthInCookie(res.token, res.expiresDuration);
          this.authStatusListener.next(true);
          console.log('You have been logged in!');
        },
        err => {
          console.log('unable to sign-up new user');
        }
      );
  }

  /*
    Method: sign-in function
  */

  signIn(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      // send user log-in request to backend server
      .post<{ token: string; expiresDuration: number; userId: string }>(
        this.BACKEND_URL + 'signin',
        authData
      )
      // handling the response from backend server
      .subscribe(
        res => {
          this.autoSignOut(res.expiresDuration);
          this.saveAuthInCookie(res.token, res.expiresDuration);
          this.authStatusListener.next(true);
          console.log('You have been logged in!');
        },
        err => {
          console.log('unable to sign in the user');
        }
      );
  }

  /*
    Method: auto sigin-in using credentials in cookies
  */
  autoSignIn() {
    // get auth information from cookies
    const authInfo = this.getAuthInfo();
    if (!authInfo) {
      return;
    }

    // valid expiration time
    const now = new Date(); // unit: mili-second ms
    const expiresDuration = new Date(authInfo.expiresIn).getTime() - now.getTime();

    if (expiresDuration > 0) {
      // it does not call backend to verify the token
      this.autoSignOut(expiresDuration / 1000);
      this.authStatusListener.next(true);
      console.log('You have been logged in!');
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
      this.cookieService.check('authStatus')
    ) {
      return {
        authStatus: this.cookieService.get('authStatus'),
        expiresIn: this.cookieService.get('expiresIn'),
        token: this.cookieService.get('token')
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
    Method: get the existed token [should I get from local storage?]
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
    Method: listen to observable that push auth status
  */

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /*
    Method: save authorization data in local cookies
  */
  saveAuthInCookie(token: string, expiresDuration: number) {
    this.cookieService.set('token', token, expiresDuration / (3600 * 24));
    this.cookieService.set('authStatus', 'true', expiresDuration / (3600 * 24));

    // convert to actual expiration time and save to cookies
    const now = new Date(); // browser compatibility WARN: IE 8 or earlier maybe not working
    const expiresIn = new Date(now.getTime() + expiresDuration * 1000).toISOString();
    this.cookieService.set('expiresIn', expiresIn, expiresDuration / (3600 * 24));
  }
}
