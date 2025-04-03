"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function CalendarView() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([])

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Create array of day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Sample events data
  const events = [
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(currentYear, currentMonth, 5),
      project: "Website Redesign",
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Client Presentation",
      date: new Date(currentYear, currentMonth, 12),
      project: "Marketing Campaign",
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Project Deadline",
      date: new Date(currentYear, currentMonth, 15),
      project: "Mobile App Development",
      color: "bg-red-500",
    },
    {
      id: "4",
      title: "Design Review",
      date: new Date(currentYear, currentMonth, 18),
      project: "Website Redesign",
      color: "bg-blue-500",
    },
    {
      id: "5",
      title: "Sprint Planning",
      date: new Date(currentYear, currentMonth, 22),
      project: "Mobile App Development",
      color: "bg-purple-500",
    },
  ]

  // Function to get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear,
    )
  }

  // Function to build calendar days
  const buildCalendarDays = () => {
    const days: (number | null)[] = []

    // Get first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Get number of days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    setCalendarDays(days)
  }

  // Update calendar when current date changes
  useEffect(() => {
    buildCalendarDays()
  }, [currentDate])

  const handleEventClick = (event: { id: string; title: string; project: string }) => {
    toast({
      title: event.title,
      description: `Project: ${event.project}`,
    })
  }

  return (
    <Card className="p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {/* Day names */}
        {dayNames.map((day) => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] border rounded-md p-2 ${day === null ? "bg-muted/50" : ""} ${
              day === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear()
                ? "bg-primary/10 border-primary"
                : ""
            }`}
          >
            {day !== null && (
              <>
                <div className="text-sm font-medium">{day}</div>
                <div className="mt-1 space-y-1">
                  {getEventsForDay(day).map((event) => (
                    <div
                      key={event.id}
                      className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-90`}
                      title={`${event.title} - ${event.project}`}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

