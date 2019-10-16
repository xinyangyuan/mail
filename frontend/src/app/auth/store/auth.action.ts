import { SignUpData } from '../models/sign-up-data.model';

/*
   Core:
*/

export class SignIn {
  static readonly type = '[Sign In Page] Sign In';
  constructor(public payload: { email: string; password: string }) {}
}

export class AutoSignIn {
  static readonly type = '[App Component] Auto Sign In';
}

export class RefreshToken {
  static readonly type = '[Auth Interceptor] Refresh Token';
}

export class SignUp {
  static readonly type = '[Sign Up Page] Sign Up';
  constructor(public payload: SignUpData) {}
}

export class SignOut {
  static readonly type = '[Dashboard Header] Sign Out';
}

/*
   Email Verification:
*/

export class ResendEmailConfirmation {
  static readonly type = '[Sign In Page] Resend Email Confirmation';
  constructor(public payload: string) {} // payload: email
}

export class VerifyEmailConfirmation {
  static readonly type = '[Sign Up Confirmation Page] Verify Email Confirmation';
  constructor(public payload: { password: string; emailToken: string }) {}
}

/*
  Password Reset:
*/

export class ResetPassword {
  static readonly type = '[Forgot Password Page] Reset Password';
  constructor(public payload: string) {} // payload: email
}

export class VerifyPasswordReset {
  static readonly type = '[Reset Password Page] Verify Password Reset';
  constructor(public payload: { password: string; emailToken: string }) {}
}
