"use client"
import { useState, useRef } from "react";
import { Filter, Download, Search, Plus, X, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type TimeEntry = {
  id: string;
  date: string;
  project: string;
  task: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  notes: string;
  tags: string[];
  color: string;
  billable: boolean;
};

export function TimeEntries() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      date: "2023-08-01",
      project: "Website Redesign",
      task: "Design Homepage",
      startTime: "09:00",
      endTime: "11:30",
      duration: 9000, // 2.5 hours in seconds
      notes: "Completed initial wireframes",
      tags: ["design", "wireframes"],
      color: "#3b82f6",
      billable: true,
    },
    {
      id: "2",
      date: "2023-08-01",
      project: "Mobile App Development",
      task: "API Integration",
      startTime: "13:00",
      endTime: "15:45",
      duration: 9900, // 2.75 hours in seconds
      notes: "Connected user authentication endpoints",
      tags: ["api", "backend"],
      color: "#8b5cf6",
      billable: true,
    },
    {
      id: "3",
      date: "2023-08-02",
      project: "Marketing Campaign",
      task: "Content Creation",
      startTime: "10:15",
      endTime: "12:30",
      duration: 8100, // 2.25 hours in seconds
      notes: "Drafted social media posts",
      tags: ["content", "social"],
      color: "#10b981",
      billable: false,
    },
    {
      id: "4",
      date: "2023-08-02",
      project: "Website Redesign",
      task: "Team Meeting",
      startTime: "14:00",
      endTime: "15:00",
      duration: 3600, // 1 hour in seconds
      notes: "Discussed design feedback",
      tags: ["meeting", "feedback"],
      color: "#3b82f6",
      billable: false,
    },
    {
      id: "5",
      date: "2023-08-03",
      project: "Mobile App Development",
      task: "Bug Fixing",
      startTime: "09:30",
      endTime: "12:00",
      duration: 9000, // 2.5 hours in seconds
      notes: "Fixed login screen issues",
      tags: ["bugs", "frontend"],
      color: "#8b5cf6",
      billable: true,
    },
  ]);
  
  const [view, setView] = useState<"list" | "calendar" | "timeline">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<{start: string; end: string} | null>(null);
  const [filterBillable, setFilterBillable] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "duration" | "project">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<TimeEntry>>({
    date: new Date().toISOString().split('T')[0],
    tags: [],
    billable: false,
  });
  const [tagInput, setTagInput] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  // Get all unique projects
  const projects = Array.from(new Set(entries.map(entry => entry.project)));
  
  // Get all unique tags
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));
  
  // Filter entries
  const filteredEntries = entries.filter(entry => {
    // Search query
    if (searchQuery && !entry.task.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !entry.project.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.notes.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Project filter
    if (filterProject && entry.project !== filterProject) {
      return false;
    }
    
    // Tags filter
    if (filterTags.length > 0 && !filterTags.some(tag => entry.tags.includes(tag))) {
      return false;
    }
    
    // Date range filter
    if (filterDateRange) {
      const entryDate = new Date(entry.date);
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      
      if (entryDate < startDate || entryDate > endDate) {
        return false;
      }
    }
    
    // Billable filter
    if (filterBillable !== null && entry.billable !== filterBillable) {
      return false;
    }
    
    return true;
  });
  
  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date + "T" + a.startTime);
      const dateB = new Date(b.date + "T" + b.startTime);
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    } else if (sortBy === "duration") {
      return sortOrder === "asc" ? a.duration - b.duration : b.duration - a.duration;
    } else if (sortBy === "project") {
      return sortOrder === "asc" 
        ? a.project.localeCompare(b.project) 
        : b.project.localeCompare(a.project);
    }
    return 0;
  });
  
  // Group entries by date for calendar view
  const entriesByDate = sortedEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);
  
  // Calculate total duration
  const totalDuration = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);
  
  // Calculate billable duration
  const billableDuration = filteredEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + entry.duration, 0);
  
  // Handle delete entry
  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
    
    toast({
      title: "Entry deleted",
      description: "The time entry has been deleted successfully",
    });
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    setEntries(entries.filter(entry => !selectedEntries.includes(entry.id)));
    setSelectedEntries([]);
    
    toast({
      title: "Entries deleted",
      description: `${selectedEntries.length} entries have been deleted`,
    });
  };
  
  // Handle edit entry
  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };
  
  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingEntry) return;
    
    setEntries(entries.map(entry => 
      entry.id === editingEntry.id ? editingEntry : entry
    ));
    
    setIsEditDialogOpen(false);
    setEditingEntry(null);
    
    toast({
      title: "Entry updated",
      description: "The time entry has been updated successfully",
    });
  };
  
  // Handle create new entry
  const handleCreateEntry = () => {
    if (!newEntry.project || !newEntry.task || !newEntry.startTime || !newEntry.endTime || !newEntry.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate duration
    const startParts = newEntry.startTime.split(':').map(Number);
    const endParts = newEntry.endTime.split(':').map(Number);
    
    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    
    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60; // Next day
    }
    
    const duration = durationMinutes * 60; // Convert to seconds
    
    // Find project color
    const projectEntry = entries.find(entry => entry.project === newEntry.project);
    const color = projectEntry?.color || "#64748b";
    
    const createdEntry: TimeEntry = {
      id: (entries.length + 1).toString(),
      date: newEntry.date,
      project: newEntry.project,
      task: newEntry.task,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration,
      notes: newEntry.notes || "",
      tags: newEntry.tags || [],
      color,
      billable: newEntry.billable || false,
    };
    
    setEntries([createdEntry, ...entries]);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      tags: [],
      billable: false,
    });
    
    setIsNewEntryDialogOpen(false);
    
    toast({
      title: "Entry created",
      description: "The time entry has been created successfully",
    });
  };
  
  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, isNewEntry = false) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (isNewEntry) {
        const newTags = [...(newEntry.tags || [])];
        if (!newTags.includes(tagInput.trim())) {
          newTags.push(tagInput.trim());
          setNewEntry({
            ...newEntry,
            tags: newTags,
          });
        }
      } else if (editingEntry) {
        const newTags = [...editingEntry.tags];
        if (!newTags.includes(tagInput.trim())) {
          newTags.push(tagInput.trim());
          setEditingEntry({
            ...editingEntry,
            tags: newTags,
          });
        }
      }
      
      setTagInput("");
    }
  };
  
  // Remove tag
  const handleRemoveTag = (tag: string, isNewEntry = false) => {
    if (isNewEntry) {
      setNewEntry({
        ...newEntry,
        tags: newEntry.tags?.filter(t => t !== tag) || [],
      });
    } else if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        tags: editingEntry.tags.filter(t => t !== tag),
      });
    }
  };
  
  // Handle export
  const handleExport = () => {
    const dataToExport = filteredEntries.map(entry => ({
      Date: entry.date,
      Project: entry.project,
      Task: entry.task,
      StartTime: entry.startTime,
      EndTime: entry.endTime,
      Duration: formatDuration(entry.duration),
      Notes: entry.notes,
      Tags: entry.tags.join(", "),
      Billable: entry.billable ? "Yes" : "No",
    }));
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "time_entries.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Time entries have been exported as JSON",
    });
  };
  
  // Handle import
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Process imported file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        if (Array.isArray(importedData)) {
          // Map imported data to our format
          const newEntries = importedData.map((item, index) => {
            // Try to extract duration in seconds
            let durationSeconds = 0;
            if (typeof item.Duration === 'string') {
              const durationMatch = item.Duration.match(/(\d+)h\s*(\d+)m/);
              if (durationMatch) {
                const hours = Number.parseInt(durationMatch[1]);
                const minutes = Number.parseInt(durationMatch[2]);
                durationSeconds = (hours * 3600) + (minutes * 60);
              }
            }
            
            return {
              id: (entries.length + index + 1).toString(),
              date: item.Date || new Date().toISOString().split('T')[0],
              project: item.Project || "Imported Project",
              task: item.Task || "Imported Task",
              startTime: item.StartTime || "00:00",
              endTime: item.EndTime || "00:00",
              duration: durationSeconds || 0,
              notes: item.Notes || "",
              tags: typeof item.Tags === 'string' ? item.Tags.split(",").map((t: string) => t.trim()) : [],
              color: "#64748b",
              billable: item.Billable === "Yes" || item.Billable === true,
            };
          });
          
          setEntries([...newEntries, ...entries]);
          
          toast({
            title: "Import successful",
            description: `Imported ${newEntries.length} time entries`,
          });
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterProject(null);
    setFilterTags([]);
    setFilterDateRange(null);
    setFilterBillable(null);
    
    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Time Entries</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(value) => setView(value as any)} className="mr-2">
            <TabsList className="grid w-[240px] grid-cols-3">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" onClick={handleImport}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={handleFileChange}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search entries..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter Time Entries</h4>
                      
                      <div className="space-y-2">
                        <Label>Project</Label>
                        <Select 
                          value={filterProject || ""} 
                          onValueChange={(value) => setFilterProject(value || null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Projects" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Projects</SelectItem>
                            {projects.map(project => (
                              <SelectItem key={project} value={project}>{project}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {filterTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 rounded-full"
                                onClick={() => setFilterTags(filterTags.filter(t => t !== tag))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <Select 
                          value="" 
                          onValueChange={(value) => {
                            if (value && !filterTags.includes(value)) {
                              setFilterTags([...filterTags, value]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTags
                              .filter(tag => !filterTags.includes(tag))
                              .map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            type="date" 
                            value={filterDateRange?.start || ""}
                            onChange={(e) => setFilterDateRange({
                              start: e.target.value,
                              end: filterDateRange?.end || e.target.value,
                            })}
                          />
                          <Input 
                            type="date" 
                            value={filterDateRange?.end || ""}
                            onChange={(e) => setFilterDateRange({
                              start: filterDateRange?.start || e.target.value,
                              end: e.target.value,
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Billable Status</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="billable-all" 
                              checked={filterBillable === null}
                              onCheckedChange={() => setFilterBillable(null)}
                            />
                            <label htmlFor="billable-all" className="text-sm">All</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="billable-yes" 
                              checked={filterBillable === true}
                              onCheckedChange={() => setFilterBillable(true)}
                            />
                            <label htmlFor="billable-yes" className="text-sm">Billable</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="billable-no" 
                              checked={filterBillable === false}
                              onCheckedChange={() => setFilterBillable(false)}
                            />
                            <label htmlFor="billable-no" className="text-sm">Non-billable</label>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                        Reset Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => { setSortBy("date"); setSortOrder("desc"); }}
                      className={sortBy === "date" && sortOrder === "desc" ? "bg-accent" : ""}
                    >
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setSortBy("date"); setSortOrder("asc"); }}
                      className={sortBy === "date" && sortOrder === "asc" ? "bg-accent" : ""}
                    >
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => { setSortBy("duration"); setSortOrder("desc"); }}
                      className={sortBy === "duration" && sortOrder === "desc" ? "bg-accent" : ""}
                    >
                      Longest Duration
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setSortBy("duration"); setSortOrder("asc"); }}
                      className={sortBy === "duration" && sortOrder === "asc" ? "bg-accent" : ""}
                    >
                      Shortest Duration
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => { setSortBy("project"); setSortOrder("asc"); }}
                      className={sortBy === "project" && sortOrder === "asc" ? "bg-accent" : ""}
                    >
                      Project (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setSortBy("project"); setSortOrder("desc"); }}
                      className={sortBy === "project" && sortOrder === "desc" ? "bg-accent" : ""}
                    >
                      Project (Z-A)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex gap-2">
              {selectedEntries.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete Selected ({selectedEntries.length})
                </Button>
              )}
              
              <Dialog open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Time Entry</DialogTitle>
                    <DialogDescription>
                      Create a new time entry for your work
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-project">Project</Label>
                        <Select 
                          value={newEntry.project || ""} 
                          onValueChange={(value) => setNewEntry({ ...newEntry, project: value })}
                        >
                          <SelectTrigger id="new-project">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map(project => (
                              <SelectItem key={project} value={project}>{project}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-task">Task</Label>
                        <Input 
                          id="new-task" 
                          value={newEntry.task || ""} 
                          onChange={(e) => setNewEntry({ ...newEntry, task: e.target.value })}
                          placeholder="What did you work on?"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-date">Date</Label>
                        <Input 
                          id="new-date" 
                          type="date" 
                          value={newEntry.date || ""} 
                          onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-start-time">Start Time</Label>
                        <Input 
                          id="new-start-time" 
                          type="time" 
                          value={newEntry.startTime || ""} 
                          onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-end-time">End Time</Label>
                        <Input 
                          id="new-end-time" 
                          type="time" 
                          value={newEntry.endTime || ""} 
                          onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-notes">Notes</Label>
                      <Textarea 
                        id="new-notes" 
                        value={newEntry.notes || ""} 
                        onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                        placeholder="Add notes about your work"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-tags">Tags</Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {newEntry.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 rounded-full"
                              onClick={() => handleRemoveTag(tag, true)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <Input 
                        id="new-tags" 
                        placeholder="Add tags (press Enter to add)" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => handleTagInput(e, true)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="new-billable" 
                        checked={newEntry.billable || false}
                        onCheckedChange={(checked) => 
                          setNewEntry({ ...newEntry, billable: checked as boolean })
                        }
                      />
                      <Label htmlFor="new-billable">Billable</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewEntryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEntry}>
                      Save Entry
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="p-4">
          {view === "list" && (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <Card key={entry.id} className="flex flex-col md:flex-row items-center justify-between p-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <div>
                        <div className="font-medium">{entry.project}</div>
                        <div className="text-sm text-muted-foreground">{entry.task}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(entry.date)}</div>
                    <div className="text-sm text-muted-foreground">{formatDuration(entry.duration)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteEntry(entry.id)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {view === "calendar" && (
            <div className="text-center p-8 text-muted-foreground">
              Calendar view coming soon
            </div>
          )}
          {view === "timeline" && (
            <div className="text-center p-8 text-muted-foreground">
              Timeline view coming soon
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}