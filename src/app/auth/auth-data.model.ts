export interface AuthData {
  email: string;
  password?: string;
  isSender?: boolean; // optional when sign-in
}
