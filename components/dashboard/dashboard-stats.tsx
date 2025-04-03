"use client"

import { ArrowUpRight, CheckCircle2, Clock, FileWarning, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2",
      icon: FileWarning,
      color: "text-blue-500",
    },
    {
      title: "Team Members",
      value: "24",
      change: "+3",
      icon: Users,
      color: "text-indigo-500",
    },
    {
      title: "Completed Tasks",
      value: "128",
      change: "+28",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Hours Logged",
      value: "284",
      change: "+12",
      icon: Clock,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stat.change}</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

