import { Review } from "@/src/api/types"
import { apiGetUserReviews } from "@/src/api/user-profile"
import { useQuery } from "@tanstack/react-query"

export const useUserReviews = (userId?: number) => {
  return useQuery({
    queryKey: ["user", userId, "reviews"],
    queryFn: () => apiGetUserReviews(userId!),
    enabled: !!userId,
  })
}
