import { useQuery } from "@tanstack/react-query"
import { apiGetAdvertList, apiGetAdvertListPaginated } from "../api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Advert } from "@/src/api/types"

export const useAdvertList = () => {
  return useQuery({
    queryKey: ["profile", "adverts"],
    queryFn: () => apiGetAdvertList(),
  })
}

// src/features/profile/advert-list/queries.ts

export const useAdvertListInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["profile", "adverts"],
    queryFn: apiGetAdvertListPaginated,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
    // getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    //   if (firstPageParam <= 1) {
    //     return undefined
    //   }
    //   return firstPageParam - 1
    // },
    staleTime: 1000 * 60 * 5,
  })
}
