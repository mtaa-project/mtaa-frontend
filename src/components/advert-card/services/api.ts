import { api } from "@/src/lib/axios-config"

export const apiDeleteAdvert = async (id: number) => {
  return (await api.delete(`/listings/${id}`)).data
}

export const apiShowAdvert = async (id: number) => {
  return (await api.put(`/listings/${id}/show`)).data
}

export const apiHideAdvert = async (id: number) => {
  return (await api.put(`/listings/${id}/hide`)).data
}
