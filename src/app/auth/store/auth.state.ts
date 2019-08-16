import { State, Selector, Action, StateContext } from '@ngxs/store';

import * as AuthAction from './auth.action';
import { AutoSignIn } from './auth.action';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators';

/*
   Auth State
*/

export interface AuthStateModel {
  user: AuthData;
  isLoading: boolean;
  needConfirmation: boolean;
}

/*
   Initial State
*/

const initialState: AuthStateModel = {
  user: null,
  isLoading: false,
  needConfirmation: false
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
  static isLoading(state: AuthStateModel) {
    return state.isLoading;
  }

  @Selector()
  static needConfirmation(state: AuthStateModel) {
    return state.needConfirmation;
  }

  /*
   Action: sign in
  */

  @Action(AuthAction.SignIn)
  signIn(ctx: StateContext<AuthStateModel>, action: AuthAction.SignIn) {
    ctx.patchState({ isLoading: true });

    return this.authService._signIn(action.payload.email, action.payload.password).pipe(
      tap(
        result => {
          ctx.patchState({
            isLoading: false,
            user: {
              email: action.payload.email,
              password: action.payload.password,
              isSender: result.isSender
            }
          });
        },
        error => {
          ctx.patchState({
            isLoading: false,
            needConfirmation:
              error.error.message === 'Please verify your email address!' ? true : false
          });
        }
      )
    );
  }

  /*
   Action: auto sign-in using credentials stored in cookies
  */
  @Action(AutoSignIn)
  autoSignIn(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ isLoading: true });

    if (this.authService.autoSignIn()) {
      const { email, expiresIn, token, isSender } = this.authService.getAuthInfo();
      ctx.patchState({ user: { email, isSender } });
    }
  }

  /*
   Action: resend email confirmation
  */

  @Action(AuthAction.ResendEmailConfirmation)
  resendEmailConfirmation(
    ctx: StateContext<AuthStateModel>,
    action: AuthAction.ResendEmailConfirmation
  ) {
    ctx.patchState({ isLoading: true });

    return this.authService._sendEmailConfirmation(action.payload).pipe(
      tap(
        result => {
          ctx.patchState({
            isLoading: false,
            needConfirmation: false
          });
        },
        error => {
          ctx.patchState({ isLoading: false });
        }
      )
    );
  }
}
