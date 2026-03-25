import { create } from "zustand";
import type { Task } from "../types/task";

type TaskStore = {
  tasks: Task[];
  draggedTask: Task | null;

  setTasks: (tasks: Task[]) => void;
  setDraggedTask: (task: Task | null) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  draggedTask: null,

  setTasks: (tasks) => set({ tasks }),

  setDraggedTask: (task) => set({ draggedTask: task }),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
}));