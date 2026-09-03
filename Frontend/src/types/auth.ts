export type Role = 'User' | 'Admin';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
