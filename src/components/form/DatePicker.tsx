import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../../icons";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  name?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  // Get today's date
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get the first day of the month and number of days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Handle date selection
  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateString = `${year}-${month}-${dayStr}`;
    onChange(dateString);
    setIsOpen(false);
  };

  // Handle month/year navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), parseInt(e.target.value))
    );
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(
      new Date(parseInt(e.target.value), currentMonth.getMonth())
    );
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const daysArray = Array(firstDayOfMonth).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Year range for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  const isToday = (day: number) => {
    return (
      day !== null &&
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!day || !value) return false;
    const [year, month, dateStr] = value.split("-");
    return (
      day === parseInt(dateStr) &&
      currentMonth.getMonth() === parseInt(month) - 1 &&
      currentMonth.getFullYear() === parseInt(year)
    );
  };

  return (
    <div ref={pickerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value ? formatDisplayDate(value) : ""}
          onChange={() => {}} // Read-only
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          readOnly
        />
        <ChevronDownIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
          {/* Header with Month/Year Selectors */}
          <div className="space-y-3 border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handlePreviousMonth}
                className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                ←
              </button>
              <div className="flex-1 text-center font-semibold text-gray-900 dark:text-white">
                {currentMonth.toLocaleString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={handleNextMonth}
                className="px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                →
              </button>
            </div>

            {/* Month and Year Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={currentMonth.getMonth()}
                onChange={handleMonthChange}
                className="px-2 py-1 rounded-lg border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleString("en-IN", {
                      month: "short",
                    })}
                  </option>
                ))}
              </select>
              <select
                value={currentMonth.getFullYear()}
                onChange={handleYearChange}
                className="px-2 py-1 rounded-lg border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {daysArray.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && handleDateClick(day)}
                  disabled={!day}
                  className={`h-8 rounded-lg text-sm font-medium transition-colors ${
                    !day
                      ? "cursor-default"
                      : isToday(day)
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : isSelected(day)
                          ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Today Button */}
          <div className="border-t border-gray-200 p-3 dark:border-gray-700">
            <button
              onClick={() => {
                setCurrentMonth(today);
                handleDateClick(today.getDate());
              }}
              className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-gray-900 dark:text-white"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
