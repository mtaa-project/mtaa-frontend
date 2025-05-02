import { apiGetUserProfileCard } from "@/src/api/user-profile"
import { useQuery } from "@tanstack/react-query"
import { apiGetUserReviews } from "./api"

export const useUserReviews = (userId?: number) => {
  return useQuery({
    queryKey: ["user", userId, "reviews"],
    queryFn: () => apiGetUserReviews(userId!),
    enabled: !!userId,
  })
}

export const useUserProfile = (userId?: number) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => apiGetUserProfileCard(userId),
  })
}
