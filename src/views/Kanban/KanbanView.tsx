import { useTaskStore } from "../../store/useTaskStore";
import type { Task } from "../../types/task";
import { useFilterStore } from "../../store/useFilterStore";
import { useState } from "react";

const columns = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "review", title: "In Review" },
  { key: "done", title: "Done" },
];

function KanbanView() {
  const allTasks = useTaskStore((state) => state.tasks);
const filters = useFilterStore((s) => s.filters);

const tasks = allTasks.filter((task) => {
  return (
    (filters.status.length === 0 ||
      filters.status.includes(task.status)) &&
    (filters.priority.length === 0 ||
      filters.priority.includes(task.priority)) &&
    (filters.assignee.length === 0 ||
      filters.assignee.includes(task.assignee))
  );
});
  const draggedTask = useTaskStore((state) => state.draggedTask);
  const setDraggedTask = useTaskStore((state) => state.setDraggedTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const formatDueDate = (date: string) => {
    const today = new Date();
    const due = new Date(date);

    const diff = Math.floor(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 0) return "Due Today";
    if (diff > 7) return `${diff} days overdue`;

    return due.toLocaleDateString();
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {columns.map((col) => {
        const colTasks = getTasksByStatus(col.key as Task["status"]);

        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setActiveColumn(col.key);
            }}
            onDrop={() => {
              if (draggedTask) {
                updateTask(draggedTask.id, {
                  status: col.key as Task["status"],
                });
              }
              setActiveColumn(null);
            }}
            className={`p-3 rounded-lg h-[500px] flex flex-col transition ${
              activeColumn === col.key ? "bg-blue-200" : "bg-gray-100"
            }`}
          >
            {/* Header */}
            <div className="font-semibold mb-2 flex justify-between">
              <span>{col.title}</span>
              <span>{colTasks.length}</span>
            </div>

            {/* Task list */}
            <div className="overflow-y-auto space-y-2 flex-1">
              {colTasks.length === 0 ? (
                <div className="text-gray-400 text-sm text-center mt-4">
                  No tasks
                </div>
              ) : (
                colTasks.map((task: Task) => {
                  const isDragging = draggedTask?.id === task.id;

                  // Placeholder while dragging
                  if (isDragging) {
                    return (
                      <div
                        key={task.id}
                        className="bg-gray-300 rounded h-[90px]"
                      />
                    );
                  }

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedTask(task)}
                      onDragEnd={() => setDraggedTask(null)}
                      className="bg-white p-3 rounded shadow text-sm space-y-2 cursor-grab hover:shadow-md active:cursor-grabbing"
                    >
                      {/* Title */}
                      <div className="font-medium">{task.title}</div>

                      {/* Assignee + Priority */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                          {task.assignee}
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-white text-xs ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div className="text-xs text-gray-500">
                        {formatDueDate(task.dueDate)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanView;