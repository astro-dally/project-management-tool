import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function ProjectsOverview() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 75,
      status: "In Progress",
      dueDate: "Apr 15, 2025",
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 45,
      status: "In Progress",
      dueDate: "May 20, 2025",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      progress: 90,
      status: "Review",
      dueDate: "Apr 10, 2025",
    },
    {
      id: 4,
      name: "Product Launch",
      progress: 20,
      status: "Planning",
      dueDate: "Jun 30, 2025",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-orange-100 text-orange-800"
      case "Review":
        return "bg-purple-100 text-purple-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Projects Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{project.name}</div>
                <Badge className={getStatusColor(project.status)} variant="outline">
                  {project.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>Progress</div>
                <div>{project.progress}%</div>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="text-xs text-gray-500">Due: {project.dueDate}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

