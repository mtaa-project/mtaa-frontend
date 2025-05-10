import { useMutation, useQueryClient } from "@tanstack/react-query"

import { type UserProfileUpdate } from "@/src/api/types"

import { type UserProfileSchemaType } from "../components/user-details/form-schema"
import { apiUpdateUserProfile } from "./api"

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UserProfileSchemaType) => {
      const payload = {
        userMetadata: data.profileDetails,
        addressMetadata: data.address,
      } satisfies UserProfileUpdate
      return await apiUpdateUserProfile(payload)
    },
    onSuccess: (data) => {
      queryClient.resetQueries({ queryKey: ["user", "profile"] })
    },
  })
}
