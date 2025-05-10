import { api } from "../../../lib/axios-config"
import { type ApiCreateEdit, type ApiGet } from "../types/api-types"

export const apiCreateWatchdog = async (
  payload: ApiCreateEdit
): Promise<void> => {
  const { variant, ...body } = payload

  const response = await api.post("/alerts", body)
  return response.data
}

export const apiUpdateWatchdog = async (
  payload: ApiCreateEdit
): Promise<any> => {
  if (payload.variant === "edit") {
    const { variant, ...body } = payload
    const response = await api.put(`/alerts/my-alerts/${body.id}`, body)
    return response
  }
}

export const apiGetWatchdog = async (id: number): Promise<ApiGet> => {
  return (await api.get(`/alerts/my-alerts/${id}`)).data
}

export const apiRemoveWatchdog = async (id: number) => {
  return (await api.delete(`/alerts/${id}`)).data
}

export const apiEnableWatchdog = async (id: number) => {
  return (await api.put(`/alerts/${id}/enable`)).data
}

export const apiDisableWatchdog = async (id: number) => {
  return (await api.put(`/alerts/${id}/disable`)).data
}

export type WatchdogItem = {
  id: number
  search: string
  isActive: boolean
}

export const apiGetMyWatchdogList = async (): Promise<WatchdogItem[]> => {
  return (await api.get<WatchdogItem[]>("/alerts/my-alerts")).data
}

export const apiRegisterDeviceToken = async (deviceToken: string) => {
  return (
    await api.post("/alerts/my-alerts/register-device-token", {
      token: deviceToken,
    })
  ).data
}
