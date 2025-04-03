import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function TimeTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Today</div>
              <div className="text-2xl font-bold">3h 45m</div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600">
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div>Weekly Goal (40h)</div>
              <div>18h 30m / 40h</div>
            </div>
            <Progress value={46} className="h-2" />
          </div>

          <div className="space-y-3 pt-2">
            <div className="text-sm font-medium">Recent Time Entries</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">Website Redesign</div>
                  <div className="text-xs text-gray-500">Design homepage mockup</div>
                </div>
                <div className="text-sm">1h 20m</div>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">Mobile App</div>
                  <div className="text-xs text-gray-500">User authentication</div>
                </div>
                <div className="text-sm">2h 25m</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

