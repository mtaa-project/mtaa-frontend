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

export type WatchdogItem = {
  id: number
  search_term: string
}

export const apiGetMyWatchdogList = async (): Promise<WatchdogItem[]> => {
  const response = await api.get<WatchdogItem[]>("/alerts/my-alerts")
  return response.data
}
