import { apiGetMyWatchdogList, apiGetWatchdog } from "@/src/api/watchdog"
import { useQuery } from "@tanstack/react-query"
import { FilterSchemaType } from "../components/watchdog-modal/filter-schema"
import { apiGetCategories } from "@/src/api/categories"
import { OfferType } from "@/src/api/types"

export const useGetWatchdogList = () => {
  return useQuery({
    queryKey: ["watchdogs"],
    queryFn: apiGetMyWatchdogList,
  })
}

export const useGetWatchdog = (id?: number) => {
  return useQuery({
    queryKey: ["watchdog", id],
    queryFn: async (): Promise<FilterSchemaType> => {
      const data = await apiGetWatchdog(id!)

      const priceForSale = data.priceRangeSale ?? {}
      const priceForRent = data.priceRangeRent ?? {}

      const basePayload = {
        variant: "edit" as const,
        id: data.id,
        search: data.search,
        categoryIds: data.categoryIds ?? [],

        offerType: data.offerType,
        category: data.offerType,
      }

      return {
        ...basePayload,
        priceForSale,
        priceForRent,
      }
    },
    enabled: !!id,
  })
}

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: apiGetCategories,
  })
}
