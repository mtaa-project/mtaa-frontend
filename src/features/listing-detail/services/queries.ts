import { useQuery } from "@tanstack/react-query"
import { apiGetSellerDetails } from "./api"
import type { ApiSellerContact } from "@/src/api/types"

export const useSellerContact = (sellerId?: number) => {
  return useQuery<ApiSellerContact>({
    // always pass an array, even if sellerId is undefined
    queryKey: ["seller", "contact", sellerId],
    queryFn: () => apiGetSellerDetails(sellerId!),
    enabled: sellerId != null,
  })
}
