import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"

export default function TasksOverview() {
  const tasks = [
    {
      id: 1,
      title: "Design homepage mockup",
      project: "Website Redesign",
      priority: "High",
      status: "Completed",
    },
    {
      id: 2,
      title: "Implement user authentication",
      project: "Mobile App Development",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Create social media assets",
      project: "Marketing Campaign",
      priority: "Medium",
      status: "Todo",
    },
    {
      id: 4,
      title: "Prepare product demo",
      project: "Product Launch",
      priority: "High",
      status: "Todo",
    },
    {
      id: 5,
      title: "Write API documentation",
      project: "Mobile App Development",
      priority: "Low",
      status: "In Progress",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "Todo":
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <div className="flex items-center">
            <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
            <span className="text-xs text-red-500">High</span>
          </div>
        )
      case "Medium":
        return <span className="text-xs text-orange-500">Medium</span>
      case "Low":
        return <span className="text-xs text-blue-500">Low</span>
      default:
        return <span className="text-xs text-gray-500">Normal</span>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="mr-3 mt-0.5">{getStatusIcon(task.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1">{task.project}</div>
              </div>
              <div className="ml-3">{getPriorityBadge(task.priority)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

