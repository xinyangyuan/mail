import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';

import * as AuthActions from './auth.action';
import { User } from '../auth.model';
import { AuthService } from '../auth.service';

/*
   Auth State
*/

export interface AuthStateModel {
  user: User;
  token: string;
  authError: string;
}

/*
   Initial State
*/

const initialState: AuthStateModel = {
  user: null,
  token: null,
  authError: null
};

/*
   Action Map:
*/

@State<AuthStateModel>({ name: 'auth', defaults: initialState })
export class AuthState {
  // Constructor:
  constructor(private authService: AuthService) {}

  /*
    Selectors:
  */

  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.user.email;
  }

  @Selector()
  static isSender(state: AuthStateModel) {
    return state.user.isSender;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static authError(state: AuthStateModel) {
    return state.authError;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return state.token !== undefined;
  }

  /*
   Action: sign in
  */

  @Action(AuthActions.SignIn)
  signIn(ctx: StateContext<AuthStateModel>, action: AuthActions.SignIn) {
    return this.authService._signIn(action.payload.email, action.payload.password).pipe(
      tap(
        result => {
          ctx.patchState({
            token: result.token,
            user: result.user
          });
        },
        error => {
          ctx.patchState({
            authError: error.error.message
          });
        }
      )
    );
  }

  /*
   Action: sign out
  */

  @Action(AuthActions.SignOut)
  signOut(ctx: StateContext<AuthStateModel>) {
    return this.authService._signOut();
  }

  /*
   Action: auto sign-in using credentials stored in cookies
  */

  @Action(AuthActions.AutoSignIn)
  async autoSignIn(ctx: StateContext<AuthStateModel>) {
    // get new access token
    const { ok, token } = await this.authService._refreshToken().toPromise();
    if (!ok) {
      return;
    }
    ctx.patchState({ token });

    // get user
    const { user } = await this.authService._getUser().toPromise();
    ctx.patchState({ user });
  }

  /*
   Action: refresh token
  */

  @Action(AuthActions.RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>) {
    return this.authService._refreshToken().pipe(
      tap(result => {
        ctx.patchState({
          token: result.token
        });
      })
    );
  }

  /*
   Action: verify email address
  */

  @Action(AuthActions.VerifyEmailConfirmation)
  async verifyEmailConfirmation(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.VerifyEmailConfirmation
  ) {
    // action payloads
    const { password, emailToken } = action.payload;

    // call api to complete email address verification
    await this.authService._verifyEmailConfirmation(password, emailToken).toPromise();

    // call api to log-in user
    const { userId } = jwtDecode(emailToken);
    const { token, user } = await this.authService._signInById(userId, password).toPromise();

    // update auth store
    ctx.patchState({ token, user });
  }

  /*
   Action: resend email confirmation
  */

  @Action(AuthActions.ResendEmailConfirmation)
  resendEmailConfirmation(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.ResendEmailConfirmation
  ) {
    return this.authService._sendEmailConfirmation(action.payload).pipe(
      tap(result => {
        ctx.patchState({
          authError: null
        });
      })
    );
  }

  /*
   Action: reset password request
  */
}
