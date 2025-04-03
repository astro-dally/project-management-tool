"use client"

import type React from "react"

import { useState } from "react"
import { User, Bell, Moon, Sun, Clock, Shield, Palette, Laptop, LogOut, Save, Trash2, X, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

export function SettingsContent() {
  const { toast } = useToast()
  const [profileForm, setProfileForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Project Manager with 5+ years of experience in software development.",
    jobTitle: "Project Manager",
    company: "Acme Inc.",
    location: "New York, USA",
    website: "https://johndoe.com",
    avatar: "/placeholder.svg?height=128&width=128",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    emailDigest: "daily",
    notifyOnTaskAssigned: true,
    notifyOnTaskCompleted: true,
    notifyOnComments: true,
    notifyOnDueDates: true,
    notifyOnMentions: true,
    notifyOnProjectUpdates: true,
    notifyOnTeamChanges: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    fontSize: "medium",
    colorScheme: "green",
    reducedMotion: false,
    highContrast: false,
    sidebarCollapsed: false,
    denseMode: false,
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  })

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
    pomodoroEnabled: true,
    pomodoroWorkDuration: 25,
    pomodoroBreakDuration: 5,
    pomodoroLongBreakDuration: 15,
    pomodoroLongBreakInterval: 4,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
    passwordLastChanged: "2023-05-15",
    loginNotifications: true,
    trustedDevices: [
      { id: "1", name: "MacBook Pro", lastUsed: "2023-08-01", location: "New York, USA" },
      { id: "2", name: "iPhone 13", lastUsed: "2023-08-02", location: "New York, USA" },
    ],
  })

  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleNotificationSettingsUpdate = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleAppearanceSettingsUpdate = () => {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance preferences have been saved.",
    })
  }

  const handleTimeTrackingSettingsUpdate = () => {
    toast({
      title: "Time tracking settings updated",
      description: "Your time tracking preferences have been saved.",
    })
  }

  const handleSecuritySettingsUpdate = () => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "delete my account") {
      toast({
        title: "Error",
        description: "Please type 'delete my account' to confirm.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
    })

    setDeleteAccountDialogOpen(false)
  }

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  const handleRemoveTrustedDevice = (deviceId: string) => {
    setSecuritySettings({
      ...securitySettings,
      trustedDevices: securitySettings.trustedDevices.filter((device) => device.id !== deviceId),
    })

    toast({
      title: "Device removed",
      description: "The device has been removed from your trusted devices.",
    })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, we would upload the file to a server
      // For now, we'll just simulate it with a timeout
      toast({
        title: "Uploading avatar",
        description: "Please wait while we upload your avatar...",
      })

      setTimeout(() => {
        setProfileForm({
          ...profileForm,
          avatar: URL.createObjectURL(file),
        })

        toast({
          title: "Avatar uploaded",
          description: "Your avatar has been updated successfully.",
        })
      }, 1500)
    }
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <div className="flex justify-between items-center">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="time-tracking" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Time Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={profileForm.jobTitle}
                    onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture to personalize your account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profileForm.avatar} alt={profileForm.name} />
                  <AvatarFallback>
                    {profileForm.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <Button variant="outline" onClick={() => document.getElementById("avatar-upload")?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload New Picture
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Permanently delete your account and all of your data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm text-muted-foreground">
                        Please type <span className="font-medium">delete my account</span> to confirm.
                      </p>
                      <Input
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="delete my account"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Delivery Methods</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked,
                    })
                  }
                />
              </div>

              {notificationSettings.emailNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="email-digest">Email Digest Frequency</Label>
                  <Select
                    value={notificationSettings.emailDigest}
                    onValueChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailDigest: value,
                      })
                    }
                  >
                    <SelectTrigger id="email-digest">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Types</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-task-assigned">Task Assignments</Label>
                <Switch
                  id="notify-task-assigned"
                  checked={notificationSettings.notifyOnTaskAssigned}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnTaskAssigned: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-task-completed">Task Completions</Label>
                <Switch
                  id="notify-task-completed"
                  checked={notificationSettings.notifyOnTaskCompleted}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnTaskCompleted: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-comments">Comments</Label>
                <Switch
                  id="notify-comments"
                  checked={notificationSettings.notifyOnComments}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnComments: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-due-dates">Due Dates</Label>
                <Switch
                  id="notify-due-dates"
                  checked={notificationSettings.notifyOnDueDates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnDueDates: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-mentions">Mentions</Label>
                <Switch
                  id="notify-mentions"
                  checked={notificationSettings.notifyOnMentions}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnMentions: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-project-updates">Project Updates</Label>
                <Switch
                  id="notify-project-updates"
                  checked={notificationSettings.notifyOnProjectUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnProjectUpdates: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-team-changes">Team Changes</Label>
                <Switch
                  id="notify-team-changes"
                  checked={notificationSettings.notifyOnTeamChanges}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notifyOnTeamChanges: checked,
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Quiet Hours</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quiet-hours-enabled">Enable Quiet Hours</Label>
                  <p className="text-sm text-muted-foreground">Don't send notifications during specified hours</p>
                </div>
                <Switch
                  id="quiet-hours-enabled"
                  checked={notificationSettings.quietHoursEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      quietHoursEnabled: checked,
                    })
                  }
                />
              </div>

              {notificationSettings.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-start">Start Time</Label>
                    <Input
                      id="quiet-hours-start"
                      type="time"
                      value={notificationSettings.quietHoursStart}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          quietHoursStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-end">End Time</Label>
                    <Input
                      id="quiet-hours-end"
                      type="time"
                      value={notificationSettings.quietHoursEnd}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          quietHoursEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNotificationSettingsUpdate}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Appearance Tab */}
      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Theme</h3>
              <RadioGroup
                value={appearanceSettings.theme}
                onValueChange={(value) =>
                  setAppearanceSettings({
                    ...appearanceSettings,
                    theme: value,
                  })
                }
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  <Label
                    htmlFor="theme-light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Light</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  <Label
                    htmlFor="theme-dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Dark</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  <Label
                    htmlFor="theme-system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <Laptop className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">System</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Color Scheme</h3>
              <div className="grid grid-cols-3 gap-4">
                {["green", "blue", "violet", "rose", "orange", "slate"].map((color) => (
                  <div key={color}>
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="sr-only"
                      checked={appearanceSettings.colorScheme === color}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          colorScheme: color,
                        })
                      }
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className={`flex h-10 items-center justify-center rounded-md border-2 border-muted hover:bg-accent hover:text-accent-foreground ${
                        appearanceSettings.colorScheme === color ? "border-primary" : ""
                      }`}
                      style={{
                        backgroundColor:
                          color === "green"
                            ? "#10b981"
                            : color === "blue"
                              ? "#3b82f6"
                              : color === "violet"
                                ? "#8b5cf6"
                                : color === "rose"
                                  ? "#f43f5e"
                                  : color === "orange"
                                    ? "#f97316"
                                    : "#64748b",
                        color: "white",
                      }}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Text & Display</h3>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={appearanceSettings.fontSize}
                  onValueChange={(value) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      fontSize: value,
                    })
                  }
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={appearanceSettings.reducedMotion}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      reducedMotion: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={appearanceSettings.highContrast}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      highContrast: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dense-mode">Dense Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing to show more content</p>
                </div>
                <Switch
                  id="dense-mode"
                  checked={appearanceSettings.denseMode}
                  onCheckedChange={(checked) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      denseMode: checked,
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Language & Region</h3>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={appearanceSettings.language}
                  onValueChange={(value) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      language: value,
                    })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select
                  value={appearanceSettings.dateFormat}
                  onValueChange={(value) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      dateFormat: value,
                    })
                  }
                >
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select
                  value={appearanceSettings.timeFormat}
                  onValueChange={(value) =>
                    setAppearanceSettings({
                      ...appearanceSettings,
                      timeFormat: value,
                    })
                  }
                >
                  <SelectTrigger id="time-format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAppearanceSettingsUpdate}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Time Tracking Tab */}
      <TabsContent value="time-tracking">
        <Card>
          <CardHeader>
            <CardTitle>Time Tracking Settings</CardTitle>
            <CardDescription>Customize your time tracking preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Time Entry Settings</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="round-time-entries">Round Time Entries</Label>
                  <p className="text-sm text-muted-foreground">Round time entries to the nearest interval</p>
                </div>
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
                  <Label htmlFor="rounding-interval">Rounding Interval (minutes)</Label>
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
                <Label htmlFor="minimum-time-entry">Minimum Time Entry (minutes)</Label>
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
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Working Hours</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="working-hours-start">Start Time</Label>
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
                  <Label htmlFor="working-hours-end">End Time</Label>
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
                <Label>Working Days</Label>
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

              <div className="space-y-2">
                <Label htmlFor="auto-stop-at">Auto-stop Tracking At</Label>
                <Input
                  id="auto-stop-at"
                  type="time"
                  value={timeTrackingSettings.autoStopAt}
                  onChange={(e) =>
                    setTimeTrackingSettings({
                      ...timeTrackingSettings,
                      autoStopAt: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Automatically stop tracking at this time if you forget to stop it
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Idle Detection</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="idle-detection">Enable Idle Detection</Label>
                  <p className="text-sm text-muted-foreground">Detect when you're away from your computer</p>
                </div>
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
                  <Label htmlFor="idle-threshold">Idle Threshold (minutes)</Label>
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

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Pomodoro Timer</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pomodoro-enabled">Enable Pomodoro Timer</Label>
                  <p className="text-sm text-muted-foreground">Use the Pomodoro technique for focused work sessions</p>
                </div>
                <Switch
                  id="pomodoro-enabled"
                  checked={timeTrackingSettings.pomodoroEnabled}
                  onCheckedChange={(checked) =>
                    setTimeTrackingSettings({
                      ...timeTrackingSettings,
                      pomodoroEnabled: checked,
                    })
                  }
                />
              </div>

              {timeTrackingSettings.pomodoroEnabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pomodoro-work-duration">Work Duration (minutes)</Label>
                      <Input
                        id="pomodoro-work-duration"
                        type="number"
                        min="1"
                        max="60"
                        value={timeTrackingSettings.pomodoroWorkDuration}
                        onChange={(e) =>
                          setTimeTrackingSettings({
                            ...timeTrackingSettings,
                            pomodoroWorkDuration: Number.parseInt(e.target.value) || 25,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pomodoro-break-duration">Break Duration (minutes)</Label>
                      <Input
                        id="pomodoro-break-duration"
                        type="number"
                        min="1"
                        max="30"
                        value={timeTrackingSettings.pomodoroBreakDuration}
                        onChange={(e) =>
                          setTimeTrackingSettings({
                            ...timeTrackingSettings,
                            pomodoroBreakDuration: Number.parseInt(e.target.value) || 5,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pomodoro-long-break-duration">Long Break Duration (minutes)</Label>
                      <Input
                        id="pomodoro-long-break-duration"
                        type="number"
                        min="1"
                        max="60"
                        value={timeTrackingSettings.pomodoroLongBreakDuration}
                        onChange={(e) =>
                          setTimeTrackingSettings({
                            ...timeTrackingSettings,
                            pomodoroLongBreakDuration: Number.parseInt(e.target.value) || 15,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pomodoro-long-break-interval">Sessions Before Long Break</Label>
                      <Input
                        id="pomodoro-long-break-interval"
                        type="number"
                        min="1"
                        max="10"
                        value={timeTrackingSettings.pomodoroLongBreakInterval}
                        onChange={(e) =>
                          setTimeTrackingSettings({
                            ...timeTrackingSettings,
                            pomodoroLongBreakInterval: Number.parseInt(e.target.value) || 4,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleTimeTrackingSettingsUpdate}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Account Security</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({
                      ...securitySettings,
                      twoFactorEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Select
                  value={securitySettings.sessionTimeout.toString()}
                  onValueChange={(value) =>
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Automatically log out after this period of inactivity</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="login-notifications">Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new logins to your account</p>
                </div>
                <Switch
                  id="login-notifications"
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({
                      ...securitySettings,
                      loginNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Button variant="outline">Change Password</Button>
                <p className="text-xs text-muted-foreground">
                  Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Trusted Devices</h3>
              <p className="text-sm text-muted-foreground">Devices that are currently logged in to your account</p>

              <div className="space-y-3">
                {securitySettings.trustedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last used: {new Date(device.lastUsed).toLocaleDateString()} • {device.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveTrustedDevice(device.id)}>
                      <X className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data & Privacy</h3>

              <div className="space-y-2">
                <Button variant="outline">Download My Data</Button>
                <p className="text-xs text-muted-foreground">Download a copy of all your data in JSON format</p>
              </div>

              <div className="space-y-2">
                <Button variant="outline">View Privacy Policy</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSecuritySettingsUpdate}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

