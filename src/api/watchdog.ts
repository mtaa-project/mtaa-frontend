import { AxiosResponse } from "axios"
import { api } from "../lib/axios-config"
import { OfferType, PriceRange } from "./types"

type WatchdogCreate = {
  devicePushToken: string
  search: string
  offerType: OfferType
  categoryIds: number[]
  salePrice?: PriceRange
  rentPrice?: PriceRange
}

type WatchdogGetResponse = {
  searchTerm: string
}

export const apiCreateWatchdog = async ({
  devicePushToken,
  search,
  offerType,
  categoryIds,
}: WatchdogCreate): Promise<void> => {
  const response = await api.post("/alerts", {
    devicePushToken: devicePushToken,
    search: search,
    offerType: offerType,
    categoryIds: categoryIds,
  })
  return response.data
}

export const apiRemoveWatchdog = async (id: number) => {
  const response = await api.delete(`/alerts/${id}`)
  return response.data
}

export const apiEnableWatchdog = async (id: number) => {
  return await api.post(`/alerts/${id}/enable`)
}
export const apiDisableWatchdog = async (id: number) => {
  return await api.post(`/alerts/${id}/disable`)
}

export type WatchdogItem = {
  id: number
  search_term: string
  isActive: boolean
}

export const apiGetMyWatchdogList = async (): Promise<WatchdogItem[]> => {
  const response = await api.get<WatchdogItem[]>("/alerts/my-alerts")
  return response.data
}
