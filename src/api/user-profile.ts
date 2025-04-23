import { api } from "../lib/axios-config"
import { UserProfile } from "./types"

export const apiGetUserProfileCard = async (
  userId?: number
): Promise<UserProfile> => {
  return (await api.get(`/profile/${userId ?? ""}`)).data
}

export const apiGetUserProfileAddress = async () => {
  return await api.get(`/users/address`)
}
