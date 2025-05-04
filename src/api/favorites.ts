import { api } from "../lib/axios-config"
import { ApiListingGet } from "./types"

export const apiAddToFavorites = async (listingId: number) => {
  return (await api.put<ApiListingGet>(`/listings/${listingId}/favorite`)).data
}

export const apiRemoveFromFavorites = async (listingId: number) => {
  return (await api.delete<ApiListingGet>(`/listings/${listingId}/favorite`))
    .data
}

export const apiGetFavoriteListings = async () => {
  return (await api.get<ApiListingGet[]>("/listings/favorites/my")).data
}

// TODO: UPDATE backend with pagination
export const apiGetFavoriteListingsPaginated = async (pageParam: number) => {
  const page = pageParam ?? 1
  return (
    await api.get<ApiListingGet[]>(
      `/listings/favorites/my?page=${pageParam + 1}&limit=${10}`
    )
  ).data
}
