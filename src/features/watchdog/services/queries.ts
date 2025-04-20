import { apiGetMyWatchdogList, apiGetWatchdog } from "@/src/api/watchdog"
import { useQuery } from "@tanstack/react-query"
import { FilterSchemaType } from "../components/watchdog-modal/filter-schema"
import { apiGetCategories } from "@/src/api/categories"

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
      return {
        variant: "edit",
        id: data.id,
        search: data.search,
        offerType: data.offerType,
        category: data.offerType,
        categoryIds: data.categoryIds,
        // TODO: add as a required in the database
        searchForRent: false,
        searchForSale: false,
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
