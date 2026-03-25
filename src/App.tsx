import { useEffect, useState } from "react";
import { useTaskStore } from "./store/useTaskStore";
import { generateTasks } from "./data/generateTasks";

import KanbanView from "./views/Kanban/KanbanView";
import ListView from "./views/List/ListView";
import TimelineView from "./views/Timeline/TimelineView";
import FilterBar from "./components/FilterBar";
import { useFilterStore } from "./store/useFilterStore";

function App() {
  const setTasks = useTaskStore((state) => state.setTasks);
  const setFilters = useFilterStore((s) => s.setFilters);
  const setInitialized = useFilterStore((s) => s.setInitialized);

  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");

  //  Load tasks + restore filters from URL
  useEffect(() => {
    const tasks = generateTasks(500);
    setTasks(tasks);

    const params = new URLSearchParams(window.location.search);

    const getArray = (key: string) => {
      const value = params.get(key);
      return value ? value.split(",") : [];
    };

    setFilters({
      status: getArray("status"),
      priority: getArray("priority"),
      assignee: getArray("assignee"),
    });

    setInitialized(); 
  }, [setTasks, setFilters, setInitialized]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Project Tracker</h1>

      {/* Filters */}
      <FilterBar />

      {/*  View Switch Buttons (WITH ACTIVE STATE) */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setView("kanban")}
          className={`px-3 py-1 rounded ${
            view === "kanban"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Kanban
        </button>

        <button
          onClick={() => setView("list")}
          className={`px-3 py-1 rounded ${
            view === "list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          List
        </button>

        <button
          onClick={() => setView("timeline")}
          className={`px-3 py-1 rounded ${
            view === "timeline"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Views */}
      {view === "kanban" && <KanbanView />}
      {view === "list" && <ListView />}
      {view === "timeline" && <TimelineView />}
    </div>
  );
}

export default App;