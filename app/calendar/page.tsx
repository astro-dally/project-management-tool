import type { Metadata } from "next"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarView } from "@/components/calendar/calendar-view"

export const metadata: Metadata = {
  title: "Calendar | WonderFlow",
  description: "View your schedule and project deadlines",
}

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <CalendarHeader />
      <main className="flex-1 p-6">
        <CalendarView />
      </main>
    </div>
  )
}

