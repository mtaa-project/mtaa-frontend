import { type User } from "firebase/auth"
import { create } from "zustand"

interface UserStore {
  user: User | null
  setUser(user: User | null): void
  loading: boolean
  setLoading(loading: boolean): void
}

const useUserStore = create<UserStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set(() => ({ loading })),
  user: null,
  setUser: (user: User | null) => set(() => ({ user })),
}))

export default useUserStore
