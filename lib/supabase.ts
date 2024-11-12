import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
    },
  }
);

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
