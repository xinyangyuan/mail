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

// status: 'CREATED' | 'CONFIRMED' | 'ACTIVE' | 'INACTIVE';
