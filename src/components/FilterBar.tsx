import { useFilterStore } from "../store/useFilterStore";
import { useEffect } from "react";

const statuses = ["todo", "inprogress", "review", "done"];
const priorities = ["low", "medium", "high", "critical"];
const assignees = ["A", "B", "C", "D", "E", "F"];

function FilterBar() {
  const {
    filters,
    setFilters,
    clearFilters,
    isInitialized,
  } = useFilterStore();

  // Update URL ONLY after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();

    if (filters.status.length)
      params.set("status", filters.status.join(","));

    if (filters.priority.length)
      params.set("priority", filters.priority.join(","));

    if (filters.assignee.length)
      params.set("assignee", filters.assignee.join(","));

    const query = params.toString();
    const newUrl =
      window.location.pathname + (query ? `?${query}` : "");

    window.history.replaceState(null, "", newUrl);
  }, [filters, isInitialized]);

  const toggle = (key: keyof typeof filters, value: string) => {
    const current = filters[key];

    if (current.includes(value)) {
      setFilters({
        [key]: current.filter((v) => v !== value),
      });
    } else {
      setFilters({
        [key]: [...current, value],
      });
    }
  };

  const hasFilters =
    filters.status.length ||
    filters.priority.length ||
    filters.assignee.length;

  return (
    <div className="mt-4 p-3 border rounded flex flex-wrap gap-3">
      {/* Status */}
      <div>
        <div className="text-sm font-semibold">Status</div>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => toggle("status", s)}
            className={`px-2 py-1 m-1 rounded ${
              filters.status.includes(s)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Priority */}
      <div>
        <div className="text-sm font-semibold">Priority</div>
        {priorities.map((p) => (
          <button
            key={p}
            onClick={() => toggle("priority", p)}
            className={`px-2 py-1 m-1 rounded ${
              filters.priority.includes(p)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Assignee */}
      <div>
        <div className="text-sm font-semibold">Assignee</div>
        {assignees.map((a) => (
          <button
            key={a}
            onClick={() => toggle("assignee", a)}
            className={`px-2 py-1 m-1 rounded ${
              filters.assignee.includes(a)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => {
            clearFilters();
            window.history.replaceState(
              null,
              "",
              window.location.pathname
            );
          }}
          className="ml-auto bg-red-500 text-white px-3 py-1 rounded"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;