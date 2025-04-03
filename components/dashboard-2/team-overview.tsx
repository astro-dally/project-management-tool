import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TeamOverview() {
  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
      status: "online",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
      status: "online",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
      status: "offline",
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
      status: "away",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-300"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                    member.status,
                  )}`}
                />
              </div>
              <div className="ml-3">
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-gray-500">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

