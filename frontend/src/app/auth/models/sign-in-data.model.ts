interface SignInData {
  password: string;
}

export interface SignInWithEmail extends SignInData {
  email: string;
}

export interface SignInWithUserId extends SignInData {
  userId: string;
}
