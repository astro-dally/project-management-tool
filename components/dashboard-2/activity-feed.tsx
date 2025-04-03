import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, MessageSquare, FileText, Clock } from "lucide-react"

export default function ActivityFeed() {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      action: "completed a task",
      target: "Design homepage mockup",
      project: "Website Redesign",
      time: "10 minutes ago",
      icon: CheckCircle2,
      iconColor: "text-green-500",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JS",
      },
      action: "commented on",
      target: "User authentication flow",
      project: "Mobile App Development",
      time: "25 minutes ago",
      icon: MessageSquare,
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      action: "uploaded",
      target: "Marketing assets",
      project: "Marketing Campaign",
      time: "1 hour ago",
      icon: FileText,
      iconColor: "text-purple-500",
    },
    {
      id: 4,
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SW",
      },
      action: "logged time on",
      target: "API development",
      project: "Mobile App Development",
      time: "2 hours ago",
      icon: Clock,
      iconColor: "text-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-gray-500 mx-1">{activity.action}</span>
                  <span className="font-medium">{activity.target}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{activity.project}</div>
                <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
              </div>
              <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

