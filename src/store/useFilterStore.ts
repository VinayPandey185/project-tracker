import { create } from "zustand";

type Filters = {
  status: string[];
  priority: string[];
  assignee: string[];
};

type FilterStore = {
  filters: Filters;
  isInitialized: boolean;
  setFilters: (filters: Partial<Filters>) => void;
  setInitialized: () => void;
  clearFilters: () => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {
    status: [],
    priority: [],
    assignee: [],
  },
  isInitialized: false,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setInitialized: () => set({ isInitialized: true }),

  clearFilters: () =>
    set({
      filters: {
        status: [],
        priority: [],
        assignee: [],
      },
    }),
}));