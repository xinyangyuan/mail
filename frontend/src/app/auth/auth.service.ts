import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { SignInWithEmail, SignInWithUserId } from './models/sign-in-data.model';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Attributes:
  private BACKEND_URL = environment.apiURL + '/auth/';

  // Constructor:
  constructor(private http: HttpClient) {}

  /*
    $ Method: sign-in [POST]
  */

  _signIn(email: string, password: string): Observable<{ ok: boolean; token: string }> {
    const authData: SignInWithEmail = { email, password };
    return this.http.post<{ ok: boolean; token: string }>(this.BACKEND_URL + 'signin', authData, {
      withCredentials: true
    });
  }

  /*
    $ Method: sign-in by userId [POST]
  */

  _signInById(userId: string, password: string): Observable<{ ok: boolean; token: string }> {
    const authData: SignInWithUserId = { userId, password };
    return this.http.post<{ ok: boolean; token: string }>(this.BACKEND_URL + 'signin', authData, {
      withCredentials: true
    });
  }

  /*
    $ Method: refresh access token [POST]
  */

  _refreshToken(): Observable<{ ok: boolean; token: string }> {
    return this.http.post<{ ok: boolean; token: string }>(
      this.BACKEND_URL + 'refresh_token',
      {},
      { withCredentials: true }
    );
  }

  /*
    Method: sign-out [POST]
  */

  _signOut(): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      this.BACKEND_URL + 'signout',
      {},
      { withCredentials: true }
    );
  }

  /*
     $ Method: sign-up [POST]
  */

  _signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'SENDER' | 'USER',
    code?: string
  ): Observable<{ message: string }> {
    const authData = { firstName, lastName, email, password, role, code };
    return this.http.post<{ ok: boolean; message: string }>(this.BACKEND_URL + 'signup', authData);
  }

  /*
    $ Method: get my account user info [GET]
  */

  _getMyInfo(): Observable<{ user: User }> {
    return this.http
      .get<{ ok: boolean; data: { user: User } }>(environment.apiURL + '/users/self')
      .pipe(map(result => result.data));
  }

  /*
    $ Method: request server to send new verification email [GET]
  */

  _sendEmailConfirmation(email: string): Observable<{ message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(
      this.BACKEND_URL + 'send_email_verficication',
      { email }
    );
  }

  /*
    $ Method: request server to verify the user's email address [POST]
  */

  _verifyEmailConfirmation(password: string, emailToken: string): Observable<{ token: string }> {
    return this.http.post<{ ok: boolean; token: string; message: string }>(
      this.BACKEND_URL + 'confirm_email_verficication',
      { emailToken, password }
    );
  }

  /*
    $ Method: send password reset request - forgot password [POST]
  */

  _resetPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(this.BACKEND_URL + 'forgot_password', {
      email
    });
  }

  /*
    $ Method: update user's account with new password [POST]
  */

  _verifyPasswordReset(password: string, emailToken: string): Observable<{ token: string }> {
    return this.http.post<{ ok: boolean; token: string; message: string }>(
      this.BACKEND_URL + 'reset_password',
      {
        emailToken,
        password
      }
    );
  }
}
