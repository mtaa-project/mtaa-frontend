import { api } from "../lib/axios-config"
import { ApiListingGet } from "./types"

export const apiAddToFavorites = async (listingId: number) => {
  return (await api.put<ApiListingGet>(`/listings/${listingId}/favorite`)).data
}

export const apiRemoveFromFavorites = async (listingId: number) => {
  return (await api.delete<ApiListingGet>(`/listings/${listingId}/favorite`))
    .data
}
