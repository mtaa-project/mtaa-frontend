import { UserProfileGet } from "@/src/api/types"
import { apiGetUserProfileCard } from "@/src/api/user-profile"
import { useQuery } from "@tanstack/react-query"

export const useUserProfile = (userId?: number) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => apiGetUserProfileCard(userId),
  })
}
