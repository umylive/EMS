import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create Supabase client with better error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: "public",
  },
});

// Type definitions with better TypeScript support
export interface User {
  id: number;
  user_id: string;
  name: string;
  role: "manager" | "employee";
  password: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Shift {
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
  created_at?: string;
  updated_at?: string;
}

export interface Note {
  id: number;
  user_id: string;
  date: string;
  content: string;
  is_manager_note: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GeneralMessage {
  id: number;
  message: string;
  created_at?: string;
  updated_at?: string;
}

// Type guard functions for runtime type checking
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.user_id === "string" &&
    typeof obj.name === "string" &&
    (obj.role === "manager" || obj.role === "employee")
  );
}

export function isShift(obj: any): obj is Shift {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.user_id === "string" &&
    typeof obj.date === "string" &&
    typeof obj.time_in === "string" &&
    typeof obj.time_out === "string" &&
    typeof obj.location === "string"
  );
}

export function isNote(obj: any): obj is Note {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.user_id === "string" &&
    typeof obj.date === "string" &&
    typeof obj.content === "string" &&
    typeof obj.is_manager_note === "boolean"
  );
}

export function isGeneralMessage(obj: any): obj is GeneralMessage {
  return obj && typeof obj.id === "number" && typeof obj.message === "string";
}

// Utility function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

// Database interface for type safety
interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id">>;
      };
      shifts: {
        Row: Shift;
        Insert: Omit<Shift, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Shift, "id">>;
      };
      notes: {
        Row: Note;
        Insert: Omit<Note, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Note, "id">>;
      };
      general_messages: {
        Row: GeneralMessage;
        Insert: Omit<GeneralMessage, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<GeneralMessage, "id">>;
      };
    };
  };
}

// Export type helpers
export type Tables = Database["public"]["Tables"];
export type InsertUser = Tables["users"]["Insert"];
export type InsertShift = Tables["shifts"]["Insert"];
export type InsertNote = Tables["notes"]["Insert"];
export type InsertGeneralMessage = Tables["general_messages"]["Insert"];
