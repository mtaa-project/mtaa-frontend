// src/features/search-results/services/queries.ts

import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { apiGetListingsByQuery, apiGetAdvertListPaginated } from "./api"
import { ApiListingGet } from "@/src/api/types"

const SEARCH_LIMIT = 10

/**
 * 1) Simple Search — returns all results for a given query.
 */
export const useSearchListings = (query: string) =>
  useQuery<ApiListingGet[], Error>({
    queryKey: ["searchListings", query],
    queryFn: () => apiGetListingsByQuery(query),
    enabled: !!query, // only run when there’s a non-empty query
  })

// TODO: check if this is correct
/**
 * 2) Paginated Search — loads page by page (infinite scroll).
 */
export const useInfiniteSearchListings = (query: string) => {
  return useInfiniteQuery<ApiListingGet[], Error>({
    queryKey: ["searchListings", query, "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      apiGetAdvertListPaginated(query, (pageParam as number) ?? 0),
    // zero-based pages: start at 0, backend sees pageParam+1 => page 1
    // omit initialPageParam or explicitly set to 0
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  })
}
