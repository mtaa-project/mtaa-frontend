import { ApiListingGet } from "@/src/api/types"
import { api } from "@/src/lib/axios-config"

/**
 * Fetch all listings matching `q`.
 */
export const apiGetListingsByQuery = async (
  q: string
): Promise<ApiListingGet[]> => {
  const response = await api.get<ApiListingGet[]>("/listings", {
    params: { search: q },
  })
  return response.data
}

/**
 * Fetch listings matching `q`, paginated.
 *
 * @param q – search term
 * @param pageParam – zero-based page index
 */
export const apiGetAdvertListPaginated = async (
  q: string,
  pageParam: number
): Promise<ApiListingGet[]> => {
  const response = await api.get<ApiListingGet[]>("/listings", {
    params: {
      search: q,
      page: pageParam,
      limit: 10,
    },
  })
  return response.data
}
