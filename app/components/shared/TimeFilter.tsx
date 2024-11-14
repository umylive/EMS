"use client";

import { useState, useEffect } from "react";

type TimeFilterProps = {
  shifts: Array<{
    time_in: string;
    [key: string]: any;
  }>;
  onFilterChange: (filteredShifts: any[]) => void;
  originalShifts: any[];
};

export default function TimeFilter({
  shifts,
  onFilterChange,
  originalShifts,
}: TimeFilterProps) {
  const [selectedTime, setSelectedTime] = useState("all");

  // Get unique time_in values and sort them
  const uniqueTimes = [
    "all",
    ...new Set(shifts.map((shift) => shift.time_in)),
  ].sort();

  useEffect(() => {
    filterShifts();
  }, [selectedTime]);

  const filterShifts = () => {
    if (selectedTime === "all") {
      onFilterChange(originalShifts);
      return;
    }

    const filtered = originalShifts.filter((shift) => {
      return shift.time_in === selectedTime;
    });
    onFilterChange(filtered);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Filter by Time In
      </h3>
      <div>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Times</option>
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
