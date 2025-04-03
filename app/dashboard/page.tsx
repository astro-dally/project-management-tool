import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { MyTasks } from "@/components/dashboard/my-tasks"
import { TeamActivity } from "@/components/dashboard/team-activity"

export const metadata: Metadata = {
  title: "Dashboard | WonderFlow",
  description: "Overview of your projects, tasks, and team activity",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <DashboardHeader />
      <main className="flex-1 p-6 space-y-6">
        <DashboardStats />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentProjects />
          <MyTasks />
        </div>
        <TeamActivity />
      </main>
    </div>
  )
}

