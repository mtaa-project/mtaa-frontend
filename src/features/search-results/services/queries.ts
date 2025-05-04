// src/features/search-results/services/queries.ts

import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { apiGetListingsByQuery, apiGetAdvertListPaginated } from "./api"
import { ApiListingGet } from "@/src/api/types"

const SEARCH_LIMIT = 10

/**
 * 1) Simple Search — returns all results for a given query.
 */
export const useInfiniteSearchListings = (query: string) => {
  return useInfiniteQuery<ApiListingGet[], Error>({
    queryKey: ["searchListings", query, "infinite"],
    initialPageParam: 1,
    queryFn: ({ pageParam }: { pageParam: unknown }) =>
      apiGetAdvertListPaginated(query, pageParam as number),

    getNextPageParam: (lastPage, allPages) => {
      // if we got fewer than a full page, we know we're at the end
      if (lastPage.length < SEARCH_LIMIT) return undefined
      // otherwise ask for the *next* page (1-based)
      return allPages.length + 1
    },

    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  })
}
