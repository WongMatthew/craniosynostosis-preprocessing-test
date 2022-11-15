export interface User {
  username: string;
  hash: string;
  salt: string;
  createdAt: Date;
}

export interface RegisterPayload {
  username: string;
  password: string;
}
