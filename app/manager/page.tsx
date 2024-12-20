"use client";

// ! IMPORTS
import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type {
  User,
  Shift,
  Note,
  GeneralMessage,
  SupabaseResponse,
  LocationStat,
  ShiftWithUser,
} from "@/types";
import Header from "@/app/components/shared/Header";
import DataTable from "@/app/components/shared/DataTable";
import TimeFilter from "@/app/components/shared/TimeFilter";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

// ! CHART CONFIGURATION
// Color palette for location statistics
const CHART_COLORS = [
  "#0088FE", // Primary Blue
  "#00C49F", // Emerald Green
  "#FFBB28", // Warm Yellow
  "#FF8042", // Sunset Orange
  "#8884d8", // Soft Purple
  "#e91e63", // Deep Pink
  "#2ecc71", // Fresh Green
  "#3498db", // Sky Blue
  "#f1c40f", // Golden Yellow
  "#9b59b6", // Royal Purple
];

// ! TYPE DEFINITIONS
// Extended note type with user information
type EmployeeNote = {
  id: number;
  user_id: string;
  content: string;
  date: string;
  is_manager_note: boolean;
  users: {
    name: string;
  };
};

// ! MAIN COMPONENT
export default function ManagerDashboard() {
  // ! STATE MANAGEMENT
  // User and authentication
  const { user } = useAuth();

  // Date and employee management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // Shifts management
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredTimeShifts, setFilteredTimeShifts] = useState<Shift[]>([]);
  const [originalShifts, setOriginalShifts] = useState<Shift[]>([]);

  // Notes management
  const [notes, setNotes] = useState<EmployeeNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Location management
  const [selectedLocation, setSelectedLocation] = useState<string | "all">(
    "all"
  );
  const [locations, setLocations] = useState<string[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStat[]>([]);

  // Messages and UI state
  const [generalMessage, setGeneralMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);

  // ! CALENDAR CONFIGURATION
  const calendarProps = {
    onChange: (value: any) => {
      if (value instanceof Date) {
        setSelectedDate(value);
      }
    },
    value: selectedDate,
    className: "shadow-sm rounded-lg p-4",
  } as const;

  // ! TABLE CONFIGURATION
  const shiftsTableColumns = [
    { key: "user_id", label: "Employee ID" },
    { key: "employeeName", label: "Name" },
    { key: "location", label: "Location" },
    { key: "time_in", label: "Time In" },
    { key: "time_out", label: "Time Out" },
  ];
  // ! DATA FETCHING EFFECT
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // ! EMPLOYEE DATA FETCH
        const { data: employeesData } = await supabase
          .from("users")
          .select("*")
          .eq("role", "employee");

        // ! SHIFTS DATA FETCH
        // Fetch shifts with user information
        const { data: shiftsData, error: shiftsError } = (await supabase
          .from("shifts")
          .select(
            `
            id,
            user_id,
            date,
            time_in,
            time_out,
            location,
            users (
              name
            )
          `
          )
          .eq("date", format(selectedDate, "yyyy-MM-dd"))) as {
          data: ShiftWithUser[] | null;
          error: any;
        };

        if (shiftsError) {
          console.error("Error fetching shifts:", shiftsError);
          return;
        }

        // ! SHIFTS DATA FORMATTING
        const formattedShifts =
          shiftsData?.map((shift) => ({
            id: shift.id,
            user_id: shift.user_id,
            employeeName: shift.users?.name || "Unknown",
            date: shift.date,
            time_in: shift.time_in,
            time_out: shift.time_out,
            location: shift.location,
          })) || [];

        // ! LOCATION PROCESSING
        // Extract unique locations
        const uniqueLocations = Array.from(
          new Set(formattedShifts.map((shift) => shift.location))
        );

        // ! STATISTICS CALCULATION
        // Calculate per-location statistics
        const locationCounts = uniqueLocations.map((location) => {
          const count = formattedShifts.filter(
            (shift) => shift.location === location
          ).length;
          const percentage =
            formattedShifts.length > 0
              ? ((count / formattedShifts.length) * 100).toFixed(1) + "%"
              : "0%";
          return {
            location,
            count,
            percentage,
          };
        });

        // ! NOTES DATA FETCH
        const { data: notesData } = await supabase
          .from("notes")
          .select(
            `
            id,
            user_id,
            content,
            date,
            is_manager_note,
            users!inner (
              name
            )
          `
          )
          .eq("date", format(selectedDate, "yyyy-MM-dd"))
          .eq("is_manager_note", true);

        // ! GENERAL MESSAGE FETCH
        const { data: messageData } = await supabase
          .from("general_messages")
          .select("*")
          .single();

        // ! STATE UPDATES
        if (employeesData) setEmployees(employeesData);
        setShifts(formattedShifts);
        setOriginalShifts(formattedShifts);
        setFilteredTimeShifts(formattedShifts);
        setLocations(uniqueLocations);
        setLocationStats(locationCounts);

        if (notesData) {
          const typedNotes = notesData.map((note: any) => ({
            id: note.id,
            user_id: note.user_id,
            content: note.content,
            date: note.date,
            is_manager_note: note.is_manager_note,
            users: {
              name: note.users?.name || "Unknown",
            },
          }));
          setNotes(typedNotes);
        }

        if (messageData) setGeneralMessage(messageData.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // ! NOTE MANAGEMENT HANDLERS
  // Handle adding or updating notes
  const handleAddOrUpdateNote = async () => {
    if (!user || !selectedEmployeeId || !newNote.trim()) {
      alert("Please select an employee and enter a note");
      return;
    }

    try {
      if (editingNoteId) {
        // ! UPDATE EXISTING NOTE
        const { error } = await supabase
          .from("notes")
          .update({
            content: newNote.trim(),
          })
          .eq("id", editingNoteId);

        if (error) throw error;

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId
              ? { ...note, content: newNote.trim() }
              : note
          )
        );

        setEditingNoteId(null);
      } else {
        // ! CREATE NEW NOTE
        const { data: newNoteData, error } = await supabase
          .from("notes")
          .insert([
            {
              user_id: selectedEmployeeId,
              date: format(selectedDate, "yyyy-MM-dd"),
              content: newNote.trim(),
              is_manager_note: true,
            },
          ])
          .select(
            `
            id,
            user_id,
            content,
            date,
            is_manager_note,
            users!inner (
              name
            )
          `
          )
          .single();

        if (error) throw error;

        if (newNoteData) {
          const typedNote: EmployeeNote = {
            id: newNoteData.id,
            user_id: newNoteData.user_id,
            content: newNoteData.content,
            date: newNoteData.date,
            is_manager_note: newNoteData.is_manager_note,
            users: {
              name: (newNoteData as any).users?.name || "Unknown",
            },
          };

          setNotes((prevNotes) => [...prevNotes, typedNote]);
        }
      }

      // ! RESET FORM
      setNewNote("");
      setSelectedEmployeeId("");
    } catch (error) {
      console.error("Error adding/updating note:", error);
    }
  };

  // ! NOTE EDITING HANDLERS
  const handleEditNote = (note: EmployeeNote) => {
    setEditingNoteId(note.id);
    setNewNote(note.content);
    setSelectedEmployeeId(note.user_id);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setNewNote("");
    setSelectedEmployeeId("");
  };

  // ! GENERAL MESSAGE HANDLER
  const updateGeneralMessage = async () => {
    try {
      const { error } = await supabase
        .from("general_messages")
        .update({ message: generalMessage })
        .eq("id", 1);

      if (error) throw error;

      setShowMessageSuccess(true);
      setTimeout(() => setShowMessageSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  // ! SHIFTS FILTERING
  const filteredShifts = filteredTimeShifts.filter((shift) =>
    selectedLocation === "all" ? true : shift.location === selectedLocation
  );
  // ! MAIN RENDER
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ! HEADER */}
      <Header title="Manager Dashboard" />

      {/* ! MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ! LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-8">
            {/* ! CALENDAR SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                Schedule View
              </h2>
              <Calendar {...calendarProps} />
              <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                Selected Date: {format(selectedDate, "MMMM d, yyyy")}
              </div>
            </div>

            {/* ! LOCATION FILTER */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Filters
              </h2>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* ! TIME FILTER COMPONENT */}
            <TimeFilter
              shifts={shifts}
              onFilterChange={setFilteredTimeShifts}
              originalShifts={originalShifts}
            />

            {/* ! LOCATION STATISTICS */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Location Statistics
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employees
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {/* ! LOCATION ROWS */}
                    {locationStats.map(({ location, count }, index) => (
                      <tr
                        key={location}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{
                                backgroundColor:
                                  CHART_COLORS[index % CHART_COLORS.length],
                              }}
                            ></div>
                            <span className="text-sm text-gray-900 dark:text-gray-300">
                              {location}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                          {count}
                        </td>
                      </tr>
                    ))}
                    {/* ! TOTAL ROW */}
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Total
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                        {shifts.length}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ! GENERAL MESSAGE SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                General Message
              </h2>
              <div className="space-y-4">
                <textarea
                  value={generalMessage}
                  onChange={(e) => setGeneralMessage(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:border-primary-500 focus:ring-primary-500"
                  rows={3}
                  placeholder="Enter a message for all employees..."
                />
                <button
                  onClick={updateGeneralMessage}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 
                           rounded-md text-sm font-medium transition-colors"
                >
                  Update Message
                </button>
                {showMessageSuccess && (
                  <div className="text-green-600 dark:text-green-400 text-sm text-center">
                    Message updated successfully!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ! MAIN CONTENT AREA */}
          <div className="lg:col-span-2 space-y-8">
            {/* ! SHIFTS TABLE */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Employee Shifts - {format(selectedDate, "MMMM d, yyyy")}
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
                </div>
              ) : filteredShifts.length > 0 ? (
                <DataTable
                  columns={shiftsTableColumns}
                  data={filteredShifts}
                  rowsPerPage={10}
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                  No shifts scheduled for this date.
                </p>
              )}
            </div>

            {/* ! MANAGER NOTES SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Manager Notes
              </h2>
              <div className="space-y-4">
                {/* ! NOTE INPUT FORM */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Employee
                    </label>
                    <select
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                               focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select an employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} (ID: {emp.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ! NOTE INPUT */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {editingNoteId ? "Update Note" : "Add Note"}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder={
                          editingNoteId ? "Update note..." : "Add a note..."
                        }
                        className="flex-1 rounded-md border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                 focus:border-primary-500 focus:ring-primary-500"
                      />
                      <button
                        onClick={handleAddOrUpdateNote}
                        className="bg-primary-600 hover:bg-primary-700 text-white 
                                 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {editingNoteId ? "Update" : "Add"}
                      </button>
                      {editingNoteId && (
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white 
                                   px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ! NOTES LIST */}
                <div className="space-y-2 mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes for {format(selectedDate, "MMMM d, yyyy")}
                  </div>
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {note.users?.name} (ID: {note.user_id})
                          </div>
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {note.content}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-primary-600 hover:text-primary-700 
                                     dark:text-primary-400 dark:hover:text-primary-300
                                     text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                      No notes for this date.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
