/*
    Action: get mail list from API
*/

export class SignIn {
  static readonly type = '[Sign In Page] Sign In';
  constructor(public payload: { email: string; password: string }) {}
}

export class AutoSignIn {
  static readonly type = '[App Init] Auto Sign In';
}

export class SignUp {
  static readonly type = '[Sign Up Page] Sign Up';
  constructor(
    public payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      isSender: boolean;
    }
  ) {}
}

export class SignOut {
  static readonly type = '[Dashboard Header] Sign Out';
}

export class ResendEmailConfirmation {
  static readonly type = '[Sign In Page] Resend Email Confirmation';
  constructor(public payload: string) {} // payload: email
}

export class VerifyEmailConfirmation {
  static readonly type = '[Sign Up Confirmation Page] Verify Email Confirmation';
  constructor(public payload: string) {} // payload: password
}

export class ResetPassword {
  static readonly type = '[Forgot Password Page] Reset Password';
  constructor(public payload: string) {} // payload: email
}

export class VerifyPasswordReset {
  static readonly type = '[Reset Password Page] Verify Password Reset';
  constructor(public payload: string) {} // payload: new password
}
