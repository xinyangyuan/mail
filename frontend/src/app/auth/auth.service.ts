import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthData, User } from './auth.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Attributes:
  private BACKEND_URL = environment.apiURL + '/user/';

  // Constructor:
  constructor(private http: HttpClient) {}

  /*
    $ Method: sign-in
  */

  _signIn(email: string, password: string): Observable<{ ok: boolean; token: string; user: User }> {
    // log-in authData
    const authData: AuthData = { email, password };

    return this.http.post<{ ok: boolean; token: string; user: User }>(
      this.BACKEND_URL + 'signin',
      authData,
      { withCredentials: true }
    );
  }

  /*
    $ Method: sign-in by userId
  */

  _signInById(
    userId: string,
    password: string
  ): Observable<{ ok: boolean; token: string; user: User }> {
    // log-in authData
    const authData = { userId, password };

    return this.http.post<{ ok: boolean; token: string; user: User }>(
      this.BACKEND_URL + 'signin',
      authData,
      { withCredentials: true }
    );
  }

  /*
    $ Method: refresh access token
  */

  _refreshToken(): Observable<{ ok: boolean; token: string }> {
    return this.http.post<{ ok: boolean; token: string }>(
      this.BACKEND_URL + 'refresh_token',
      {},
      { withCredentials: true }
    );
  }

  /*
    Method: sign-out
  */

  _signOut() {
    console.log('You have been logged out!');
    return this.http.post<{ ok: boolean }>(
      this.BACKEND_URL + 'signout',
      {},
      { withCredentials: true }
    );
  }

  /*
     $ Method: sign-up
  */

  _signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'SENDER' | 'USER',
    code?: string
  ): Observable<{ message: string }> {
    // pack all required post data
    const authData = { firstName, lastName, email, password, role, code };

    // send user sign-up request to backend server
    return this.http.post<{ message: string }>(this.BACKEND_URL + 'signup', authData);
  }

  /*
    $ Method: get user info
  */

  _getUser() {
    return this.http.get<{ user: User }>(this.BACKEND_URL + 'self');
  }

  /*
    $ Method: request server to send new verification email
  */

  _sendEmailConfirmation(email: string): Observable<{ message: string }> {
    // request user to send new verification email
    return this.http.get<{ message: string }>(this.BACKEND_URL + 'confirmation/' + email);
  }

  /*
    $ Method: request server to verify the user's email address
  */

  _verifyEmailConfirmation(password: string, emailToken: string): Observable<{ token: string }> {
    return this.http.post<{ ok: boolean; token: string }>(
      this.BACKEND_URL + 'confirmation/' + emailToken,
      { password }
    );
  }

  /*
    $ Method: send password reset request
  */

  _resetPassword(email: string): Observable<{ message: string }> {
    // send password reset request to backend server
    return this.http.get<{ message: string }>(this.BACKEND_URL + 'reset/' + email);
  }

  /*
    $ Method: update user's account with new password
  */

  _verifyReset(password: string, emailToken: string): Observable<{ token: string }> {
    // send password reset request to backend server
    return this.http.post<{ ok: boolean; token: string }>(
      this.BACKEND_URL + 'reset/' + emailToken,
      { password }
    );
  }
}
