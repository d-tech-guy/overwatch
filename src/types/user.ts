import type { USER_ROLE } from "@/lib/constants";

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/**
 * Authenticated administrator user.
 * Maps directly to the `users` table in Supabase.
 */
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  createdAt: string;
}

/**
 * Database row shape (snake_case).
 * Use this when working directly with Supabase query results.
 */
export interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  school_id: string | null;
  created_at: string;
}
