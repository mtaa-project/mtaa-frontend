import {
  Advert,
  Review,
  UserProfileGet,
  UserProfileUpdate,
} from "@/src/api/types"
import { api } from "@/src/lib/axios-config"

export const apiGetAdvertList = async (): Promise<Advert[]> => {
  return (await api.get("/listings/my-listings")).data
}

type Props = {
  pageParam: number
}

export const apiGetUserReviews = async (userId: number): Promise<Review[]> => {
  return (await api.get(`/profile/${userId}/reviews`)).data
}

export const apiGetAdvertListPaginated = async ({ pageParam }: Props) => {
  const page = pageParam ?? 1
  return (
    await api.get<Advert[]>(
      `/listings/my-listings?page=${pageParam + 1}&limit=${10}`
    )
  ).data
}

export const apiGetUserProfile = async () => {
  return (await api.get<UserProfileGet>("/profile")).data
}

export const apiUpdateUserProfile = async (payload: UserProfileUpdate) => {
  return (await api.put<UserProfileUpdate>("/profile", payload)).data
}
