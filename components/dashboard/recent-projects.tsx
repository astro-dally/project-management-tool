"use client"

import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function RecentProjects() {
  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      progress: 75,
      status: "In Progress",
      dueDate: "Aug 15, 2023",
      members: [
        { name: "Alex", image: "/placeholder.svg?height=32&width=32" },
        { name: "Beth", image: "/placeholder.svg?height=32&width=32" },
        { name: "Carl", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: "2",
      name: "Mobile App Development",
      progress: 45,
      status: "In Progress",
      dueDate: "Sep 20, 2023",
      members: [
        { name: "Dana", image: "/placeholder.svg?height=32&width=32" },
        { name: "Eric", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: "3",
      name: "Marketing Campaign",
      progress: 90,
      status: "Almost Done",
      dueDate: "Aug 5, 2023",
      members: [
        { name: "Fiona", image: "/placeholder.svg?height=32&width=32" },
        { name: "Greg", image: "/placeholder.svg?height=32&width=32" },
        { name: "Helen", image: "/placeholder.svg?height=32&width=32" },
        { name: "Ian", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Recent Projects</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                  {project.name}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.status}</span>
                <span>Due {project.dueDate}</span>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member, i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-background">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 3 && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{project.progress}% complete</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

