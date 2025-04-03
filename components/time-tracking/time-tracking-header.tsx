"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Search, Plus, BarChart2, Calendar, ListChecks, Timer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"

export function TimeTrackingHeader() {
  const [view, setView] = useState("entries")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    project: "",
    task: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    duration: "",
  })
  const [isManualDuration, setIsManualDuration] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setNewEntry((prev) => ({ ...prev, [field]: value }))

    // Calculate duration if both start and end times are set
    if (field === "startTime" || field === "endTime") {
      if (newEntry.startTime && value && field === "endTime") {
        const start = new Date(`2000-01-01T${newEntry.startTime}`)
        const end = new Date(`2000-01-01T${value}`)
        if (end > start) {
          const durationMs = end.getTime() - start.getTime()
          const hours = Math.floor(durationMs / (1000 * 60 * 60))
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
          setNewEntry((prev) => ({
            ...prev,
            duration: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
          }))
        }
      }
    }
  }

  const handleSubmit = () => {
    // Here you would typically save the time entry to your database
    console.log("Saving time entry:", newEntry)

    // Reset form and close dialog
    setNewEntry({
      project: "",
      task: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      duration: "",
    })
    setIsManualDuration(false)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4 pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground">Track and manage your time across projects and tasks</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search time entries..." className="w-full pl-8" />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
                <DialogDescription>Record time spent on a project or task</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select value={newEntry.project} onValueChange={(value) => handleInputChange("project", value)}>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website-redesign">Website Redesign</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                        <SelectItem value="data-migration">Data Migration</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task">Task</Label>
                    <Select value={newEntry.task} onValueChange={(value) => handleInputChange("task", value)}>
                      <SelectTrigger id="task">
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What did you work on?"
                    value={newEntry.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="manual-duration"
                        checked={isManualDuration}
                        onChange={() => setIsManualDuration(!isManualDuration)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="manual-duration">Enter duration manually</Label>
                    </div>
                  </div>
                </div>

                {isManualDuration ? (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hh:mm)</Label>
                    <Input
                      id="duration"
                      type="text"
                      placeholder="00:00"
                      value={newEntry.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newEntry.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newEntry.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {!isManualDuration && newEntry.duration && (
                  <div className="text-sm text-muted-foreground">
                    Calculated duration: <span className="font-medium">{newEntry.duration}</span>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="entries" value={view} onValueChange={setView} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="entries" className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" /> Entries
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" /> Reports
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center gap-1">
            <Timer className="h-4 w-4" /> Pomodoro
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="website-redesign">Website Redesign</SelectItem>
              <SelectItem value="mobile-app">Mobile App</SelectItem>
              <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
              <SelectItem value="data-migration">Data Migration</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Start Timer
          </Button>

          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}

