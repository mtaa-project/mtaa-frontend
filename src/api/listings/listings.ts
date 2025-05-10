import { api } from "../../lib/axios-config"
import { type ApiListingGet } from "../types"

export const apiGetListingDetails = async (id: number) => {
  return (await api.get<ApiListingGet>(`listings/${id}`)).data
}
