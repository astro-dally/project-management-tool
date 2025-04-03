import type { Metadata } from "next"
import { TasksHeader } from "@/components/tasks/tasks-header"
import { TasksBoard } from "@/components/tasks/tasks-board"

export const metadata: Metadata = {
  title: "Tasks | WonderFlow",
  description: "Manage and track all your tasks",
}

export default function TasksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TasksHeader />
      <main className="flex-1 p-6">
        <TasksBoard />
      </main>
    </div>
  )
}

