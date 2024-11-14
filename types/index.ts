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

export interface ShiftWithUser extends Shift {
  users: {
    name: string;
  };
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

export interface TimeFilterProps {
  shifts: Shift[];
  onFilterChange: (filteredShifts: Shift[]) => void;
  originalShifts: Shift[];
}

export interface LocationStat {
  location: string;
  count: number;
  percentage: string;
}

export type CalendarChangeHandler = (
  value: Date | null,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

// Time filter specific types
export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface FilteredShifts {
  timeFiltered: Shift[];
  locationFiltered: Shift[];
}
