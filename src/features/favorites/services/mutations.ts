import { apiAddToFavorites, apiRemoveFromFavorites } from "@/src/api/favorites"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateLikeListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: number) => {
      return apiAddToFavorites(listingId)
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["user", "favorites"],
      })
    },
  })
}

export const useRemoveLikeListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: number) => {
      return apiRemoveFromFavorites(listingId)
    },
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["user", "favorites"],
      })
    },
  })
}
