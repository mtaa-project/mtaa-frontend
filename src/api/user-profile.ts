import { api } from "../lib/axios-config"
import { Review, UserProfile, UserProfileGet } from "./types"

export const apiGetUserProfileCard = async (userId?: number) => {
  return (await api.get<UserProfileGet>(`/profile/${userId ?? ""}`)).data
}

export const apiGetUserProfileAddress = async () => {
  return await api.get(`/users/address`)
}

export const apiGetUserReviews = async (userId: number): Promise<Review[]> => {
  return (await api.get(`/profile/${userId}/reviews`)).data
}
