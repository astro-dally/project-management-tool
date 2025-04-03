import type { Metadata } from "next"
import { ProjectDetails } from "@/components/projects/project-details"

export const metadata: Metadata = {
  title: "Project Details | WonderFlow",
  description: "View and manage project details",
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ProjectDetails id={params.id} />
    </div>
  )
}

