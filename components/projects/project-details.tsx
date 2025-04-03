"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Share2,
  Trash,
  MessageSquare,
  Star,
  StarOff,
  Send,
  ChevronDown,
  Play,
  Pause,
  AlertTriangle,
  Award,
  Zap,
  Smile,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

type ProjectMember = {
  id: string
  name: string
  role: string
  avatar: string
  initials: string
}

type ProjectTask = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  dueDate: string
  priority: "low" | "medium" | "high"
  timeTracked: number // in seconds
  isTracking: boolean
  comments: ProjectComment[]
  checklist: { id: string; text: string; completed: boolean }[]
}

type ProjectFile = {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
}

type ProjectComment = {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  text: string
  timestamp: string
  reactions: { emoji: string; count: number }[]
}

type ProjectRisk = {
  id: string
  title: string
  impact: "low" | "medium" | "high"
  probability: "low" | "medium" | "high"
  status: "mitigated" | "active" | "accepted"
  owner: string
}

type ProjectMilestone = {
  id: string
  title: string
  dueDate: string
  completed: boolean
  description: string
}

type Project = {
  id: string
  name: string
  description: string
  status: string
  progress: number
  startDate: string
  dueDate: string
  isStarred: boolean
  members: ProjectMember[]
  tasks: {
    total: number
    completed: number
    items: ProjectTask[]
  }
  files: ProjectFile[]
  risks: ProjectRisk[]
  milestones: ProjectMilestone[]
  comments: ProjectComment[]
  analytics: {
    taskCompletionRate: number
    onTimeCompletion: number
    teamActivity: { date: string; count: number }[]
    tasksByStatus: { status: string; count: number }[]
    tasksByPriority: { priority: string; count: number }[]
  }
}

