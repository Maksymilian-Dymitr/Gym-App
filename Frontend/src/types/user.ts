import type { Role } from './auth';

export interface AdminUser {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  google_id?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
}
