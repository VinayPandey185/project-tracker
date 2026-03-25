import { useTaskStore } from "../../store/useTaskStore";
import { useFilterStore } from "../../store/useFilterStore";
import type { Task } from "../../types/task";

function TimelineView() {
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
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const dayWidth = 40;

  const getDaysDiff = (date: string) => {
    const d = new Date(date);
    return Math.floor(
      (d.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)
    );
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
    <div className="mt-4 overflow-x-auto border rounded p-4">
      <div className="relative min-w-[1400px]">
        {/* Today vertical line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-blue-500 z-10"
          style={{
            left: getDaysDiff(today.toISOString()) * dayWidth,
          }}
        />

        {/*  Tasks */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const start = task.startDate
              ? getDaysDiff(task.startDate)
              : getDaysDiff(task.dueDate);

            const end = getDaysDiff(task.dueDate);

            const width = Math.max((end - start + 1) * dayWidth, dayWidth);

            return (
              <div key={task.id} className="flex items-center">
                {/* Task title */}
                <div className="w-[180px] text-sm truncate pr-2">
                  {task.title}
                </div>

                {/* Timeline bar container */}
                <div className="relative flex-1 h-6 bg-gray-100 rounded">
                  <div
                    className={`absolute h-6 rounded ${getPriorityColor(
                      task.priority
                    )}`}
                    style={{
                      left: start * dayWidth,
                      width: width,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelineView;