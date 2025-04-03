"use client"

import type React from "react"

import { useState } from "react"
import { Clock, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  dueDate: string
  project: string
  assignee: {
    name: string
    avatar: string
    initials: string
  }
}

export function TasksBoard() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design homepage wireframes",
      description: "Create wireframes for the new homepage design",
      status: "todo",
      priority: "high",
      dueDate: "2023-08-10",
      project: "Website Redesign",
      assignee: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
    },
    {
      id: "2",
      title: "Create user personas",
      description: "Develop detailed user personas for the target audience",
      status: "todo",
      priority: "medium",
      dueDate: "2023-08-15",
      project: "Mobile App Development",
      assignee: {
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "BS",
      },
    },
    {
      id: "3",
      title: "Implement authentication",
      description: "Set up user authentication and authorization",
      status: "in-progress",
      priority: "high",
      dueDate: "2023-08-12",
      project: "Mobile App Development",
      assignee: {
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "CD",
      },
    },
    {
      id: "4",
      title: "Design social media graphics",
      description: "Create graphics for social media campaign",
      status: "in-progress",
      priority: "medium",
      dueDate: "2023-08-08",
      project: "Marketing Campaign",
      assignee: {
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DW",
      },
    },
    {
      id: "5",
      title: "Review content strategy",
      description: "Review and finalize content strategy document",
      status: "review",
      priority: "low",
      dueDate: "2023-08-05",
      project: "Marketing Campaign",
      assignee: {
        name: "Eric Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EB",
      },
    },
    {
      id: "6",
      title: "Finalize logo design",
      description: "Review and approve final logo design",
      status: "review",
      priority: "medium",
      dueDate: "2023-08-07",
      project: "Website Redesign",
      assignee: {
        name: "Fiona Green",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "FG",
      },
    },
    {
      id: "7",
      title: "Set up analytics",
      description: "Implement analytics tracking for the website",
      status: "done",
      priority: "medium",
      dueDate: "2023-08-03",
      project: "Website Redesign",
      assignee: {
        name: "Greg Hall",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "GH",
      },
    },
    {
      id: "8",
      title: "Create email templates",
      description: "Design and code email templates for campaign",
      status: "done",
      priority: "high",
      dueDate: "2023-08-02",
      project: "Marketing Campaign",
      assignee: {
        name: "Helen Irwin",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "HI",
      },
    },
  ])

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")

    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: columnId as "todo" | "in-progress" | "review" | "done" } : task,
      ),
    )

    toast({
      title: "Task updated",
      description: "Task status has been updated successfully",
    })
  }

  // Handle move task from dropdown
  const handleMoveTask = (taskId: string, newStatus: "todo" | "in-progress" | "review" | "done") => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

    toast({
      title: "Task moved",
      description: `Task moved to ${newStatus.replace("-", " ")}`,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {column.title}
                <Badge variant="outline" className="ml-2">
                  {tasks.filter((task) => task.status === column.id).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2 pt-0">
              <div className="space-y-2 min-h-[200px]">
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="rounded-md border bg-card p-3 shadow-sm cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{task.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveTask(task.id, "todo")}>
                              Move to To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveTask(task.id, "in-progress")}>
                              Move to In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveTask(task.id, "review")}>
                              Move to Review
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveTask(task.id, "done")}>
                              Move to Done
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{task.project}</span>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                          <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

