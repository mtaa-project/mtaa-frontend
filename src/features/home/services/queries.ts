import { useQuery } from "@tanstack/react-query"

import {
  apiGetFavoriteListings,
  apiGetFavoriteListingsPaginated,
} from "@/src/api/favorites"

export const useUserFavoriteListings = () => {
  return useQuery({
    queryKey: ["user", "favorites"],
    queryFn: () => apiGetFavoriteListings(),
  })
}

export const useUserFavoriteListingsPaginated = (pageParam: number) => {
  return useQuery({
    queryKey: ["user", "favorites", pageParam],
    queryFn: () => apiGetFavoriteListingsPaginated(pageParam),
  })
}
