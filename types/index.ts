export interface User {
  id: string;
  name: string;
  role: "manager" | "employee";
}

export interface Shift {
  id: number;
  user_id: string;
  date: string;
  time_in: string;
  time_out: string;
  location: string;
  employeeName?: string;
}

export interface Note {
  id: number;
  user_id: string;
  content: string;
  date: string;
  is_manager_note: boolean;
  users?: {
    name: string;
  };
}

export interface GeneralMessage {
  id: number;
  message: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export type CalendarChangeHandler = (
  value: Date | null,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;
