import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing environment variables for Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type User = {
  id: number;
  user_id: string;
  name: string;
  role: "manager" | "employee";
  password: string | null;
};

export type Shift = {
  id: number;
  user_id: string;
  date: string;
  time_in: string;
  time_out: string;
  location: string;
  employeeName?: string;
  users?: {
    name: string;
  };
};

export type Note = {
  id: number;
  user_id: string;
  date: string;
  content: string;
  is_manager_note: boolean;
};

export type GeneralMessage = {
  id: number;
  message: string;
};