export function ProjectDetails({ id }: { id: string }) {
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [openMemberDialog, setOpenMemberDialog] = useState(false)
  const [openRiskDialog, setOpenRiskDialog] = useState(false)
  const [openMilestoneDialog, setOpenMilestoneDialog] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskAssignee, setTaskAssignee] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")
  const [taskPriority, setTaskPriority] = useState("medium")
  const [memberEmail, setMemberEmail] = useState("")
  const [memberRole, setMemberRole] = useState("member")
  const [riskTitle, setRiskTitle] = useState("")
  const [riskImpact, setRiskImpact] = useState<"low" | "medium" | "high">("medium")
  const [riskProbability, setRiskProbability] = useState<"low" | "medium" | "high">("medium")
  const [riskOwner, setRiskOwner] = useState("")
  const [milestoneTitle, setMilestoneTitle] = useState("")
  const [milestoneDueDate, setMilestoneDueDate] = useState("")
  const [milestoneDescription, setMilestoneDescription] = useState("")
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null)
  const [commentText, setCommentText] = useState("")
  const [projectComment, setProjectComment] = useState("")
  const [checklistItem, setChecklistItem] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate fetching project data
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      // In a real app, this would be an API call
      setTimeout(() => {
        setProject({
          id,
          name:
            id === "1"
              ? "Website Redesign"
              : id === "2"
                ? "Mobile App Development"
                : id === "3"
                  ? "Marketing Campaign"
                  : id === "4"
                    ? "Product Launch"
                    : id === "5"
                      ? "Customer Research"
                      : "Brand Refresh",
          description:
            "This project aims to redesign the company website with a modern look and feel, improving user experience and conversion rates. The new design will be responsive and optimized for all devices.",
          status: id === "3" ? "Almost Done" : id === "6" ? "Just Started" : "In Progress",
          progress: id === "1" ? 75 : id === "2" ? 45 : id === "3" ? 90 : id === "4" ? 30 : id === "5" ? 60 : 10,
          startDate: "2023-07-01",
          dueDate:
            id === "1"
              ? "2023-08-15"
              : id === "2"
                ? "2023-09-20"
                : id === "3"
                  ? "2023-08-05"
                  : id === "4"
                    ? "2023-10-10"
                    : id === "5"
                      ? "2023-08-30"
                      : "2023-11-15",
          isStarred: id === "1" || id === "3",
          members: [
            {
              id: "1",
              name: "Alex Johnson",
              role: "Project Manager",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "AJ",
            },
            {
              id: "2",
              name: "Beth Smith",
              role: "Designer",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "BS",
            },
            {
              id: "3",
              name: "Carl Davis",
              role: "Developer",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "CD",
            },
            {
              id: "4",
              name: "Dana Wilson",
              role: "Content Writer",
              avatar: "/placeholder.svg?height=40&width=40",
              initials: "DW",
            },
          ],
          tasks: {
            total: 24,
            completed: 18,
            items: [
              {
                id: "1",
                title: "Design homepage wireframes",
                description: "Create wireframes for the new homepage design based on the approved mockups.",
                status: "done",
                assignee: {
                  name: "Beth Smith",
                  avatar: "/placeholder.svg?height=32&width=32",
                  initials: "BS",
                },
                dueDate: "2023-07-15",
                priority: "high",
                timeTracked: 14400, // 4 hours
                isTracking: false,
                comments: [
                  {
                    id: "1",
                    user: {
                      name: "Alex Johnson",
                      avatar: "/placeholder.svg?height=32&width=32",
                      initials: "AJ",
                    },
                    text: "These look great! Can you add a mobile version as well?",
                    timestamp: "2023-07-14T10:30:00Z",
                    reactions: [
                      { emoji: "👍", count: 2 },
                      { emoji: "🎉", count: 1 },
                    ],
                  },
                  {
                    id: "2",
                    user: {
                      name: "Beth Smith",
                      avatar: "/placeholder.svg?height=32&width=32",
                      initials: "BS",
                    },
                    text: "Yes, I'll have those ready by tomorrow.",
                    timestamp: "2023-07-14T11:15:00Z",
                    reactions: [],
                  },
                ],
                checklist: [
                  { id: "1", text: "Create desktop wireframes", completed: true },
                  { id: "2", text: "Create mobile wireframes", completed: true },
                  { id: "3", text: "Get feedback from team", completed: true },
                ],
              },
              {
                id: "2",
                title: "Create user personas",
                description: "Develop detailed user personas for the target audience based on research data.",
                status: "done",
                assignee: {
                  name: "Dana Wilson",
                  avatar: "/placeholder.svg?height=32&width=32",
                  initials: "DW",
                },
                dueDate: "2023-07-20",
                priority: "medium",
                timeTracked: 18000, // 5 hours
                isTracking: false,
                comments: [],
                checklist: [
                  { id: "1", text: "Analyze user research data", completed: true },
                  { id: "2", text: "Draft initial personas", completed: true },
                  { id: "3", text: "Review with stakeholders", completed: true },
                ],
              },
              {
                id: "3",
                title: "Implement authentication",
                description: "Set up user authentication and authorization using OAuth and JWT.",
                status: "in-progress",
                assignee: {
                  name: "Carl Davis",
                  avatar: "/placeholder.svg?height=32&width=32",
                  initials: "CD",
                },
                dueDate: "2023-08-05",
                priority: "high",
                timeTracked: 10800, // 3 hours
                isTracking: false,
                comments: [
                  {
                    id: "1",
                    user: {
                      name: "Carl Davis",
                      avatar: "/placeholder.svg?height=32&width=32",
                      initials: "CD",
                    },
                    text: "I'm running into some issues with the OAuth integration. Might need an extra day.",
                    timestamp: "2023-08-01T15:45:00Z",
                    reactions: [],
                  },
                ],
                checklist: [
                  { id: "1", text: "Set up OAuth provider", completed: true },
                  { id: "2", text: "Implement JWT handling", completed: false },
                  { id: "3", text: "Create user roles and permissions", completed: false },
                  { id: "4", text: "Write tests", completed: false },
                ],
              },
              {
                id: "4",
                title: "Design responsive layouts",
                description: "Create responsive layouts for all pages to ensure compatibility across devices.",
                status: "in-progress",
                assignee: {
                  name: "Beth Smith",
                  avatar: "/placeholder.svg?height=32&width=32",
                  initials: "BS",
                },
                dueDate: "2023-08-10",
                priority: "medium",
                timeTracked: 7200, // 2 hours
                isTracking: false,
                comments: [],
                checklist: [
                  { id: "1", text: "Design desktop layouts", completed: true },
                  { id: "2", text: "Design tablet layouts", completed: true },
                  { id: "3", text: "Design mobile layouts", completed: false },
                ],
              },
              {
                id: "5",
                title: "SEO optimization",
                description: "Optimize the website for search engines to improve visibility and ranking.",
                status: "todo",
                assignee: {
                  name: "Alex Johnson",
                  avatar: "/placeholder.svg?height=32&width=32",
                  initials: "AJ",
                },
                dueDate: "2023-08-12",
                priority: "low",
                timeTracked: 0,
                isTracking: false,
                comments: [],
                checklist: [
                  { id: "1", text: "Keyword research", completed: false },
                  { id: "2", text: "Meta tags optimization", completed: false },
                  { id: "3", text: "Content optimization", completed: false },
                ],
              },
            ],
          },
          files: [
            {
              id: "1",
              name: "Website_Mockups.fig",
              type: "Figma",
              size: "15.2 MB",
              uploadedBy: "Beth Smith",
              uploadedAt: "2023-07-10",
            },
            {
              id: "2",
              name: "Content_Strategy.docx",
              type: "Document",
              size: "2.4 MB",
              uploadedBy: "Dana Wilson",
              uploadedAt: "2023-07-12",
            },
            {
              id: "3",
              name: "Technical_Requirements.pdf",
              type: "PDF",
              size: "3.8 MB",
              uploadedBy: "Alex Johnson",
              uploadedAt: "2023-07-05",
            },
            {
              id: "4",
              name: "Brand_Guidelines.pdf",
              type: "PDF",
              size: "5.1 MB",
              uploadedBy: "Alex Johnson",
              uploadedAt: "2023-07-02",
            },
          ],
          risks: [
            {
              id: "1",
              title: "Delayed API integration from third-party service",
              impact: "high",
              probability: "medium",
              status: "active",
              owner: "Carl Davis",
            },
            {
              id: "2",
              title: "Budget constraints for additional design resources",
              impact: "medium",
              probability: "low",
              status: "mitigated",
              owner: "Alex Johnson",
            },
            {
              id: "3",
              title: "Potential browser compatibility issues",
              impact: "medium",
              probability: "medium",
              status: "active",
              owner: "Beth Smith",
            },
          ],
          milestones: [
            {
              id: "1",
              title: "Design Phase Completion",
              dueDate: "2023-07-20",
              completed: true,
              description: "Complete all design assets and get stakeholder approval",
            },
            {
              id: "2",
              title: "Development Phase Completion",
              dueDate: "2023-08-25",
              completed: false,
              description: "Complete all development tasks and internal testing",
            },
            {
              id: "3",
              title: "Website Launch",
              dueDate: "2023-09-10",
              completed: false,
              description: "Official launch of the new website",
            },
          ],
          comments: [
            {
              id: "1",
              user: {
                name: "Alex Johnson",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: "AJ",
              },
              text: "I've updated the project timeline to account for the additional design requirements. Please review when you get a chance.",
              timestamp: "2023-07-25T09:15:00Z",
              reactions: [{ emoji: "👍", count: 3 }],
            },
            {
              id: "2",
              user: {
                name: "Dana Wilson",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: "DW",
              },
              text: "The content strategy document has been finalized and uploaded to the files section.",
              timestamp: "2023-07-20T14:30:00Z",
              reactions: [{ emoji: "🎉", count: 2 }],
            },
          ],
          analytics: {
            taskCompletionRate: 75,
            onTimeCompletion: 85,
            teamActivity: [
              { date: "2023-07-01", count: 5 },
              { date: "2023-07-08", count: 8 },
              { date: "2023-07-15", count: 12 },
              { date: "2023-07-22", count: 7 },
              { date: "2023-07-29", count: 10 },
            ],
            tasksByStatus: [
              { status: "todo", count: 6 },
              { status: "in-progress", count: 8 },
              { status: "review", count: 4 },
              { status: "done", count: 18 },
            ],
            tasksByPriority: [
              { priority: "low", count: 10 },
              { priority: "medium", count: 15 },
              { priority: "high", count: 11 },
            ],
          },
        })
        setLoading(false)
      }, 500)
    }

    fetchProject()
  }, [id])

  // Time tracking interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (project) {
      interval = setInterval(() => {
        setProject((prevProject) => {
          if (!prevProject) return null

          const updatedTasks = prevProject.tasks.items.map((task) => {
            if (task.isTracking) {
              return {
                ...task,
                timeTracked: task.timeTracked + 1,
              }
            }
            return task
          })

          return {
            ...prevProject,
            tasks: {
              ...prevProject.tasks,
              items: updatedTasks,
            },
          }
        })
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [project])

  const handleAddTask = () => {
    if (!taskTitle) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    if (!taskDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    if (!taskAssignee) {
      toast({
        title: "Error",
        description: "Assignee is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would save the task to the database
    if (project) {
      const newTask: ProjectTask = {
        id: (project.tasks.items.length + 1).toString(),
        title: taskTitle,
        description: taskDescription,
        status: "todo",
        assignee: {
          name: project.members.find((m) => m.id === taskAssignee)?.name || "Unknown",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: project.members.find((m) => m.id === taskAssignee)?.initials || "??",
        },
        dueDate: taskDueDate,
        priority: taskPriority as "low" | "medium" | "high",
        timeTracked: 0,
        isTracking: false,
        comments: [],
        checklist: [],
      }

      setProject({
        ...project,
        tasks: {
          ...project.tasks,
          total: project.tasks.total + 1,
          items: [...project.tasks.items, newTask],
        },
      })

      toast({
        title: "Task added",
        description: "The task has been added successfully",
      })

      // Reset form and close dialog
      setTaskTitle("")
      setTaskDescription("")
      setTaskAssignee("")
      setTaskDueDate("")
      setTaskPriority("medium")
      setOpenTaskDialog(false)
    }
  }

  const handleAddMember = () => {
    if (!memberEmail) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    if (!memberRole) {
      toast({
        title: "Error",
        description: "Role is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would send an invitation to the email
    if (project) {
      const newMember: ProjectMember = {
        id: (project.members.length + 1).toString(),
        name: memberEmail.split("@")[0],
        role:
          memberRole === "manager"
            ? "Project Manager"
            : memberRole === "developer"
              ? "Developer"
              : memberRole === "designer"
                ? "Designer"
                : "Team Member",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: memberEmail.substring(0, 2).toUpperCase(),
      }

      setProject({
        ...project,
        members: [...project.members, newMember],
      })

      toast({
        title: "Member invited",
        description: `Invitation sent to ${memberEmail}`,
      })

      // Reset form and close dialog
      setMemberEmail("")
      setMemberRole("member")
      setOpenMemberDialog(false)
    }
  }

  const handleAddRisk = () => {
    if (!riskTitle) {
      toast({
        title: "Error",
        description: "Risk title is required",
        variant: "destructive",
      })
      return
    }

    if (!riskOwner) {
      toast({
        title: "Error",
        description: "Risk owner is required",
        variant: "destructive",
      })
      return
    }

    if (project) {
      const newRisk: ProjectRisk = {
        id: (project.risks.length + 1).toString(),
        title: riskTitle,
        impact: riskImpact,
        probability: riskProbability,
        status: "active",
        owner: riskOwner,
      }

      setProject({
        ...project,
        risks: [...project.risks, newRisk],
      })

      toast({
        title: "Risk added",
        description: "The risk has been added to the project",
      })

      // Reset form and close dialog
      setRiskTitle("")
      setRiskImpact("medium")
      setRiskProbability("medium")
      setRiskOwner("")
      setOpenRiskDialog(false)
    }
  }

  const handleAddMilestone = () => {
    if (!milestoneTitle) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive",
      })
      return
    }

    if (!milestoneDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    if (project) {
      const newMilestone: ProjectMilestone = {
        id: (project.milestones.length + 1).toString(),
        title: milestoneTitle,
        dueDate: milestoneDueDate,
        completed: false,
        description: milestoneDescription,
      }

      setProject({
        ...project,
        milestones: [...project.milestones, newMilestone],
      })

      toast({
        title: "Milestone added",
        description: "The milestone has been added to the project",
      })

      // Reset form and close dialog
      setMilestoneTitle("")
      setMilestoneDueDate("")
      setMilestoneDescription("")
      setOpenMilestoneDialog(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (project) {
      const updatedTasks = project.tasks.items.filter((task) => task.id !== taskId)
      const completedCount = updatedTasks.filter((task) => task.status === "done").length

      setProject({
        ...project,
        tasks: {
          total: updatedTasks.length,
          completed: completedCount,
          items: updatedTasks,
        },
      })

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      })
    }
  }

  const handleTaskStatusChange = (taskId: string, newStatus: "todo" | "in-progress" | "review" | "done") => {
    if (project) {
      const updatedTasks = project.tasks.items.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      )

      const completedCount = updatedTasks.filter((task) => task.status === "done").length
      const progress = Math.round((completedCount / updatedTasks.length) * 100)

      setProject({
        ...project,
        progress,
        tasks: {
          ...project.tasks,
          completed: completedCount,
          items: updatedTasks,
        },
      })

      toast({
        title: "Task updated",
        description: `Task status changed to ${newStatus.replace("-", " ")}`,
      })
    }
  }

  const handleToggleTimeTracking = (taskId: string) => {
    if (project) {
      const updatedTasks = project.tasks.items.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            isTracking: !task.isTracking,
          }
        }
        // Stop tracking on other tasks if this one is starting
        if (task.isTracking && !project.tasks.items.find((t) => t.id === taskId)?.isTracking) {
          return {
            ...task,
            isTracking: false,
          }
        }
        return task
      })

      setProject({
        ...project,
        tasks: {
          ...project.tasks,
          items: updatedTasks,
        },
      })

      const isTracking = !project.tasks.items.find((t) => t.id === taskId)?.isTracking
      toast({
        title: isTracking ? "Time tracking started" : "Time tracking stopped",
        description: isTracking ? "The timer has started for this task" : "The timer has been stopped",
      })
    }
  }

  const handleAddComment = (taskId: string) => {
    if (!commentText.trim()) {
      return
    }

    if (project) {
      const updatedTasks = project.tasks.items.map((task) => {
        if (task.id === taskId) {
          const newComment: ProjectComment = {
            id: (task.comments.length + 1).toString(),
            user: {
              name: "You", // In a real app, this would be the current user
              avatar: "/placeholder.svg?height=32&width=32",
              initials: "YO",
            },
            text: commentText,
            timestamp: new Date().toISOString(),
            reactions: [],
          }

          return {
            ...task,
            comments: [...task.comments, newComment],
          }
        }
        return task
      })

      setProject({
        ...project,
        tasks: {
          ...project.tasks,
          items: updatedTasks,
        },
      })

      setCommentText("")
      toast({
        title: "Comment added",
        description: "Your comment has been added to the task",
      })
    }
  }

  const handleAddProjectComment = () => {
    if (!projectComment.trim()) {
      return
    }

    if (project) {
      const newComment: ProjectComment = {
        id: (project.comments.length + 1).toString(),
        user: {
          name: "You", // In a real app, this would be the current user
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "YO",
        },
        text: projectComment,
        timestamp: new Date().toISOString(),
        reactions: [],
      }

      setProject({
        ...project,
        comments: [newComment, ...project.comments],
      })

      setProjectComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added to the project",
      })
    }
  }

  const handleAddChecklistItem = (taskId: string) => {
    if (!checklistItem.trim()) {
      return
    }

    if (project) {
      const updatedTasks = project.tasks.items.map((task) => {
        if (task.id === taskId) {
          const newItem = {
            id: (task.checklist.length + 1).toString(),
            text: checklistItem,
            completed: false,
          }

          return {
            ...task,
            checklist: [...task.checklist, newItem],
          }
        }
        return task
      })

      setProject({
        ...project,
        tasks: {
          ...project.tasks,
          items: updatedTasks,
        },
      })

      setChecklistItem("")
      toast({
        title: "Checklist item added",
        description: "The item has been added to the checklist",
      })
    }
  }

  const handleToggleChecklistItem = (taskId: string, itemId: string, completed: boolean) => {
    if (project) {
      const updatedTasks = project.tasks.items.map((task) => {
        if (task.id === taskId) {
          const updatedChecklist = task.checklist.map((item) => (item.id === itemId ? { ...item, completed } : item))

          return {
            ...task,
            checklist: updatedChecklist,
          }
        }
        return task
      })

      setProject({
        ...project,
        tasks: {
          ...project.tasks,
          items: updatedTasks,
        },
      })
    }
  }

  const handleToggleStarProject = () => {
    if (project) {
      setProject({
        ...project,
        isStarred: !project.isStarred,
      })

      toast({
        title: project.isStarred ? "Project unstarred" : "Project starred",
        description: project.isStarred ? "Project removed from favorites" : "Project added to favorites",
      })
    }
  }

  const handleToggleMilestoneStatus = (milestoneId: string) => {
    if (project) {
      const updatedMilestones = project.milestones.map((milestone) =>
        milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone,
      )

      setProject({
        ...project,
        milestones: updatedMilestones,
      })

      const milestone = project.milestones.find((m) => m.id === milestoneId)
      toast({
        title: "Milestone updated",
        description: `Milestone marked as ${milestone?.completed ? "incomplete" : "complete"}`,
      })
    }
  }

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && project) {
      const file = files[0]
      const newFile: ProjectFile = {
        id: (project.files.length + 1).toString(),
        name: file.name,
        type: file.type.split("/")[1].toUpperCase(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: "You", // In a real app, this would be the current user
        uploadedAt: new Date().toISOString().split("T")[0],
      }

      setProject({
        ...project,
        files: [newFile, ...project.files],
      })

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      })
    }
  }

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

  const getRiskImpactColor = (impact: string) => {
    switch (impact) {
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

  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case "mitigated":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "active":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const formatTimeTracked = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const filteredTasks = project?.tasks.items.filter((task) => {
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by priority
    if (filterPriority && task.priority !== filterPriority) {
      return false
    }

    // Filter by assignee
    if (filterAssignee && task.assignee.name !== filterAssignee) {
      return false
    }

    // Filter completed tasks
    if (!showCompletedTasks && task.status === "done") {
      return false
    }

    return true
  })

  const tasksByStatus = {
    todo: filteredTasks?.filter((task) => task.status === "todo") || [],
    "in-progress": filteredTasks?.filter((task) => task.status === "in-progress") || [],
    review: filteredTasks?.filter((task) => task.status === "review") || [],
    done: filteredTasks?.filter((task) => task.status === "done") || [],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleStarProject}>
                {project.isStarred ? (
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ) : (
                  <StarOff className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" /> Change Due Date
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" /> Set as Template
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="mr-2 h-4 w-4" /> Automate Tasks
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" /> Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{formatDate(project.dueDate)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasks</p>
                      <p className="font-medium">
                        {project.tasks.completed} / {project.tasks.total} completed
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                      <p className="font-medium">{project.members.length} members</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks and Files Tabs */}
            <Tabs defaultValue="tasks">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      placeholder="Search tasks..."
                      className="w-full md:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-10">
                            Priority <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-all"
                                checked={!filterPriority}
                                onCheckedChange={() => setFilterPriority(null)}
                              />
                              <label htmlFor="priority-all" className="text-sm font-medium">
                                All
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-high"
                                checked={filterPriority === "high"}
                                onCheckedChange={() => setFilterPriority(filterPriority === "high" ? null : "high")}
                              />
                              <label htmlFor="priority-high" className="text-sm font-medium">
                                High
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-medium"
                                checked={filterPriority === "medium"}
                                onCheckedChange={() => setFilterPriority(filterPriority === "medium" ? null : "medium")}
                              />
                              <label htmlFor="priority-medium" className="text-sm font-medium">
                                Medium
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-low"
                                checked={filterPriority === "low"}
                                onCheckedChange={() => setFilterPriority(filterPriority === "low" ? null : "low")}
                              />
                              <label htmlFor="priority-low" className="text-sm font-medium">
                                Low
                              </label>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-10">
                            Assignee <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="assignee-all"
                                checked={!filterAssignee}
                                onCheckedChange={() => setFilterAssignee(null)}
                              />
                              <label htmlFor="assignee-all" className="text-sm font-medium">
                                All
                              </label>
                            </div>
                            {project.members.map((member) => (
                              <div key={member.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`assignee-${member.id}`}
                                  checked={filterAssignee === member.name}
                                  onCheckedChange={() =>
                                    setFilterAssignee(filterAssignee === member.name ? null : member.name)
                                  }
                                />
                                <label htmlFor={`assignee-${member.id}`} className="text-sm font-medium">
                                  {member.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-completed"
                        checked={showCompletedTasks}
                        onCheckedChange={setShowCompletedTasks}
                      />
                      <Label htmlFor="show-completed">Show completed</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        List
                      </Button>
                      <Button
                        variant={viewMode === "kanban" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("kanban")}
                      >
                        Kanban
                      </Button>
                    </div>

                    <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Add New Task</DialogTitle>
                          <DialogDescription>Create a new task for this project.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="task-title">Task Title</Label>
                            <Input
                              id="task-title"
                              placeholder="Enter task title"
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                              id="task-description"
                              placeholder="Enter task description"
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="task-assignee">Assignee</Label>
                              <select
                                id="task-assignee"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={taskAssignee}
                                onChange={(e) => setTaskAssignee(e.target.value)}
                              >
                                <option value="">Select assignee</option>
                                {project.members.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="task-due-date">Due Date</Label>
                              <Input
                                id="task-due-date"
                                type="date"
                                value={taskDueDate}
                                onChange={(e) => setTaskDueDate(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="task-priority">Priority</Label>
                            <select
                              id="task-priority"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={taskPriority}
                              onChange={(e) => setTaskPriority(e.target.value)}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenTaskDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddTask}>Add Task</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {viewMode === "list" ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="space-y-4 p-4">
                        {filteredTasks?.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No tasks found matching your filters</p>
                          </div>
                        ) : (
                          filteredTasks?.map((task) => (
                            <div
                              key={task.id}
                              className={`flex flex-col rounded-lg border p-3 ${task.status === "done" ? "bg-muted/30" : ""}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={task.status === "done"}
                                    onCheckedChange={(checked) => {
                                      handleTaskStatusChange(task.id, checked ? "done" : "todo")
                                    }}
                                  />
                                  <div>
                                    <h3
                                      className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                                    >
                                      {task.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{task.assignee.name}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Due {formatDate(task.dueDate)}</span>
                                  </div>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setSelectedTask(task)}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(tasksByStatus).map(([status, tasks]) => (
                      <Card key={status} className="overflow-hidden">
                        <CardHeader className="p-3 bg-muted/50">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span className="capitalize">{status.replace("-", " ")}</span>
                            <Badge variant="outline">{tasks.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div className="space-y-2 min-h-[100px]">
                            {tasks.length === 0 ? (
                              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                                No tasks
                              </div>
                            ) : (
                              tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="rounded-md border bg-card p-3 shadow-sm cursor-pointer hover:border-primary/50"
                                  onClick={() => setSelectedTask(task)}
                                >
                                  <div className="flex items-start justify-between">
                                    <h3 className="font-medium text-sm">{task.title}</h3>
                                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {formatDate(task.dueDate)}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Project Files</CardTitle>
                    <div className="flex gap-2">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                      <Button size="sm" onClick={handleUploadFile}>
                        <Plus className="mr-2 h-4 w-4" /> Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.files.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No files uploaded yet</p>
                          <Button variant="outline" className="mt-4" onClick={handleUploadFile}>
                            <Plus className="mr-2 h-4 w-4" /> Upload your first file
                          </Button>
                        </div>
                      ) : (
                        project.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <div className="rounded-md bg-muted p-2">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">{file.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {file.size} • Uploaded by {file.uploadedBy} on {formatDate(file.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Project Milestones</CardTitle>
                    <Dialog open={openMilestoneDialog} onOpenChange={setOpenMilestoneDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Milestone
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Add New Milestone</DialogTitle>
                          <DialogDescription>Create a new milestone for this project.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="milestone-title">Milestone Title</Label>
                            <Input
                              id="milestone-title"
                              placeholder="Enter milestone title"
                              value={milestoneTitle}
                              onChange={(e) => setMilestoneTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="milestone-due-date">Due Date</Label>
                            <Input
                              id="milestone-due-date"
                              type="date"
                              value={milestoneDueDate}
                              onChange={(e) => setMilestoneDueDate(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="milestone-description">Description</Label>
                            <Textarea
                              id="milestone-description"
                              placeholder="Enter milestone description"
                              value={milestoneDescription}
                              onChange={(e) => setMilestoneDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenMilestoneDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddMilestone}>Add Milestone</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No milestones created yet</p>
                          <Button variant="outline" className="mt-4" onClick={() => setOpenMilestoneDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Create your first milestone
                          </Button>
                        </div>
                      ) : (
                        project.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-start space-x-4 rounded-lg border p-4">
                            <div className="mt-1">
                              <Checkbox
                                checked={milestone.completed}
                                onCheckedChange={() => handleToggleMilestoneStatus(milestone.id)}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {milestone.title}
                                </h3>
                                <Badge variant={milestone.completed ? "outline" : "default"}>
                                  {milestone.completed ? "Completed" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground">Due {formatDate(milestone.dueDate)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Project Risks</CardTitle>
                    <Dialog open={openRiskDialog} onOpenChange={setOpenRiskDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Risk
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Add New Risk</DialogTitle>
                          <DialogDescription>Identify a new risk for this project.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="risk-title">Risk Title</Label>
                            <Input
                              id="risk-title"
                              placeholder="Enter risk title"
                              value={riskTitle}
                              onChange={(e) => setRiskTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="risk-impact">Impact</Label>
                              <select
                                id="risk-impact"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={riskImpact}
                                onChange={(e) => setRiskImpact(e.target.value as "low" | "medium" | "high")}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="risk-probability">Probability</Label>
                              <select
                                id="risk-probability"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={riskProbability}
                                onChange={(e) => setRiskProbability(e.target.value as "low" | "medium" | "high")}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="risk-owner">Risk Owner</Label>
                            <select
                              id="risk-owner"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={riskOwner}
                              onChange={(e) => setRiskOwner(e.target.value)}
                            >
                              <option value="">Select owner</option>
                              {project.members.map((member) => (
                                <option key={member.id} value={member.name}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenRiskDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddRisk}>Add Risk</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.risks.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No risks identified yet</p>
                          <Button variant="outline" className="mt-4" onClick={() => setOpenRiskDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add your first risk
                          </Button>
                        </div>
                      ) : (
                        project.risks.map((risk) => (
                          <div key={risk.id} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertTriangle
                                  className={`h-5 w-5 ${risk.impact === "high" ? "text-red-500" : risk.impact === "medium" ? "text-orange-500" : "text-green-500"}`}
                                />
                                <h3 className="font-medium">{risk.title}</h3>
                              </div>
                              <Badge variant="outline" className={getRiskStatusColor(risk.status)}>
                                {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Impact</p>
                                <Badge variant="outline" className={getRiskImpactColor(risk.impact)}>
                                  {risk.impact.charAt(0).toUpperCase() + risk.impact.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Probability</p>
                                <Badge variant="outline" className={getRiskImpactColor(risk.probability)}>
                                  {risk.probability.charAt(0).toUpperCase() + risk.probability.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Owner</p>
                                <p className="font-medium">{risk.owner}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Project Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Task Completion Rate</h3>
                      <p className="text-3xl font-bold mt-2">{project.analytics.taskCompletionRate}%</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">On-Time Completion</h3>
                      <p className="text-3xl font-bold mt-2">{project.analytics.onTimeCompletion}%</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Team Activity</h3>
                      <p className="text-3xl font-bold mt-2">
                        {project.analytics.teamActivity.reduce((sum, item) => sum + item.count, 0)} actions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-4">Tasks by Status</h3>
                      <div className="space-y-3">
                        {project.analytics.tasksByStatus.map((item) => (
                          <div key={item.status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{item.status.replace("-", " ")}</span>
                              <span>{item.count}</span>
                            </div>
                            <Progress value={(item.count / project.tasks.total) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-4">Tasks by Priority</h3>
                      <div className="space-y-3">
                        {project.analytics.tasksByPriority.map((item) => (
                          <div key={item.priority} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{item.priority}</span>
                              <span>{item.count}</span>
                            </div>
                            <Progress
                              value={(item.count / project.tasks.total) * 100}
                              className={`h-2 ${
                                item.priority === "high"
                                  ? "bg-red-500"
                                  : item.priority === "medium"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Team Members</CardTitle>
                <Dialog open={openMemberDialog} onOpenChange={setOpenMemberDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>Invite a new member to join this project.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="member-email">Email</Label>
                        <Input
                          id="member-email"
                          type="email"
                          placeholder="Enter email address"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="member-role">Role</Label>
                        <select
                          id="member-role"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={memberRole}
                          onChange={(e) => setMemberRole(e.target.value)}
                        >
                          <option value="manager">Project Manager</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                          <option value="member">Team Member</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenMemberDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember}>Add Member</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Project Discussion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[80px]"
                        value={projectComment}
                        onChange={(e) => setProjectComment(e.target.value)}
                      />
                      <Button
                        className="ml-auto"
                        size="sm"
                        onClick={handleAddProjectComment}
                        disabled={!projectComment.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" /> Post
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {project.comments.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No comments yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Be the first to start the discussion</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {project.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{comment.user.name}</h4>
                              <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {comment.reactions.map((reaction, index) => (
                                <Badge key={index} variant="outline" className="text-xs py-0 h-6">
                                  {reaction.emoji} {reaction.count}
                                </Badge>
                              ))}
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Smile className="h-3 w-3 mr-1" /> React
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" /> Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </Badge>
              </div>
              <DialogDescription>{selectedTask.description}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedTask.assignee.avatar} alt={selectedTask.assignee.name} />
                      <AvatarFallback>{selectedTask.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span>{selectedTask.assignee.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="mt-1">{formatDate(selectedTask.dueDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <select
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTask.status}
                    onChange={(e) => handleTaskStatusChange(selectedTask.id, e.target.value as any)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Tracked</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono">{formatTimeTracked(selectedTask.timeTracked)}</span>
                    <Button
                      variant={selectedTask.isTracking ? "destructive" : "outline"}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleToggleTimeTracking(selectedTask.id)}
                    >
                      {selectedTask.isTracking ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" /> Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" /> Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Checklist</h4>
                  <Badge variant="outline">
                    {selectedTask.checklist.filter((item) => item.completed).length}/{selectedTask.checklist.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {selectedTask.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={(checked) =>
                          handleToggleChecklistItem(selectedTask.id, item.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`checklist-${item.id}`}
                        className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add checklist item..."
                    className="h-8 text-sm"
                    value={checklistItem}
                    onChange={(e) => setChecklistItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && checklistItem.trim()) {
                        handleAddChecklistItem(selectedTask.id)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => handleAddChecklistItem(selectedTask.id)}
                    disabled={!checklistItem.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Comments</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {selectedTask.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  ) : (
                    selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                          <AvatarFallback>{comment.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-medium">{comment.user.name}</h4>
                            <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {comment.reactions.map((reaction, index) => (
                              <Badge key={index} variant="outline" className="text-xs py-0 h-5">
                                {reaction.emoji} {reaction.count}
                              </Badge>
                            ))}
                            <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[60px]"
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    className="self-end"
                    size="sm"
                    onClick={() => handleAddComment(selectedTask.id)}
                    disabled={!commentText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleDeleteTask(selectedTask.id)
                  setSelectedTask(null)
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Task
              </Button>
              <Button onClick={() => setSelectedTask(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

