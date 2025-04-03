import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { TimeTrackingOverview } from "@/components/time-tracking/time-tracking-overview"
import { TimeEntries } from "@/components/time-tracking/time-entries"

export const metadata: Metadata = {
  title: "Time Tracking | WonderFlow",
  description: "Track and manage your time on projects and tasks",
}

export default function TimeTrackingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TimeTrackingHeader />
      <main className="flex-1 p-6 space-y-6">
        <TimeTrackingOverview />
        <TimeEntries />
      </main>
    </div>
  )
}

