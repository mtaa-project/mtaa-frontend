import { type ApiSellerContact } from "@/src/api/types"
import { api } from "@/src/lib/axios-config"

export const apiGetSellerDetails = async (id: number) => {
  return (await api.get<ApiSellerContact>(`profile/${id}`)).data
}
