import { create } from "zustand"
import { type User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { auth } from "../lib/firebase"

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<User | null>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      set({ user: result.user, error: null })
      return result.user
    } catch (error) {
      set({ error: (error as Error).message })
      return null
    }
  },
  logout: async () => {
    await signOut(auth)
    set({ user: null })
  },
  setUser: (user) => set({ user, loading: false }),
}))

