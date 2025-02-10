import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  user_id?: string;
  full_name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  role?: string;
}

interface Case {
  id: string
  summary: string
  date: string
  time: string
  location: string
  status: "in progress" | "resolved" | "closed"
  statusUpdateTime?: number
}

interface StoreState {
  user: User | null
  cases: Record<string, Case>
  token: string | null
  setToken: (token: string) => void
  setUser: (user: User | null) => void
  signOut: () => void
  getCase: (id: string) => Promise<Case | null>
  updateCaseStatus: (id: string, status: Case["status"]) => void
}

// Mock case data
const mockCases: Record<string, Case> = {
  GHb7858: {
    id: "GHb7858",
    summary:
      "On 24 January 2025 at approximately 14:00 hours, the victim, Mary Njeri, was at her shop located at 456 Market Street, Nairobi, when two male suspects entered the premises. Suspect #1 brandished a firearm and demanded cash and valuables. Suspect #2 acted as a lookout near the entrance. The suspects forced the victim to open the cash register and took approximately 50,000 Kenyan Shillings in cash and various items of jewelry. The suspects then fled the scene on foot heading east on Market Street.",
    date: "24 January 2025",
    time: "14:00",
    location: "456 Market Street, Nairobi",
    status: "in progress",
    statusUpdateTime: Date.now(),
  },
}

export const userStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      cases: mockCases,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      signOut: () => set({ user: null }),
      getCase: async (id: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return get().cases[id] || null
      },
      updateCaseStatus: (id: string, status: Case["status"]) => {
        set((state) => ({
          cases: {
            ...state.cases,
            [id]: {
              ...state.cases[id],
              status,
              statusUpdateTime: Date.now(),
            },
          },
        }))
      },
    }),
    {
      name: "user-storage",
    },
  ),
)

