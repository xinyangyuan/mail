export interface Auth {
  token: string;
}

// Legacies:
export interface AuthData {
  email: string;
  password?: string;
  isSender?: boolean; // optional when sign-in
}

export interface User {
  email: string;
  name: { first: string; last: string };
  isSender: boolean;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: 'USER' | 'SENDER';
  code?: string;
}
