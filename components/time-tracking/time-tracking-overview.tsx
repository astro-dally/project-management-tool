"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Clock,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Calendar,
  BarChart2,
  Clock4,
  Zap,
  Award,
  Settings,
  X,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type TimeEntry = {
  id: string
  project: string
  task: string
  startTime: string
  endTime: string
  duration: number // in seconds
  date: string
  notes: string
  tags: string[]
  color: string
}

type Project = {
  id: string
  name: string
  color: string
  tasks: {
    id: string
    name: string
  }[]
}

type TeamMember = {
  id: string
  name: string
  avatar: string
  initials: string
  role: string
  hoursLogged: number
  assignedTasks: number
}

export function TimeTrackingOverview() {
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timer, setTimer] = useState("00:00:00")
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [assignTask, setAssignTask] = useState<string>("")
  const [assignProject, setAssignProject] = useState<string>("")
  const [assignHours, setAssignHours] = useState<number>(1)
  const [assignDate, setAssignDate] = useState<string>("")
  const [pomodoroMode, setPomodoroMode] = useState(false)
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25, // minutes
    breakDuration: 5, // minutes
    longBreakDuration: 15, // minutes
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    soundEnabled: true,
    soundVolume: 80, // 0-100
  })
  const [currentPomodoroSession, setCurrentPomodoroSession] = useState(1)
  const [pomodoroState, setPomodoroState] = useState<"work" | "break" | "longBreak">("work")
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(pomodoroSettings.workDuration * 60)
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false)
  const [timeTrackingSettings, setTimeTrackingSettings] = useState({
    roundTimeEntries: true,
    roundingInterval: 15, // minutes
    minimumTimeEntry: 1, // minutes
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    autoStopAt: "18:00",
    idleDetection: true,
    idleThreshold: 5, // minutes
  })
  const [showTimeTrackingSettings, setShowTimeTrackingSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize data
  useEffect(() => {
    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: "1",
        name: "Website Redesign",
        color: "#3b82f6",
        tasks: [
          { id: "1", name: "Design Homepage" },
          { id: "2", name: "Implement Authentication" },
          { id: "3", name: "Responsive Layouts" },
        ],
      },
      {
        id: "2",
        name: "Mobile App Development",
        color: "#8b5cf6",
        tasks: [
          { id: "4", name: "API Integration" },
          { id: "5", name: "UI Components" },
          { id: "6", name: "Testing" },
        ],
      },
      {
        id: "3",
        name: "Marketing Campaign",
        color: "#10b981",
        tasks: [
          { id: "7", name: "Content Creation" },
          { id: "8", name: "Social Media Posts" },
          { id: "9", name: "Analytics Review" },
        ],
      },
      {
        id: "4",
        name: "Product Launch",
        color: "#f97316",
        tasks: [
          { id: "10", name: "Market Research" },
          { id: "11", name: "Competitor Analysis" },
          { id: "12", name: "Launch Strategy" },
        ],
      },
    ]

    // Mock time entries
    const mockTimeEntries: TimeEntry[] = [
      {
        id: "1",
        project: "Website Redesign",
        task: "Design Homepage",
        startTime: "09:00",
        endTime: "11:30",
        duration: 9000, // 2.5 hours in seconds
        date: "2023-08-01",
        notes: "Completed initial wireframes",
        tags: ["design", "wireframes"],
        color: "#3b82f6",
      },
      {
        id: "2",
        project: "Mobile App Development",
        task: "API Integration",
        startTime: "13:00",
        endTime: "15:45",
        duration: 9900, // 2.75 hours in seconds
        date: "2023-08-01",
        notes: "Connected user authentication endpoints",
        tags: ["api", "backend"],
        color: "#8b5cf6",
      },
      {
        id: "3",
        project: "Marketing Campaign",
        task: "Content Creation",
        startTime: "10:15",
        endTime: "12:30",
        duration: 8100, // 2.25 hours in seconds
        date: "2023-08-02",
        notes: "Drafted social media posts",
        tags: ["content", "social"],
        color: "#10b981",
      },
      {
        id: "4",
        project: "Website Redesign",
        task: "Team Meeting",
        startTime: "14:00",
        endTime: "15:00",
        duration: 3600, // 1 hour in seconds
        date: "2023-08-02",
        notes: "Discussed design feedback",
        tags: ["meeting", "feedback"],
        color: "#3b82f6",
      },
      {
        id: "5",
        project: "Mobile App Development",
        task: "Bug Fixing",
        startTime: "09:30",
        endTime: "12:00",
        duration: 9000, // 2.5 hours in seconds
        date: "2023-08-03",
        notes: "Fixed login screen issues",
        tags: ["bugs", "frontend"],
        color: "#8b5cf6",
      },
    ]

    // Mock team members
    const mockTeamMembers: TeamMember[] = [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
        role: "Project Manager",
        hoursLogged: 32,
        assignedTasks: 5,
      },
      {
        id: "2",
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "BS",
        role: "Designer",
        hoursLogged: 28,
        assignedTasks: 4,
      },
      {
        id: "3",
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CD",
        role: "Developer",
        hoursLogged: 36,
        assignedTasks: 6,
      },
      {
        id: "4",
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DW",
        role: "Content Writer",
        hoursLogged: 24,
        assignedTasks: 3,
      },
      {
        id: "5",
        name: "Eric Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EB",
        role: "Marketing Specialist",
        hoursLogged: 30,
        assignedTasks: 4,
      },
    ]

    setProjects(mockProjects)
    setTimeEntries(mockTimeEntries)
    setTeamMembers(mockTeamMembers)

    // Set default project and task if available
    if (mockProjects.length > 0) {
      setSelectedProject(mockProjects[0].id)
      if (mockProjects[0].tasks.length > 0) {
        setSelectedTask(mockProjects[0].tasks[0].id)
      }
    }

    // Set default assign date to today
    const today = new Date()
    setAssignDate(today.toISOString().split("T")[0])

    // Initialize audio for pomodoro timer
    audioRef.current = new Audio("/notification.mp3")

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [])

  // Regular timer functionality
  const toggleTracking = () => {
    if (isTracking && !isPaused) {
      // Pause timer
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
      setIsPaused(true)

      toast({
        title: "Timer paused",
        description: "Your time tracking has been paused",
      })
    } else if (isTracking && isPaused) {
      // Resume timer
      const interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          const hours = Math.floor(newSeconds / 3600)
          const minutes = Math.floor((newSeconds % 3600) / 60)
          const secs = newSeconds % 60

          setTimer(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
          )

          return newSeconds
        })
      }, 1000)

      setTimerInterval(interval)
      setIsPaused(false)

      toast({
        title: "Timer resumed",
        description: "Your time tracking has been resumed",
      })
    } else {
      // Start timer
      if (!selectedProject || !selectedTask) {
        toast({
          title: "Error",
          description: "Please select a project and task before starting the timer",
          variant: "destructive",
        })
        return
      }

      setSeconds(0)
      setTimer("00:00:00")

      const interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          const hours = Math.floor(newSeconds / 3600)
          const minutes = Math.floor((newSeconds % 3600) / 60)
          const secs = newSeconds % 60

          setTimer(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
          )

          return newSeconds
        })
      }, 1000)

      setTimerInterval(interval)
      setIsTracking(true)
      setIsPaused(false)

      toast({
        title: "Timer started",
        description: "Your time tracking has started",
      })
    }
  }

  // Stop tracking and save time entry
  const stopTracking = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }

    if (seconds > 0) {
      const project = projects.find((p) => p.id === selectedProject)
      const task = project?.tasks.find((t) => t.id === selectedTask)

      if (project && task) {
        const now = new Date()
        const startTime = new Date(now.getTime() - seconds * 1000)

        const newTimeEntry: TimeEntry = {
          id: (timeEntries.length + 1).toString(),
          project: project.name,
          task: task.name,
          startTime: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          endTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          duration: seconds,
          date: now.toISOString().split("T")[0],
          notes: notes,
          tags: tags,
          color: project.color,
        }

        setTimeEntries([newTimeEntry, ...timeEntries])

        toast({
          title: "Time entry saved",
          description: `Tracked ${formatDuration(seconds)} for ${task.name}`,
        })
      }
    }

    setIsTracking(false)
    setIsPaused(false)
    setSeconds(0)
    setTimer("00:00:00")
    setNotes("")
    setTags([])
  }

  // Pomodoro timer functionality
  useEffect(() => {
    let pomodoroInterval: NodeJS.Timeout | null = null

    if (pomodoroMode && isTracking && !isPaused) {
      pomodoroInterval = setInterval(() => {
        setPomodoroTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up for current session
            clearInterval(pomodoroInterval!)

            // Play sound if enabled
            if (pomodoroSettings.soundEnabled && audioRef.current) {
              audioRef.current.volume = pomodoroSettings.soundVolume / 100
              audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
            }

            // Switch between work and break
            if (pomodoroState === "work") {
              // Check if it's time for a long break
              if (currentPomodoroSession >= pomodoroSettings.sessionsBeforeLongBreak) {
                setPomodoroState("longBreak")
                setCurrentPomodoroSession(1)

                toast({
                  title: "Long break time!",
                  description: `Take a ${pomodoroSettings.longBreakDuration} minute break`,
                })

                // Auto-start break if enabled
                if (pomodoroSettings.autoStartBreaks) {
                  return pomodoroSettings.longBreakDuration * 60
                } else {
                  setIsPaused(true)
                  return 0
                }
              } else {
                setPomodoroState("break")

                toast({
                  title: "Break time!",
                  description: `Take a ${pomodoroSettings.breakDuration} minute break`,
                })

                // Auto-start break if enabled
                if (pomodoroSettings.autoStartBreaks) {
                  return pomodoroSettings.breakDuration * 60
                } else {
                  setIsPaused(true)
                  return 0
                }
              }
            } else {
              // Break is over, back to work
              setPomodoroState("work")
              setCurrentPomodoroSession((prev) => prev + 1)

              toast({
                title: "Break over!",
                description: `Time to work for ${pomodoroSettings.workDuration} minutes`,
              })

              // Auto-start pomodoro if enabled
              if (pomodoroSettings.autoStartPomodoros) {
                return pomodoroSettings.workDuration * 60
              } else {
                setIsPaused(true)
                return 0
              }
            }
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (pomodoroInterval) {
        clearInterval(pomodoroInterval)
      }
    }
  }, [pomodoroMode, isTracking, isPaused, pomodoroState, currentPomodoroSession, pomodoroSettings])

  // Start pomodoro timer
  const startPomodoroTimer = () => {
    setPomodoroMode(true)
    setPomodoroState("work")
    setPomodoroTimeLeft(pomodoroSettings.workDuration * 60)
    setCurrentPomodoroSession(1)
    setIsTracking(true)
    setIsPaused(false)

    toast({
      title: "Pomodoro timer started",
      description: `Working for ${pomodoroSettings.workDuration} minutes`,
    })
  }

  // Reset pomodoro timer
  const resetPomodoroTimer = () => {
    if (pomodoroState === "work") {
      setPomodoroTimeLeft(pomodoroSettings.workDuration * 60)
    } else if (pomodoroState === "break") {
      setPomodoroTimeLeft(pomodoroSettings.breakDuration * 60)
    } else {
      setPomodoroTimeLeft(pomodoroSettings.longBreakDuration * 60)
    }

    setIsPaused(true)

    toast({
      title: "Pomodoro timer reset",
      description: "Timer has been reset",
    })
  }

  // Skip current pomodoro session
  const skipPomodoroSession = () => {
    if (pomodoroState === "work") {
      setPomodoroState("break")
      setPomodoroTimeLeft(pomodoroSettings.breakDuration * 60)

      toast({
        title: "Skipped to break",
        description: `Taking a ${pomodoroSettings.breakDuration} minute break`,
      })
    } else {
      setPomodoroState("work")
      setPomodoroTimeLeft(pomodoroSettings.workDuration * 60)
      setCurrentPomodoroSession((prev) => prev + 1)

      toast({
        title: "Skipped to work",
        description: `Working for ${pomodoroSettings.workDuration} minutes`,
      })
    }
  }

  // Format seconds to HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours > 0 ? hours + "h " : ""}${minutes}m ${secs}s`
  }

  // Format pomodoro time left
  const formatPomodoroTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Handle assignment
  const handleAssignTask = () => {
    if (!selectedMember || !assignTask || !assignProject || !assignDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const member = teamMembers.find((m) => m.id === selectedMember)
    const project = projects.find((p) => p.id === assignProject)
    const task = project?.tasks.find((t) => t.id === assignTask)

    if (member && project && task) {
      // Update team member's assigned tasks
      setTeamMembers(
        teamMembers.map((m) => (m.id === selectedMember ? { ...m, assignedTasks: m.assignedTasks + 1 } : m)),
      )

      toast({
        title: "Task assigned",
        description: `Assigned ${task.name} to ${member.name} for ${assignHours} hours on ${new Date(assignDate).toLocaleDateString()}`,
      })

      // Reset form
      setSelectedMember("")
      setAssignTask("")
      setAssignProject("")
      setAssignHours(1)
      setOpenAssignDialog(false)
    }
  }

  // Calculate time distribution data
  const timeDistributionData = projects.map((project) => {
    const projectEntries = timeEntries.filter((entry) => entry.project === project.name)
    const totalDuration = projectEntries.reduce((sum, entry) => sum + entry.duration, 0)

    return {
      name: project.name,
      value: Math.round(totalDuration / 3600), // Convert to hours
      color: project.color,
    }
  })

  const totalHours = timeDistributionData.reduce((sum, item) => sum + item.value, 0)

  // Calculate daily hours
  const dailyHoursData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    const dayEntries = timeEntries.filter((entry) => entry.date === dateString)
    const totalDuration = dayEntries.reduce((sum, entry) => sum + entry.duration, 0)

    return {
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      hours: Math.round((totalDuration / 3600) * 10) / 10, // Convert to hours with 1 decimal
    }
  }).reverse()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="timer">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Time Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-5xl font-bold font-mono">{timer}</div>
                    <div className="flex gap-2">
                      <Button className="w-32" onClick={toggleTracking} disabled={!selectedProject || !selectedTask}>
                        {isTracking ? (
                          isPaused ? (
                            <>
                              <Play className="mr-2 h-4 w-4" /> Resume
                            </>
                          ) : (
                            <>
                              <Pause className="mr-2 h-4 w-4" /> Pause
                            </>
                          )
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" /> Start Timer
                          </>
                        )}
                      </Button>
                      {isTracking && (
                        <Button variant="outline" className="w-32" onClick={stopTracking}>
                          <Clock className="mr-2 h-4 w-4" /> Stop & Save
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project</Label>
                      <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isTracking}>
                        <SelectTrigger id="project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: project.color }}
                                ></div>
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task">Task</Label>
                      <Select
                        value={selectedTask}
                        onValueChange={setSelectedTask}
                        disabled={!selectedProject || isTracking}
                      >
                        <SelectTrigger id="task">
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects
                            .find((p) => p.id === selectedProject)
                            ?.tasks.map((task) => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Add notes about what you're working on"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInput}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setShowTimeTrackingSettings(true)}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
                <Dialog open={showTimeTrackingSettings} onOpenChange={setShowTimeTrackingSettings}>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Time Tracking Settings</DialogTitle>
                      <DialogDescription>Customize your time tracking preferences</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="round-time-entries">Round time entries</Label>
                        <Switch
                          id="round-time-entries"
                          checked={timeTrackingSettings.roundTimeEntries}
                          onCheckedChange={(checked) =>
                            setTimeTrackingSettings({
                              ...timeTrackingSettings,
                              roundTimeEntries: checked,
                            })
                          }
                        />
                      </div>

                      {timeTrackingSettings.roundTimeEntries && (
                        <div className="space-y-2">
                          <Label htmlFor="rounding-interval">Rounding interval (minutes)</Label>
                          <Select
                            value={timeTrackingSettings.roundingInterval.toString()}
                            onValueChange={(value) =>
                              setTimeTrackingSettings({
                                ...timeTrackingSettings,
                                roundingInterval: Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger id="rounding-interval">
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="10">10 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="minimum-time-entry">Minimum time entry (minutes)</Label>
                        <Select
                          value={timeTrackingSettings.minimumTimeEntry.toString()}
                          onValueChange={(value) =>
                            setTimeTrackingSettings({
                              ...timeTrackingSettings,
                              minimumTimeEntry: Number.parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger id="minimum-time-entry">
                            <SelectValue placeholder="Select minimum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 minute</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="working-hours-start">Working hours start</Label>
                          <Input
                            id="working-hours-start"
                            type="time"
                            value={timeTrackingSettings.workingHoursStart}
                            onChange={(e) =>
                              setTimeTrackingSettings({
                                ...timeTrackingSettings,
                                workingHoursStart: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="working-hours-end">Working hours end</Label>
                          <Input
                            id="working-hours-end"
                            type="time"
                            value={timeTrackingSettings.workingHoursEnd}
                            onChange={(e) =>
                              setTimeTrackingSettings({
                                ...timeTrackingSettings,
                                workingHoursEnd: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Working days</Label>
                        <div className="flex gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                            <Button
                              key={day}
                              type="button"
                              variant={timeTrackingSettings.workingDays.includes(index + 1) ? "default" : "outline"}
                              className="w-10 p-0"
                              onClick={() => {
                                const newWorkingDays = timeTrackingSettings.workingDays.includes(index + 1)
                                  ? timeTrackingSettings.workingDays.filter((d) => d !== index + 1)
                                  : [...timeTrackingSettings.workingDays, index + 1]

                                setTimeTrackingSettings({
                                  ...timeTrackingSettings,
                                  workingDays: newWorkingDays,
                                })
                              }}
                            >
                              {day.charAt(0)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="idle-detection">Idle detection</Label>
                        <Switch
                          id="idle-detection"
                          checked={timeTrackingSettings.idleDetection}
                          onCheckedChange={(checked) =>
                            setTimeTrackingSettings({
                              ...timeTrackingSettings,
                              idleDetection: checked,
                            })
                          }
                        />
                      </div>

                      {timeTrackingSettings.idleDetection && (
                        <div className="space-y-2">
                          <Label htmlFor="idle-threshold">Idle threshold (minutes)</Label>
                          <Select
                            value={timeTrackingSettings.idleThreshold.toString()}
                            onValueChange={(value) =>
                              setTimeTrackingSettings({
                                ...timeTrackingSettings,
                                idleThreshold: Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger id="idle-threshold">
                              <SelectValue placeholder="Select threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="10">10 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setShowTimeTrackingSettings(false)}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  {timeEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 rounded-lg border p-3">
                      <div
                        className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{entry.task}</h3>
                          <span className="text-sm font-mono">{formatDuration(entry.duration)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.project}</p>
                        {entry.notes && <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          <span>
                            {entry.startTime} - {entry.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Time Entries
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {timeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}h`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyHoursData.map((day) => (
                    <div key={day.date} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{day.date}</span>
                        <span>{day.hours}h</span>
                      </div>
                      <Progress value={(day.hours / 8) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pomodoro Tab */}
        <TabsContent value="pomodoro" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pomodoro Timer</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowPomodoroSettings(true)}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {pomodoroState === "work" ? "FOCUS TIME" : pomodoroState === "break" ? "SHORT BREAK" : "LONG BREAK"}
                  </div>
                  <div className="text-6xl font-bold font-mono">{formatPomodoroTime(pomodoroTimeLeft)}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Session {currentPomodoroSession} of {pomodoroSettings.sessionsBeforeLongBreak}
                  </div>
                </div>

                <Progress
                  value={
                    pomodoroState === "work"
                      ? (pomodoroTimeLeft / (pomodoroSettings.workDuration * 60)) * 100
                      : pomodoroState === "break"
                        ? (pomodoroTimeLeft / (pomodoroSettings.breakDuration * 60)) * 100
                        : (pomodoroTimeLeft / (pomodoroSettings.longBreakDuration * 60)) * 100
                  }
                  className="h-2 w-full max-w-md"
                />

                <div className="flex gap-3">
                  {!isTracking ? (
                    <Button className="w-32" onClick={startPomodoroTimer} disabled={!selectedProject || !selectedTask}>
                      <Play className="mr-2 h-4 w-4" /> Start
                    </Button>
                  ) : isPaused ? (
                    <Button className="w-32" onClick={toggleTracking}>
                      <Play className="mr-2 h-4 w-4" /> Resume
                    </Button>
                  ) : (
                    <Button className="w-32" onClick={toggleTracking}>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </Button>
                  )}

                  <Button variant="outline" onClick={resetPomodoroTimer} disabled={!isTracking}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>

                  <Button variant="outline" onClick={skipPomodoroSession} disabled={!isTracking}>
                    <SkipForward className="mr-2 h-4 w-4" /> Skip
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="pomodoro-project">Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isTracking}>
                      <SelectTrigger id="pomodoro-project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: project.color }}
                              ></div>
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pomodoro-task">Task</Label>
                    <Select
                      value={selectedTask}
                      onValueChange={setSelectedTask}
                      disabled={!selectedProject || isTracking}
                    >
                      <SelectTrigger id="pomodoro-task">
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects
                          .find((p) => p.id === selectedProject)
                          ?.tasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={showPomodoroSettings} onOpenChange={setShowPomodoroSettings}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Pomodoro Settings</DialogTitle>
                <DialogDescription>Customize your pomodoro timer preferences</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-duration">Work duration (minutes)</Label>
                    <Input
                      id="work-duration"
                      type="number"
                      min="1"
                      max="60"
                      value={pomodoroSettings.workDuration}
                      onChange={(e) =>
                        setPomodoroSettings({
                          ...pomodoroSettings,
                          workDuration: Number.parseInt(e.target.value) || 25,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break-duration">Break duration (minutes)</Label>
                    <Input
                      id="break-duration"
                      type="number"
                      min="1"
                      max="30"
                      value={pomodoroSettings.breakDuration}
                      onChange={(e) =>
                        setPomodoroSettings({
                          ...pomodoroSettings,
                          breakDuration: Number.parseInt(e.target.value) || 5,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="long-break-duration">Long break duration (minutes)</Label>
                    <Input
                      id="long-break-duration"
                      type="number"
                      min="1"
                      max="60"
                      value={pomodoroSettings.longBreakDuration}
                      onChange={(e) =>
                        setPomodoroSettings({
                          ...pomodoroSettings,
                          longBreakDuration: Number.parseInt(e.target.value) || 15,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessions-before-long-break">Sessions before long break</Label>
                    <Input
                      id="sessions-before-long-break"
                      type="number"
                      min="1"
                      max="10"
                      value={pomodoroSettings.sessionsBeforeLongBreak}
                      onChange={(e) =>
                        setPomodoroSettings({
                          ...pomodoroSettings,
                          sessionsBeforeLongBreak: Number.parseInt(e.target.value) || 4,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-start-breaks">Auto-start breaks</Label>
                  <Switch
                    id="auto-start-breaks"
                    checked={pomodoroSettings.autoStartBreaks}
                    onCheckedChange={(checked) =>
                      setPomodoroSettings({
                        ...pomodoroSettings,
                        autoStartBreaks: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-start-pomodoros">Auto-start pomodoros</Label>
                  <Switch
                    id="auto-start-pomodoros"
                    checked={pomodoroSettings.autoStartPomodoros}
                    onCheckedChange={(checked) =>
                      setPomodoroSettings({
                        ...pomodoroSettings,
                        autoStartPomodoros: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled">Sound notifications</Label>
                  <Switch
                    id="sound-enabled"
                    checked={pomodoroSettings.soundEnabled}
                    onCheckedChange={(checked) =>
                      setPomodoroSettings({
                        ...pomodoroSettings,
                        soundEnabled: checked,
                      })
                    }
                  />
                </div>

                {pomodoroSettings.soundEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-volume">Sound volume</Label>
                      <div className="flex items-center gap-2">
                        {pomodoroSettings.soundVolume === 0 ? (
                          <VolumeX className="h-4 w-4 text-muted-foreground" />
                        ) : pomodoroSettings.soundVolume < 50 ? (
                          <Volume1 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="w-8 text-right text-sm">{pomodoroSettings.soundVolume}%</span>
                      </div>
                    </div>
                    <Slider
                      id="sound-volume"
                      min={0}
                      max={100}
                      step={10}
                      value={[pomodoroSettings.soundVolume]}
                      onValueChange={(value) =>
                        setPomodoroSettings({
                          ...pomodoroSettings,
                          soundVolume: value[0],
                        })
                      }
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setShowPomodoroSettings(false)}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Hours This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{totalHours}h</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <BarChart2 className="mr-1 h-3 w-3 text-green-500" />
                        <span className="text-green-500">+4h</span>
                        <span className="ml-1">from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{Math.round(totalHours / 5)}h</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock4 className="mr-1 h-3 w-3 text-green-500" />
                        <span className="text-green-500">+0.8h</span>
                        <span className="ml-1">from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">87%</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Zap className="mr-1 h-3 w-3 text-green-500" />
                        <span className="text-green-500">+5%</span>
                        <span className="ml-1">from last week</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Daily Hours</h3>
                  <div className="space-y-3">
                    {dailyHoursData.map((day) => (
                      <div key={day.date} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{day.date}</span>
                          <span>{day.hours}h</span>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                                {Math.round((day.hours / 8) * 100)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex h-2 overflow-hidden text-xs bg-primary/10 rounded">
                            <div
                              style={{ width: `${Math.min((day.hours / 8) * 100, 100)}%` }}
                              className="flex flex-col justify-center text-center text-white bg-primary"
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Project Breakdown</h3>
                  <div className="space-y-3">
                    {timeDistributionData.map((project) => (
                      <div key={project.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: project.color }}></div>
                            <span>{project.name}</span>
                          </div>
                          <span>{project.value}h</span>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex h-2 overflow-hidden text-xs rounded">
                            <div
                              style={{
                                width: `${(project.value / totalHours) * 100}%`,
                                backgroundColor: project.color,
                              }}
                              className="flex flex-col justify-center text-center text-white"
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button>
                    <Award className="mr-2 h-4 w-4" /> Generate Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Time Tracking</CardTitle>
              <Dialog open={openAssignDialog} onOpenChange={setOpenAssignDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">Assign Task</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Assign Task to Team Member</DialogTitle>
                    <DialogDescription>Assign a task and allocate time to a team member</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-member">Team Member</Label>
                      <Select value={selectedMember} onValueChange={setSelectedMember}>
                        <SelectTrigger id="team-member">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.initials}</AvatarFallback>
                                </Avatar>
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assign-project">Project</Label>
                      <Select value={assignProject} onValueChange={setAssignProject}>
                        <SelectTrigger id="assign-project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: project.color }}
                                ></div>
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assign-task">Task</Label>
                      <Select value={assignTask} onValueChange={setAssignTask} disabled={!assignProject}>
                        <SelectTrigger id="assign-task">
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects
                            .find((p) => p.id === assignProject)
                            ?.tasks.map((task) => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assign-hours">Estimated Hours</Label>
                        <Input
                          id="assign-hours"
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={assignHours}
                          onChange={(e) => setAssignHours(Number.parseFloat(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assign-date">Due Date</Label>
                        <Input
                          id="assign-date"
                          type="date"
                          value={assignDate}
                          onChange={(e) => setAssignDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenAssignDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignTask}>Assign Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{member.name}</h3>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.initials}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">{member.name}</h4>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Hours Logged</p>
                                    <p className="font-medium">{member.hoursLogged}h</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Assigned Tasks</p>
                                    <p className="font-medium">{member.assignedTasks}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Current Tasks</h4>
                                  <div className="space-y-2">
                                    {projects
                                      .flatMap((project) =>
                                        project.tasks.slice(0, 2).map((task) => (
                                          <div key={task.id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                              <div
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{ backgroundColor: project.color }}
                                              ></div>
                                              <span>{task.name}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                              {project.name}
                                            </Badge>
                                          </div>
                                        )),
                                      )
                                      .slice(0, 3)}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedMember(member.id)
                                    setOpenAssignDialog(true)
                                  }}
                                >
                                  Assign Task
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Hours Logged</span>
                              <span>{member.hoursLogged}h / 40h</span>
                            </div>
                            <Progress value={(member.hoursLogged / 40) * 100} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Tasks Completed</span>
                              <span>
                                {Math.floor(member.assignedTasks * 0.7)} / {member.assignedTasks}
                              </span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedMember(member.id)
                            setOpenAssignDialog(true)
                          }}
                        >
                          Assign Task
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Workload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                            <h3 className="font-medium">{project.name}</h3>
                          </div>
                          <div className="space-y-2">
                            {project.tasks.slice(0, 2).map((task) => (
                              <div key={task.id} className="flex items-center justify-between rounded-lg border p-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{task.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {teamMembers.slice(0, 2).map((member, index) => (
                                    <Avatar key={member.id} className="h-6 w-6">
                                      <AvatarImage src={member.avatar} alt={member.name} />
                                      <AvatarFallback>{member.initials}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setAssignProject(project.id)
                                      setAssignTask(task.id)
                                      setOpenAssignDialog(true)
                                    }}
                                  >
                                    Assign
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

