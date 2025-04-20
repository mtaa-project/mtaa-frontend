import { AxiosResponse } from "axios"
import { api } from "../lib/axios-config"
import { Category, OfferType, PriceRange } from "./types"

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

type WatchdogCategories = {
  selected: Category[]
  notSelected: Category[]
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

type WatchdogUpdate = {
  id: number
  devicePushToken: string
  search: string
  offerType: OfferType
  categoryIds: number[]
  salePrice?: PriceRange
  rentPrice?: PriceRange
}

export const apiUpdateWatchdog = async ({
  id,
  devicePushToken,
  search,
  offerType,
  categoryIds,
}: WatchdogUpdate): Promise<void> => {
  const response = await api.put(`/alerts/${id}`, {
    devicePushToken: devicePushToken,
    search: search,
    offerType: offerType,
    categoryIds: categoryIds,
  })
  return response.data
}

export type GetWatchdogDetailed = {
  searchTerm: string
  offerType: OfferType
  categories: WatchdogCategories
  isActive: boolean
}

export const apiGetWatchdog = async (
  id: number
): Promise<GetWatchdogDetailed> => {
  const response = await api.get(`/alerts/my-alerts/${id}`)
  return response.data
}

export const apiRemoveWatchdog = async (id: number) => {
  const response = await api.delete(`/alerts/${id}`)
  return response.data
}

export const apiEnableWatchdog = async (id: number) => {
  const response = await api.post(`/alerts/${id}/enable`)
  return response.data
}

export const apiDisableWatchdog = async (id: number) => {
  const response = await api.post(`/alerts/${id}/disable`)
  return response.data
}

export type WatchdogItem = {
  id: number
  searchTerm: string
  isActive: boolean
}

export const apiGetMyWatchdogList = async (): Promise<WatchdogItem[]> => {
  const response = await api.get<WatchdogItem[]>("/alerts/my-alerts")
  return response.data
}
