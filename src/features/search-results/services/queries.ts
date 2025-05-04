// src/features/search-results/services/queries.ts
import { ApiListingGet, ListingQueryParams } from "@/src/api/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { apiGetListings } from "./api"
import { useMemo } from "react"

const DEFAULT_LIMIT = 20

export function useInfiniteSearchListings(
  filters: Omit<ListingQueryParams, "limit" | "offset">
) {
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
