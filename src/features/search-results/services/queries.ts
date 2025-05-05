// src/features/search-results/services/queries.ts
import { ApiListingGet, ListingQueryParams } from "@/src/api/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { apiGetListings } from "./api"
import { useMemo } from "react"

const DEFAULT_LIMIT = 20

function cleanParams(params: ListingQueryParams) {
  const cleaned: Record<string, any> = {}

  Object.entries(params).forEach(([key, value]) => {
    // drop undefined, null or empty‐string
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return
    }

    // flatten nested price_range objects:
    if (key === "price_range_rent" || key === "price_range_sale") {
      const range = value as { min?: number; max?: number }
      if (range.min != null) {
        cleaned[`${key}.min_price`] = range.min
      }
      if (range.max != null) {
        cleaned[`${key}.max_price`] = range.max
      }
      return
    }

    // arrays are fine (we’ll let our qs serializer handle them)
    cleaned[key] = value
  })

  return cleaned as ListingQueryParams
}

export function useInfiniteSearchListings(
  rawFilters: Omit<ListingQueryParams, "limit" | "offset">
) {
  const filters = cleanParams(rawFilters)

  /**
   * Turn the incoming filters object into a JSON string
   * so React-Query can build a stable key
   */
  const serialized = useMemo(
    () => JSON.stringify(filters),
    [
      filters.offer_type,
      filters.category_ids?.join(","),
      filters.price_range_rent?.min,
      filters.price_range_rent?.max,
      filters.price_range_sale?.min,
      filters.price_range_sale?.max,
      filters.min_rating,
      filters.time_from,
      filters.sort_by,
      filters.sort_order,
      filters.search,
      filters.country,
      filters.city,
      filters.street,
      filters.user_latitude,
      filters.user_longitude,
      filters.max_distance,
    ]
  )

  return useInfiniteQuery<ApiListingGet[], Error>({
    // pass the serialized filters into the key
    queryKey: ["searchListings", serialized],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      apiGetListings({
        ...filters,
        limit: DEFAULT_LIMIT,
        offset: typeof pageParam === "number" ? pageParam : 0,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < DEFAULT_LIMIT
        ? undefined
        : allPages.length * DEFAULT_LIMIT,
    // only run when the user has actually entered something
    enabled: !!filters.search,
    staleTime: 1000 * 60 * 5,
  })
}
