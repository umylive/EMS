"use client";

// ! IMPORTS
// React hooks for state management and side effects
import { useState, useEffect } from "react";

// ! PROPS INTERFACE
// Defines the expected props for the TimeFilter component
type TimeFilterProps = {
  // Array of shift objects that must contain at least a time_in property
  shifts: Array<{
    time_in: string;
    [key: string]: any; // Allows for additional properties
  }>;
  // Callback function to handle filtered shifts
  onFilterChange: (filteredShifts: any[]) => void;
  // Original unfiltered shifts array
  originalShifts: any[];
};

// ! MAIN COMPONENT
// TimeFilter component for filtering shifts by time_in value
export default function TimeFilter({
  shifts,
  onFilterChange,
  originalShifts,
}: TimeFilterProps) {
  // ! STATE
  // Tracks the currently selected time filter
  const [selectedTime, setSelectedTime] = useState("all");

  // ! UNIQUE TIMES COMPUTATION
  // Creates array of unique time_in values, including 'all' option
  const uniqueTimes = [
    "all",
    ...new Set(shifts.map((shift) => shift.time_in)),
  ].sort();

  // ! FILTER EFFECT
  // Runs whenever selectedTime changes to update filtered results
  useEffect(() => {
    filterShifts();
  }, [selectedTime]);

  // ! FILTER FUNCTION
  // Filters shifts based on selected time and updates parent component
  const filterShifts = () => {
    // If 'all' is selected, return original unfiltered array
    if (selectedTime === "all") {
      onFilterChange(originalShifts);
      return;
    }

    // Filter shifts to only those matching selected time_in
    const filtered = originalShifts.filter((shift) => {
      return shift.time_in === selectedTime;
    });
    // Update parent component with filtered results
    onFilterChange(filtered);
  };

  // ! COMPONENT RENDER
  return (
    // ! MAIN CONTAINER
    // Card container with appropriate styling for light/dark modes
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* ! TITLE */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Filter by Time In
      </h3>

      {/* ! SELECT CONTAINER */}
      <div>
        {/* ! TIME SELECT DROPDOWN */}
        {/* Select input for choosing time filter */}
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:border-primary-500 focus:ring-primary-500"
        >
          {/* ! DEFAULT OPTION */}
          {/* Always show 'All Times' as first option */}
          <option value="all">All Times</option>

          {/* ! TIME OPTIONS */}
          {/* Map through unique times, excluding 'all' option */}
          {uniqueTimes
            .filter((time) => time !== "all")
            .map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
