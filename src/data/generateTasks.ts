import type { Task, Status, Priority } from "../types/task";

const statuses: Status[] = ["todo", "inprogress", "review", "done"];
const priorities: Priority[] = ["low", "medium", "high", "critical"];
const assignees = ["A", "B", "C", "D", "E", "F"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function generateTasks(count = 500): Task[] {
  const today = new Date();

  return Array.from({ length: count }, (_, i) => {
    const dueDate = randomDate(
      new Date(today.getFullYear(), today.getMonth(), 1),
      new Date(today.getFullYear(), today.getMonth() + 1, 0)
    );

    const hasStartDate = Math.random() > 0.2;

    const startDate = hasStartDate
      ? randomDate(
          new Date(today.getFullYear(), today.getMonth(), 1),
          dueDate
        )
      : undefined;

    return {
      id: `task-${i}`,
      title: `Task ${i + 1}`,
      status: randomItem(statuses),
      priority: randomItem(priorities),
      assignee: randomItem(assignees),
      startDate: startDate?.toISOString(),
      dueDate: dueDate.toISOString(),
    };
  });
}