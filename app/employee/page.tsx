"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Shift, Note, GeneralMessage } from "@/lib/supabase";
import Header from "@/app/components/shared/Header";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [announcements, setAnnouncements] = useState<GeneralMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const calendarProps = {
    onChange: (value: any) => {
      if (value instanceof Date) {
        setSelectedDate(value);
      }
    },
    value: selectedDate,
    className: "shadow-sm rounded-lg p-4",
  } as const;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch shifts for the selected date
        const { data: shiftsData } = await supabase
          .from("shifts")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", format(selectedDate, "yyyy-MM-dd"));

        // Fetch all notes for the selected date (both personal and manager notes)
        const { data: notesData } = await supabase
          .from("notes")
          .select("*")
          .eq("date", format(selectedDate, "yyyy-MM-dd"))
          .or(`user_id.eq.${user.id},is_manager_note.eq.true`);

        // Fetch announcements
        const { data: announcementsData } = await supabase
          .from("general_messages")
          .select("*");

        if (shiftsData) setShifts(shiftsData);
        if (notesData) setNotes(notesData);
        if (announcementsData) setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, user]);

  const handleAddNote = async () => {
    if (!user || !newNote.trim()) return;

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.id,
            date: format(selectedDate, "yyyy-MM-dd"),
            content: newNote.trim(),
            is_manager_note: false,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding note:", error);
        return;
      }

      if (data) {
        setNotes((prevNotes) => [...prevNotes, ...data]);
        setNewNote("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Employee Dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar and Shifts Section */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                Schedule View
              </h2>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <style jsx global>{`
                    .react-calendar {
                      width: 100%;
                      max-width: 100%;
                      background: inherit;
                      border: none;
                      font-family: inherit;
                    }

                    .react-calendar__navigation {
                      display: flex;
                      justify-content: center;
                      margin-bottom: 1rem;
                    }

                    .react-calendar__navigation button {
                      min-width: 44px;
                      background: none;
                      font-size: 16px;
                      padding: 8px;
                      color: inherit;
                    }

                    .react-calendar__navigation button:disabled {
                      background-color: transparent;
                    }

                    .react-calendar__navigation button:enabled:hover,
                    .react-calendar__navigation button:enabled:focus {
                      background-color: rgb(239 246 255 / 0.2);
                      border-radius: 8px;
                    }

                    .react-calendar__month-view__weekdays {
                      text-align: center;
                      text-transform: uppercase;
                      font-weight: bold;
                      font-size: 0.75rem;
                      color: inherit;
                    }

                    .react-calendar__month-view__days__day {
                      padding: 8px;
                      color: inherit;
                    }

                    .react-calendar__tile {
                      text-align: center;
                      padding: 8px;
                      border-radius: 8px;
                    }

                    .react-calendar__tile:enabled:hover,
                    .react-calendar__tile:enabled:focus {
                      background-color: rgb(239 246 255 / 0.2);
                    }

                    .react-calendar__tile--now {
                      background: rgb(59 130 246 / 0.1);
                    }

                    .react-calendar__tile--active {
                      background: #2563eb !important;
                      color: white;
                    }

                    .react-calendar__tile--active:enabled:hover,
                    .react-calendar__tile--active:enabled:focus {
                      background: #1d4ed8 !important;
                    }

                    .dark .react-calendar {
                      color: #fff;
                    }

                    .dark .react-calendar__navigation button:enabled:hover,
                    .dark .react-calendar__navigation button:enabled:focus {
                      background-color: rgb(55 65 81 / 0.5);
                    }

                    .dark .react-calendar__tile:enabled:hover,
                    .dark .react-calendar__tile:enabled:focus {
                      background-color: rgb(55 65 81 / 0.5);
                    }

                    .dark .react-calendar__tile--now {
                      background: rgb(59 130 246 / 0.2);
                    }

                    .dark .react-calendar__month-view__days__day--weekend {
                      color: #f87171;
                    }

                    .dark
                      .react-calendar__month-view__days__day--neighboringMonth {
                      color: rgb(156 163 175);
                    }
                  `}</style>
                  <Calendar {...calendarProps} />
                </div>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                Selected Date: {format(selectedDate, "MMMM d, yyyy")}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Shifts for {format(selectedDate, "MMMM d, yyyy")}
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
                </div>
              ) : shifts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Time Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {shifts.map((shift) => (
                        <tr
                          key={shift.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {shift.time_in}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {shift.time_out}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            {shift.location}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                  No shifts scheduled for this date.
                </p>
              )}
            </div>
          </div>

          {/* Notes and Announcements Section */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notes
              </h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             placeholder-gray-400 dark:placeholder-gray-400
                             focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-primary-600 hover:bg-primary-700 text-white 
                             px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-4 rounded-md text-sm ${
                        note.is_manager_note
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>{note.content}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {note.is_manager_note
                            ? "(Manager Note)"
                            : "(Personal Note)"}
                        </div>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                      No notes for this date.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Announcements
              </h2>
              {announcements.length > 0 ? (
                <div className="space-y-2">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md"
                    >
                      <p className="text-sm text-yellow-800 dark:text-yellow-100">
                        {announcement.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                  No announcements at this time.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
