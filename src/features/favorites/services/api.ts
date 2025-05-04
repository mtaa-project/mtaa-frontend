import { ApiListingGet } from "@/src/api/types"

import { api } from "@/src/lib/axios-config"

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
