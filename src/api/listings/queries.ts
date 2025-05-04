import { useQuery } from "@tanstack/react-query"
import { apiGetListingDetails } from "./listings"

export const useListingDetails = (id?: number) => {
  return useQuery({
    queryKey: ["listings", "details", id],
    queryFn: () => apiGetListingDetails(id!),
    enabled: !!id,
  })
}
