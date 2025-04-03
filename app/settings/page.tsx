import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { SettingsContent } from "@/components/settings/settings-content"

export const metadata: Metadata = {
  title: "Settings | WonderFlow",
  description: "Manage your account and application settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SettingsHeader />
      <main className="flex-1 p-6">
        <SettingsContent />
      </main>
    </div>
  )
}

