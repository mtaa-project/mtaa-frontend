import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiDeleteAdvert, apiHideAdvert, apiShowAdvert } from "./api"

export const useHideAdvert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiHideAdvert(id),
    onSuccess: (_, id) => {
      queryClient.resetQueries({ queryKey: ["favorites"] })
      queryClient.invalidateQueries({
        queryKey: ["listings", "details", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["searchListings"],
      })
      queryClient.invalidateQueries({
        queryKey: ["profile", "adverts"],
      })
    },
  })
}

export const useDeleteAdvert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiDeleteAdvert(id),
    onSuccess: (_, id) => {
      queryClient.resetQueries({ queryKey: ["favorites"] })
      queryClient.invalidateQueries({
        queryKey: ["listings", "details", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["searchListings"],
      })
      queryClient.invalidateQueries({
        queryKey: ["profile", "adverts"],
      })
    },
  })
}

export const useShowAdvert = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiShowAdvert(id),
    onSuccess: (_, id) => {
      queryClient.resetQueries({ queryKey: ["favorites"] })
      queryClient.invalidateQueries({
        queryKey: ["listings", "details", id],
      })
      queryClient.invalidateQueries({
        queryKey: ["searchListings"],
      })
      queryClient.invalidateQueries({
        queryKey: ["profile", "adverts"],
      })
    },
  })
}
