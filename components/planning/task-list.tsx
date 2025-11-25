"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Clock, Trash2 } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  event_type: string
  start_time: string
  priority: string
  status: string
  category: string | null
}

interface TaskListProps {
  userId: string
  isReadOnly?: boolean
  maxTasks?: number
}

export function TaskList({ userId, isReadOnly = false, maxTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/events?type=task")
      if (response.ok) {
        const data = await response.json()
        setTasks(data.events)
      }
    } catch (error) {
      console.error("[v0] Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/events/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("[v0] Error updating task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/events/${taskId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("[v0] Error deleting task:", error)
    }
  }

  const filterTasks = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Checkbox
        checked={task.status === "completed"}
        onCheckedChange={(checked) => !isReadOnly && updateTaskStatus(task.id, checked ? "completed" : "pending")}
        className="mt-1"
        disabled={isReadOnly} // Disable editing in read-only mode
      />
      <div className="flex-1">
        <h4 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </h4>
        {task.description && <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>}
        <div className="mt-2 flex items-center gap-2">
          <Badge
            variant={task.priority === "high" || task.priority === "urgent" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {task.priority}
          </Badge>
          {task.category && (
            <Badge variant="outline" className="text-xs">
              {task.category}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(new Date(task.start_time), "MMM d, h:mm a")}
          </div>
        </div>
      </div>
      {!isReadOnly && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteTask(task.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  )

  const displayTasks = maxTasks ? tasks.slice(0, maxTasks) : tasks

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="all" className="flex-1">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending ({filterTasks("pending").length})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex-1">
              In Progress ({filterTasks("in-progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed ({filterTasks("completed").length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            <TabsContent value="all" className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading tasks...</p>
              ) : displayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              ) : (
                displayTasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3">
              {filterTasks("pending").map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-3">
              {filterTasks("in-progress").map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              {filterTasks("completed").map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}
