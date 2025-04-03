"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TeamActivity() {
  const activities = [
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      action: "completed task",
      target: "Design homepage wireframes",
      project: "Website Redesign",
      time: "2 hours ago",
    },
    {
      id: "2",
      user: {
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "BS",
      },
      action: "commented on",
      target: "User Flow Diagram",
      project: "Mobile App Development",
      time: "3 hours ago",
    },
    {
      id: "3",
      user: {
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CD",
      },
      action: "created task",
      target: "Implement authentication",
      project: "Mobile App Development",
      time: "5 hours ago",
    },
    {
      id: "4",
      user: {
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DW",
      },
      action: "uploaded file",
      target: "Brand Guidelines.pdf",
      project: "Marketing Campaign",
      time: "Yesterday",
    },
    {
      id: "5",
      user: {
        name: "Eric Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EB",
      },
      action: "assigned task to",
      target: "Fiona Green",
      project: "Website Redesign",
      time: "Yesterday",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Team Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 rounded-lg border p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>{" "}
                  <span className="text-muted-foreground">in</span>{" "}
                  <span className="font-medium">{activity.project}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

