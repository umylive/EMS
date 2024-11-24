// ! USER INTERFACE
// Represents a user in the system
export interface User {
  id: string; // Unique identifier (employee ID)
  name: string; // User's full name
  role: "manager" | "employee"; // User's role with strict type
}

// ! SHIFT INTERFACE
// Represents a basic work shift record
export interface Shift {
  id: number; // Unique shift identifier
  user_id: string; // Reference to user ID
  date: string; // Shift date
  time_in: string; // Clock-in time
  time_out: string; // Clock-out time
  location: string; // Work location
  employeeName?: string; // Optional employee name for display
}

// ! SHIFT WITH USER INTERFACE
// Extends Shift interface to include user details
export interface ShiftWithUser extends Shift {
  users: {
    // Nested user information
    name: string; // User's name from join
  };
}

// ! NOTE INTERFACE
// Represents a note or comment in the system
export interface Note {
  id: number; // Unique note identifier
  user_id: string; // Reference to user ID
  content: string; // Note content
  date: string; // Note date
  is_manager_note: boolean; // Flag for manager notes
  users?: {
    // Optional user details
    name: string; // User's name from join
  };
}

// ! GENERAL MESSAGE INTERFACE
// Represents system-wide announcements
export interface GeneralMessage {
  id: number; // Unique message identifier
  message: string; // Message content
}

// ! SUPABASE RESPONSE INTERFACE
// Generic type for Supabase query responses
export interface SupabaseResponse<T> {
  data: T | null; // Response data of type T
  error: Error | null; // Error information if any
}

// ! TIME FILTER PROPS INTERFACE
// Props for TimeFilter component
export interface TimeFilterProps {
  shifts: Shift[]; // Array of shifts to filter
  onFilterChange: (filteredShifts: Shift[]) => void; // Filter change handler
  originalShifts: Shift[]; // Original unfiltered shifts
}

// ! LOCATION STATISTICS INTERFACE
// Represents location-based shift statistics
export interface LocationStat {
  location: string; // Location name
  count: number; // Number of shifts at location
  percentage: string; // Percentage of total shifts
}

// ! CALENDAR CHANGE HANDLER TYPE
// Type definition for calendar date change events
export type CalendarChangeHandler = (
  value: Date | null, // Selected date
  event: React.MouseEvent<HTMLButtonElement, MouseEvent> // Click event
) => void;

// ! TIME-RELATED INTERFACES
// Interface for time range selection
export interface TimeRange {
  startTime: string; // Range start time
  endTime: string; // Range end time
}

// ! FILTERED SHIFTS INTERFACE
// Holds different categories of filtered shifts
export interface FilteredShifts {
  timeFiltered: Shift[]; // Shifts filtered by time
  locationFiltered: Shift[]; // Shifts filtered by location
}
