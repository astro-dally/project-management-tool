import type { Metadata } from "next"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export const metadata: Metadata = {
  title: "Projects | WonderFlow",
  description: "Manage and track all your projects",
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ProjectsHeader />
      <main className="flex-1 p-6">
        <ProjectsGrid />
      </main>
    </div>
  )
}

