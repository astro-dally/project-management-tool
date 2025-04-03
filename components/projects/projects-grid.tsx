"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Star, StarOff } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProjectsGrid() {
  const { toast } = useToast()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectStatus, setProjectStatus] = useState("planning")
  const [projectDueDate, setProjectDueDate] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "dueDate" | "progress">("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Website Redesign",
      description: "Redesign the company website with a modern look and feel",
      progress: 75,
      status: "In Progress",
      dueDate: "Aug 15, 2023",
      isStarred: true,
      members: [
        { name: "Alex", image: "/placeholder.svg?height=32&width=32" },
        { name: "Beth", image: "/placeholder.svg?height=32&width=32" },
        { name: "Carl", image: "/placeholder.svg?height=32&width=32" },
      ],
      tasks: { total: 24, completed: 18 },
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Develop a mobile app for iOS and Android platforms",
      progress: 45,
      status: "In Progress",
      dueDate: "Sep 20, 2023",
      isStarred: false,
      members: [
        { name: "Dana", image: "/placeholder.svg?height=32&width=32" },
        { name: "Eric", image: "/placeholder.svg?height=32&width=32" },
      ],
      tasks: { total: 36, completed: 16 },
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Plan and execute a marketing campaign for Q3",
      progress: 90,
      status: "Almost Done",
      dueDate: "Aug 5, 2023",
      isStarred: true,
      members: [
        { name: "Fiona", image: "/placeholder.svg?height=32&width=32" },
        { name: "Greg", image: "/placeholder.svg?height=32&width=32" },
        { name: "Helen", image: "/placeholder.svg?height=32&width=32" },
        { name: "Ian", image: "/placeholder.svg?height=32&width=32" },
      ],
      tasks: { total: 18, completed: 16 },
    },
    {
      id: "4",
      name: "Product Launch",
      description: "Prepare for the launch of our new product line",
      progress: 30,
      status: "In Progress",
      dueDate: "Oct 10, 2023",
      isStarred: false,
      members: [
        { name: "Jane", image: "/placeholder.svg?height=32&width=32" },
        { name: "Kevin", image: "/placeholder.svg?height=32&width=32" },
      ],
      tasks: { total: 42, completed: 12 },
    },
    {
      id: "5",
      name: "Customer Research",
      description: "Conduct research to understand customer needs",
      progress: 60,
      status: "In Progress",
      dueDate: "Aug 30, 2023",
      isStarred: false,
      members: [
        { name: "Lisa", image: "/placeholder.svg?height=32&width=32" },
        { name: "Mike", image: "/placeholder.svg?height=32&width=32" },
        { name: "Nancy", image: "/placeholder.svg?height=32&width=32" },
      ],
      tasks: { total: 15, completed: 9 },
    },
    {
      id: "6",
      name: "Brand Refresh",
      description: "Update brand guidelines and assets",
      progress: 10,
      status: "Just Started",
      dueDate: "Nov 15, 2023",
      isStarred: false,
      members: [
        { name: "Oscar", image: "/placeholder.svg?height=32&width=32" },
        { name: "Patty", image: "/placeholder.svg?height=32&width=32" },
      ],
      tasks: { total: 20, completed: 2 },
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "In Progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Almost Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Just Started":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const handleCreateProject = () => {
    // Validate form
    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    if (!projectDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    // Create new project
    const newProject = {
      id: (projects.length + 1).toString(),
      name: projectName,
      description: projectDescription,
      progress: 0,
      status: projectStatus === "planning" ? "Just Started" : "In Progress",
      dueDate: new Date(projectDueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isStarred: false,
      members: [{ name: "You", image: "/placeholder.svg?height=32&width=32" }],
      tasks: { total: 0, completed: 0 },
    }

    setProjects([...projects, newProject])

    toast({
      title: "Success",
      description: "Project created successfully",
    })

    // Reset form and close dialog
    setProjectName("")
    setProjectDescription("")
    setProjectStatus("planning")
    setProjectDueDate("")
    setOpen(false)
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId))

    toast({
      title: "Project deleted",
      description: "The project has been deleted successfully",
    })
  }

  const handleToggleStarProject = (projectId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setProjects(
      projects.map((project) => (project.id === projectId ? { ...project, isStarred: !project.isStarred } : project)),
    )

    const project = projects.find((p) => p.id === projectId)
    toast({
      title: project?.isStarred ? "Project unstarred" : "Project starred",
      description: project?.isStarred ? "Project removed from favorites" : "Project added to favorites",
    })
  }

  // Filter and sort projects
  const filteredProjects = projects.filter((project) => {
    // Filter by search query
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by status
    if (filterStatus && project.status !== filterStatus) {
      return false
    }

    return true
  })

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "dueDate") {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    } else if (sortBy === "progress") {
      return sortOrder === "asc" ? a.progress - b.progress : b.progress - a.progress
    }
    return 0
  })

  // Group projects by starred status
  const starredProjects = sortedProjects.filter((project) => project.isStarred)
  const unstarredProjects = sortedProjects.filter((project) => !project.isStarred)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Search projects..."
            className="w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="flex h-10 w-full md:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
          >
            <option value="">All Statuses</option>
            <option value="Just Started">Just Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Almost Done">Almost Done</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-2">
            <select
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-")
                setSortBy(newSortBy as any)
                setSortOrder(newSortOrder as any)
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="progress-asc">Progress (Low-High)</option>
              <option value="progress-desc">Progress (High-Low)</option>
            </select>

            <div className="flex gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                className="h-10"
                onClick={() => setView("grid")}
              >
                Grid
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                className="h-10"
                onClick={() => setView("list")}
              >
                List
              </Button>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Fill in the details to create a new project.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter project name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Enter project description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="project-status">Status</Label>
                        <select
                          id="project-status"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={projectStatus}
                          onChange={(e) => setProjectStatus(e.target.value)}
                        >
                          <option value="planning">Planning</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="project-due-date">Due Date</Label>
                        <Input
                          id="project-due-date"
                          type="date"
                          value={projectDueDate}
                          onChange={(e) => setProjectDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Project Template</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer hover:border-primary">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Blank Project</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer hover:border-primary">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Marketing</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer hover:border-primary">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Development</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer hover:border-primary">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Design</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Privacy</Label>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="public" name="privacy" className="h-4 w-4" defaultChecked />
                        <Label htmlFor="public" className="text-sm font-normal">
                          Public - All team members can access
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="private" name="privacy" className="h-4 w-4" />
                        <Label htmlFor="private" className="text-sm font-normal">
                          Private - Only invited members can access
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* New Project Card */}
          <Card className="flex flex-col items-center justify-center border-dashed p-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Create New Project</h3>
                <p className="text-sm text-muted-foreground">Start a new project from scratch</p>
              </div>
              <Button onClick={() => setOpen(true)}>Create Project</Button>
            </div>
          </Card>

          {/* Starred Projects */}
          {starredProjects.length > 0 && (
            <>
              {starredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                        </Link>
                        <Badge variant="outline" className={`mt-2 ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleToggleStarProject(project.id, e)}
                        >
                          {project.isStarred ? (
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ) : (
                            <StarOff className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
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
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 mt-1" />
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="border-t px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {project.tasks.completed} / {project.tasks.total} tasks
                        </div>
                        <div className="text-sm text-muted-foreground">Due {project.dueDate}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between">
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}

          {/* Unstarred Projects */}
          {unstarredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                    </Link>
                    <Badge variant="outline" className={`mt-2 ${getStatusColor(project.status)}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleToggleStarProject(project.id, e)}
                    >
                      {project.isStarred ? (
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
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
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProject(project.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2 mt-1" />
                </div>
              </div>
              <CardContent className="p-0">
                <div className="border-t px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {project.tasks.completed} / {project.tasks.total} tasks
                    </div>
                    <div className="text-sm text-muted-foreground">Due {project.dueDate}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex w-full items-center justify-between">
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>View</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Project</th>
                  <th className="text-left p-4 hidden md:table-cell">Status</th>
                  <th className="text-left p-4 hidden md:table-cell">Progress</th>
                  <th className="text-left p-4 hidden md:table-cell">Due Date</th>
                  <th className="text-left p-4 hidden md:table-cell">Team</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleToggleStarProject(project.id, e)}
                        >
                          {project.isStarred ? (
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <div>
                          <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                            {project.name}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">{project.dueDate}</td>
                    <td className="p-4 hidden md:table-cell">
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
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/${project.id}`}>View</Link>
                        </Button>
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
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

