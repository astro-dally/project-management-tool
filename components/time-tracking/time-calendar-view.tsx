"use client"

import { useState } from "react"

// Mock data for time entries
const mockTimeEntries = [
  {
    id: 1,
    project: "Website Redesign",
    task: "Design",
    date: "2025-04-01",
    duration: "02:30",
    color: "bg-blue-500",
  },
  {
    id: 2,
    project: "Mobile App",
    task: "Development",
    date: "2025-04-01",
    duration: "04:15",
    color: "bg-purple-500",
  },
  {
    id: 3,
    project: "Marketing Campaign",
    task: "Research",
    date: "2025-04-02",
    duration: "01:45",
    color: "bg-green-500",
  },
  {
    id: 4,
    project: "Website Redesign",
    task: "Development",
    date: "2025-04-03",
    duration: "03:00",
    color: "bg-blue-500",
  },
  {
    id: 5,
    project: "Data Migration",
    task: "Testing",
    date: "2025-04-04",
    duration: "02:30",
    color: "bg-amber-500",
  },
  {
    id: 6,
    project: "Mobile App",
    task: "Meeting",
    date: "2025-04-05",
    duration: "01:00",
    color: "bg-purple-500",
  },
  {
    id: 7,
    project: "Internal",
    task: "Documentation",
    date: "2025-04-07",
    duration: "02:15",
    color: "bg-slate-500",
  },
  {
    id: 8,
    project: "Website Redesign",
    task: "Testing",
    date: "2025-04-08",
    duration: "03:30",
    color: "bg-blue-500",
  },
  {
    id: 9,
    project: "Marketing Campaign",
    task: "Design",
    date: "2025-04-10",
    duration: "04:00",
    color: "bg-green-500",
  },
  {
    id: 10,
    project: "Data Migration",
    task: "Development",
    date: "2025-04-12",
    duration: "05:15",
    color: "bg-amber-500",
  },
  {
    id: 11,
    project: "Mobile App",
    task: "Design",
    date: "2025-04-15",
    duration: "02:45",
    color: "bg-purple-500",
  },
  {
    id: 12,
    project: "Internal",
    task: "Meeting",
    date: "2025-04-17",
    duration: "01:30",
    color: "bg-slate-500",
  },
  {
    id: 13,
    project: "Website Redesign",
    task: "Development",
    date: "2025-04-18",
    duration: "03:45",
    color: "bg-blue-500",
  },
  {
    id: 14,
    project: "Marketing Campaign",
    task: "Testing",
    date: "2025-04-20",
    duration: "02:00",
    color: "bg-green-500",
  },
  {
    id: 15,
    project: "Data Migration",
    task: "Documentation",
    date: "2025-04-22",
    duration: "01:45",
    color: "bg-amber-500",
  },
]

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  entries: typeof mockTimeEntries
}

export function TimeCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

//

