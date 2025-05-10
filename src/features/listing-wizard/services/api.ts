import { type ApiListingGet } from "@/src/api/types"
import { api } from "@/src/lib/axios-config"

export const apiGetListingDetails = async (id: number) => {
  return (await api.get<ApiListingGet>(`listings/${id}`)).data
}

export const apiCreateListing = async (data: any) => {
  return (await api.post("/listings", data)).data
}

export const apiUpdateListing = async (data: any, id: number) => {
  return (await api.put(`/listings/${id}`, data)).data
}
