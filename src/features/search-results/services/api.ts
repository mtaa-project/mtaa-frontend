import { ApiListingGet, ListingQueryParams } from "@/src/api/types"
import { api } from "@/src/lib/axios-config"

/**
 * The one-stop, everything-supported listing search.
 *
 * @param params – any combination of filters, paging, sorting, location, text search…
 */
export const apiGetListings = async (
  params: ListingQueryParams
): Promise<ApiListingGet[]> => {
  // axios will automatically skip `undefined` fields when serializing
  const { data } = await api.get<ApiListingGet[]>("/listings", {
    params,
  })
  return data
}
