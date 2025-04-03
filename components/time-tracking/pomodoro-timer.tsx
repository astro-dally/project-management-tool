"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Coffee, BrainCircuit, Bell, BellOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

interface TimerSettings {
  pomodoro: number
  shortBreak: number
  longBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  alarmSound: string
  alarmVolume: number
}

const defaultSettings: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  alarmSound: "bell",
  alarmVolume: 50,
}

const alarmSounds = {
  bell: "/sounds/bell.mp3",
  digital: "/sounds/digital.mp3",
  gentle: "/sounds/gentle.mp3",
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings)
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [muted, setMuted] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(alarmSounds.bell)
    audioRef.current.volume = settings.alarmVolume / 100

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update timer when settings or mode changes
  useEffect(() => {
    let duration = 0
    switch (mode) {
      case "pomodoro":
        duration = settings.pomodoro
        break
      case "shortBreak":
        duration = settings.shortBreak
        break
      case "longBreak":
        duration = settings.longBreak
        break
    }
    setTimeLeft(duration * 60)

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRunning(false)
  }, [mode, settings])

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!)
            timerRef.current = null
            handleTimerComplete()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning])

  // Update audio settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = alarmSounds[settings.alarmSound as keyof typeof alarmSounds]
      audioRef.current.volume = settings.alarmVolume / 100
    }
  }, [settings.alarmSound, settings.alarmVolume])

  const handleTimerComplete = () => {
    if (!muted && audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Error playing sound:", err))
    }

    if (mode === "pomodoro") {
      const newCompletedCount = completedPomodoros + 1
      setCompletedPomodoros(newCompletedCount)

      toast({
        title: "Pomodoro completed!",
        description: "Time for a break.",
        duration: 5000,
      })

      // Determine which break to take
      if (newCompletedCount % settings.longBreakInterval === 0) {
        setMode("longBreak")
        if (settings.autoStartBreaks) setIsRunning(true)
      } else {
        setMode("shortBreak")
        if (settings.autoStartBreaks) setIsRunning(true)
      }
    } else {
      // Break is complete
      toast({
        title: "Break completed!",
        description: "Ready to focus again?",
        duration: 5000,
      })

      setMode("pomodoro")
      if (settings.autoStartPomodoros) setIsRunning(true)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = (): number => {
    let totalSeconds = 0
    switch (mode) {
      case "pomodoro":
        totalSeconds = settings.pomodoro * 60
        break
      case "shortBreak":
        totalSeconds = settings.shortBreak * 60
        break
      case "longBreak":
        totalSeconds = settings.longBreak * 60
        break
    }
    return 100 - (timeLeft / totalSeconds) * 100
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    let duration = 0
    switch (mode) {
      case "pomodoro":
        duration = settings.pomodoro
        break
      case "shortBreak":
        duration = settings.shortBreak
        break
      case "longBreak":
        duration = settings.longBreak
        break
    }

    setTimeLeft(duration * 60)
    setIsRunning(false)
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pomodoro Timer</CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
            {muted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>Completed: {completedPomodoros} pomodoros</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pomodoro" className="flex items-center gap-1">
              <BrainCircuit className="h-4 w-4" /> Focus
            </TabsTrigger>
            <TabsTrigger value="shortBreak" className="flex items-center gap-1">
              <Coffee className="h-4 w-4" /> Short Break
            </TabsTrigger>
            <TabsTrigger value="longBreak" className="flex items-center gap-1">
              <Coffee className="h-4 w-4" /> Long Break
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-6xl font-bold tabular-nums">{formatTime(timeLeft)}</div>

          <Progress value={calculateProgress()} className="w-full h-2" />

          <div className="flex space-x-2">
            <Button
              onClick={toggleTimer}
              variant="default"
              className={cn(
                "w-24",
                mode === "pomodoro"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : mode === "shortBreak"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700",
              )}
            >
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <h3 className="font-medium">Timer Settings</h3>

            <div className="space-y-2">
              <Label>Pomodoro: {settings.pomodoro} minutes</Label>
              <Slider
                value={[settings.pomodoro]}
                min={1}
                max={60}
                step={1}
                onValueChange={(value) => updateSettings({ pomodoro: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <Label>Short Break: {settings.shortBreak} minutes</Label>
              <Slider
                value={[settings.shortBreak]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => updateSettings({ shortBreak: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <Label>Long Break: {settings.longBreak} minutes</Label>
              <Slider
                value={[settings.longBreak]}
                min={5}
                max={45}
                step={1}
                onValueChange={(value) => updateSettings({ longBreak: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <Label>Long Break Interval: Every {settings.longBreakInterval} pomodoros</Label>
              <Slider
                value={[settings.longBreakInterval]}
                min={2}
                max={8}
                step={1}
                onValueChange={(value) => updateSettings({ longBreakInterval: value[0] })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-break">Auto-start Breaks</Label>
              <Switch
                id="auto-break"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-pomodoro">Auto-start Pomodoros</Label>
              <Switch
                id="auto-pomodoro"
                checked={settings.autoStartPomodoros}
                onCheckedChange={(checked) => updateSettings({ autoStartPomodoros: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alarm-sound">Alarm Sound</Label>
              <Select value={settings.alarmSound} onValueChange={(value) => updateSettings({ alarmSound: value })}>
                <SelectTrigger id="alarm-sound">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="gentle">Gentle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Volume: {settings.alarmVolume}%</Label>
              <Slider
                value={[settings.alarmVolume]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => updateSettings({ alarmVolume: value[0] })}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? "Hide Settings" : "Show Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}

