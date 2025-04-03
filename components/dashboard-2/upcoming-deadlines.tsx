import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock } from "lucide-react"

export default function UpcomingDeadlines() {
  const deadlines = [
    {
      id: 1,
      task: "Submit design mockups",
      project: "Website Redesign",
      date: "Apr 10, 2025",
      daysLeft: 2,
    },
    {
      id: 2,
      task: "Complete API integration",
      project: "Mobile App Development",
      date: "Apr 15, 2025",
      daysLeft: 7,
    },
    {
      id: 3,
      task: "Finalize marketing assets",
      project: "Marketing Campaign",
      date: "Apr 18, 2025",
      daysLeft: 10,
    },
    {
      id: 4,
      task: "Prepare presentation",
      project: "Product Launch",
      date: "Apr 25, 2025",
      daysLeft: 17,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-start">
              <CalendarClock className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">{deadline.task}</div>
                <div className="text-xs text-gray-500">{deadline.project}</div>
                <div className="text-xs mt-1 flex items-center">
                  <span className={`font-medium ${deadline.daysLeft <= 3 ? "text-red-500" : "text-gray-500"}`}>
                    {deadline.date}
                  </span>
                  <span className="mx-1">•</span>
                  <span className={`${deadline.daysLeft <= 3 ? "text-red-500" : "text-gray-500"}`}>
                    {deadline.daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

