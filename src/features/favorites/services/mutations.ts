import { apiAddToFavorites, apiRemoveFromFavorites } from "@/src/api/favorites"
import { ApiListingGet } from "@/src/api/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateLikeListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: number) => apiAddToFavorites(listingId),
    onMutate: async (listingId: number) => {
      await queryClient.cancelQueries({ queryKey: ["user", "favorites"] })
      const previous = queryClient.getQueryData<ApiListingGet[]>([
        "user",
        "favorites",
      ])

      // only update if favorite listings are already cached
      if (previous && previous.length) {
        queryClient.setQueryData<ApiListingGet[]>(
          ["user", "favorites"],
          (old = []) =>
            old.map((l) => (l.id === listingId ? { ...l, liked: true } : l))
        )
      }
      // return previous state so we can later do a rollback if an error occurs
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["user", "favorites"], ctx.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] })
    },
  })
}

export const useRemoveLikeListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (listingId: number) => apiRemoveFromFavorites(listingId),

    // This function will fire before the mutation function is
    // fired and is passed the same variables the mutation // function would receive
    onMutate: async (listingId: number) => {
      await queryClient.cancelQueries({ queryKey: ["user", "favorites"] })

      const previous = queryClient.getQueryData<ApiListingGet[]>([
        "user",
        "favorites",
      ])
      // optimistically update listings (remove desired listing from cache)
      queryClient.setQueryData<ApiListingGet[]>(
        ["user", "favorites"],
        (old) => old?.filter((l) => l.id !== listingId) ?? []
      )
      // return previous state so we can later do a rollback if an error occurs
      return { previous }
    },
    // Rollback
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user", "favorites"], context.previous)
      }
    },
    // silently reset cache
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "favorites"],
      })
    },
  })
}
