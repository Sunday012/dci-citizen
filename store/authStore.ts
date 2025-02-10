import { create } from "zustand"
import { type User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { auth } from "../lib/firebase"

interface AuthState {
  firebase_user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<User | null>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  isVerified: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebase_user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      set({ firebase_user: result.user, error: null })
      return result.user
    } catch (error) {
      set({ error: (error as Error).message })
      return null
    }
  },
  logout: async () => {
    await signOut(auth)
    set({ firebase_user: null })
  },
  setUser: (firebase_user) => set({ firebase_user, loading: false }),
  isVerified: () => {
    const user = get().firebase_user;
    return user ? user.emailVerified : false;
  }
}))

