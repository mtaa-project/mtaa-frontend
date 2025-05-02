import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiUpdateUserProfile } from "./api"
import { UserProfileUpdate } from "@/src/api/types"
import { UserProfileSchemaType } from "./components/user-details/form-schema"

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
