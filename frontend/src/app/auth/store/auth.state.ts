import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import * as jwtDecode from "jwt-decode";

import * as AuthActions from "./auth.action";
import { AuthService } from "../auth.service";

/*
   Auth State
*/

export interface AuthStateModel {
  token: string;
  authError: string;
}

/*
   Initial State
*/

const initialState: AuthStateModel = {
  token: null,
  authError: null,
};

/*
   Action Map:
*/

@State<AuthStateModel>({ name: "auth", defaults: initialState })
@Injectable()
export class AuthState {
  // Constructor:
  constructor(private authService: AuthService) {}

  /*
    Selectors:
  */

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
    return typeof state.token === "string" && state.token.length;
  }

  /*
   Action: sign in
  */

  @Action(AuthActions.SignIn)
  signIn(ctx: StateContext<AuthStateModel>, action: AuthActions.SignIn) {
    return this.authService
      ._signIn(action.payload.email, action.payload.password)
      .pipe(
        tap(
          (result) => {
            ctx.patchState({
              token: result.token,
            });
          },
          (error) => {
            ctx.patchState({
              authError: error.error.message,
            });
          }
        )
      );
  }

  /*
   Action: sign up
  */

  @Action(AuthActions.SignUp)
  signUp(ctx: StateContext<AuthStateModel>, action: AuthActions.SignUp) {
    const { firstName, lastName, email, password, role, code } = action.payload;
    return this.authService._signUp(
      firstName,
      lastName,
      email,
      password,
      role,
      code
    );
  }

  /*
   Action: sign out
  */

  @Action(AuthActions.SignOut)
  signOut(ctx: StateContext<AuthStateModel>) {
    return this.authService._signOut().pipe(
      tap(
        (result) => {
          ctx.patchState({
            token: null,
          });
        },
        (error) => {
          ctx.patchState({
            authError: error.error.message,
          });
        }
      )
    );
  }

  /*
   Action: auto sign-in using credentials stored in cookies
  */

  @Action(AuthActions.AutoSignIn)
  async autoSignIn(ctx: StateContext<AuthStateModel>) {
    const { ok, token } = await this.authService._refreshToken().toPromise();
    if (ok) {
      ctx.patchState({ token });
    }
  }

  /*
   Action: refresh token
  */

  @Action(AuthActions.RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>) {
    return this.authService._refreshToken().pipe(
      tap((result) => {
        ctx.patchState({
          token: result.token,
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
    await this.authService
      ._verifyEmailConfirmation(password, emailToken)
      .toPromise();

    // call api to log-in user [NEED ERROR HANDLING]
    const { userId } = jwtDecode(emailToken);
    const { token } = await this.authService
      ._signInById(userId, password)
      .toPromise();

    // update auth store
    ctx.patchState({ token });
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
      tap((result) => {
        ctx.patchState({
          authError: null,
        });
      })
    );
  }

  /*
   Action: reset password request
  */

  @Action(AuthActions.ResetPassword)
  resetPassword(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.ResetPassword
  ) {
    const email = action.payload;
    return this.authService._resetPassword(email);
  }

  /*
   Action: reset password request [SHOULD auto-log-in user]
  */

  @Action(AuthActions.VerifyPasswordReset)
  async verifyPasswordReset(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.VerifyPasswordReset
  ) {
    const { password, emailToken } = action.payload;
    return this.authService._verifyPasswordReset(password, emailToken);
  }
}
