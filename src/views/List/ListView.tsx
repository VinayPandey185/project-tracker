import { useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import { useFilterStore } from "../../store/useFilterStore";
import type { Task } from "../../types/task";

type SortField = "title" | "priority" | "dueDate";

function ListView() {
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
  const updateTask = useTaskStore((state) => state.updateTask);

  const rowHeight = 50;
  const containerHeight = 500;

  const [scrollTop, setScrollTop] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
  let valA: any = a[sortField];
  let valB: any = b[sortField];

  if (sortField === "title") {
    valA = parseInt(a.title.replace("Task ", ""));
    valB = parseInt(b.title.replace("Task ", ""));
  }

  if (sortField === "dueDate") {
    valA = new Date(a.dueDate).getTime();
    valB = new Date(b.dueDate).getTime();
  }

  if (sortField === "priority") {
    const order = ["critical", "high", "medium", "low"];
    valA = order.indexOf(a.priority);
    valB = order.indexOf(b.priority);
  }

  if (valA < valB) return sortOrder === "asc" ? -1 : 1;
  if (valA > valB) return sortOrder === "asc" ? 1 : -1;
  return 0;
});
  // Virtual scroll logic
  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(containerHeight / rowHeight);

  const visibleTasks = sortedTasks.slice(
    startIndex,
    startIndex + visibleCount + 5
  );

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div
      className="mt-4 border rounded h-[500px] overflow-auto"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <table className="w-full text-sm">
        {/* Header */}
        <thead className="sticky top-0 bg-gray-200">
          <tr>
            <th
              className="p-2 text-left cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title {sortField === "title" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("priority")}
            >
              Priority {sortField === "priority" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            <th className="p-2">Assignee</th>

            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("dueDate")}
            >
              Due Date {sortField === "dueDate" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>

            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {/* Top spacer */}
          <tr style={{ height: startIndex * rowHeight }} />

          {/* Rows */}
          {visibleTasks.map((task: Task) => (
            <tr key={task.id} className="border-t h-[50px]">
              <td className="p-2">{task.title}</td>

              <td className="p-2">
                <span
                    className={`px-2 py-0.5 rounded text-white text-xs ${
                    task.priority === "low"
                    ? "bg-green-500"
                    : task.priority === "medium"
                    ? "bg-yellow-500"
                    : task.priority === "high"
                    ? "bg-orange-500"
                    : "bg-red-500"
            }`}
            >
                {task.priority}
            </span>
        </td>

              <td className="p-2">{task.assignee}</td>

              <td className="p-2">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>

              {/* Inline Status Change */}
              <td className="p-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTask(task.id, {
                      status: e.target.value as Task["status"],
                    })
                  }
                  className="border rounded px-1"
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </td>
            </tr>
          ))}

          {/* Bottom spacer */}
          <tr
            style={{
              height:
                (sortedTasks.length - (startIndex + visibleTasks.length)) *
                rowHeight,
            }}
          />
        </tbody>
      </table>
    </div>
  );
}

export default ListView;