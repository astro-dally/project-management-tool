"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function MyTasks() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Design homepage wireframes",
      project: "Website Redesign",
      dueDate: "Today",
      priority: "High",
      status: "In Progress",
      completed: false,
    },
    {
      id: "2",
      title: "Create user personas",
      project: "Mobile App Development",
      dueDate: "Tomorrow",
      priority: "Medium",
      status: "Not Started",
      completed: false,
    },
    {
      id: "3",
      title: "Review content strategy",
      project: "Marketing Campaign",
      dueDate: "Aug 5",
      priority: "Low",
      status: "In Progress",
      completed: false,
    },
    {
      id: "4",
      title: "Finalize social media posts",
      project: "Marketing Campaign",
      dueDate: "Aug 3",
      priority: "Medium",
      status: "In Progress",
      completed: false,
    },
  ])

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: checked, status: checked ? "Completed" : "In Progress" } : task,
      ),
    )

    const taskTitle = tasks.find((task) => task.id === taskId)?.title

    toast({
      title: checked ? "Task completed" : "Task reopened",
      description: taskTitle,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "Not Started":
        return <Circle className="h-4 w-4 text-gray-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">My Tasks</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start space-x-3 rounded-lg border p-3 ${task.completed ? "bg-muted/50" : ""}`}
            >
              <Checkbox
                id={`task-${task.id}`}
                className="mt-0.5"
                checked={task.completed}
                onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium cursor-pointer hover:underline ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{task.project}</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    <span>Due {task.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

