import type { Metadata } from "next"
import { TeamHeader } from "@/components/team/team-header"
import { TeamMembers } from "@/components/team/team-members"

export const metadata: Metadata = {
  title: "Team | WonderFlow",
  description: "Manage your team members and roles",
}

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TeamHeader />
      <main className="flex-1 p-6">
        <TeamMembers />
      </main>
    </div>
  )
}

