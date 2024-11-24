// ! SUPABASE CLIENT IMPORT
import { createClient } from "@supabase/supabase-js";

// ! ENVIRONMENT VARIABLES
// Supabase URL and anonymous key from environment variables
// Non-null assertion (!) used as these values are required
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ! SUPABASE CLIENT INSTANCE
// Create and export Supabase client for database interactions
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ! DATABASE TYPE DEFINITIONS
// Type definitions for database tables to ensure type safety

// ! USER TYPE
// Represents a user in the system (employee or manager)
export type User = {
  id: number; // Unique identifier
  user_id: string; // Employee ID for login
  name: string; // Full name
  role: "manager" | "employee"; // User role with specific allowed values
  password: string | null; // Optional password field
};

// ! SHIFT TYPE
// Represents a work shift record
export type Shift = {
  id: number; // Unique identifier
  user_id: string; // Reference to user
  date: string; // Shift date
  time_in: string; // Clock-in time
  time_out: string; // Clock-out time
  location: string; // Work location
  employeeName?: string; // Optional employee name for joins
  users?: {
    // Optional nested user data
    name: string; // User's name from join
  };
};

// ! NOTE TYPE
// Represents a note or comment in the system
export type Note = {
  id: number; // Unique identifier
  user_id: string; // Reference to user
  date: string; // Note date
  content: string; // Note content
  is_manager_note: boolean; // Flag for manager notes
};

// ! GENERAL MESSAGE TYPE
// Represents system-wide messages or announcements
export type GeneralMessage = {
  id: number; // Unique identifier
  message: string; // Message content
};
