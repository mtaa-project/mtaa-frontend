import { useQuery } from "@tanstack/react-query"

import { apiGetUserProfileCard } from "@/src/api/user-profile"

import { apiGetUserReviews } from "./api"

export const useUserReviews = (userId?: number) => {
  return useQuery({
    queryKey: ["user", userId, "reviews"],
    queryFn: () => apiGetUserReviews(userId!),
    enabled: !!userId,
  })
}

export const useUserProfile = (
  userId?: number,
  currentUser: boolean = false
) => {
  return useQuery({
    queryKey: currentUser ? ["user", "profile"] : ["user", userId, "profile"],
    queryFn: () => apiGetUserProfileCard(userId),
    enabled: currentUser ? true : !!userId,
  })
}
