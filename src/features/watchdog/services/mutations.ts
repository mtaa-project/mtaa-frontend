import {
  apiCreateWatchdog,
  apiDisableWatchdog,
  apiEnableWatchdog,
  apiRemoveWatchdog,
  apiUpdateWatchdog,
} from "@/src/api/watchdog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FilterSchemaType } from "../components/watchdog-modal/filter-schema"
import { useNotification } from "@/src/context/NotificationContext"
import { ApiCreateEdit } from "../types/apiTypes"

export const useCreateWatchdog = () => {
  const { expoPushToken } = useNotification()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FilterSchemaType) => {
      if (data.variant === "create") {
        const payload = {
          categoryIds: data.categoryIds,
          devicePushToken: expoPushToken ?? "",
          search: data.search,
          offerType: data.offerType,
          variant: "create",
        } satisfies ApiCreateEdit
        await apiCreateWatchdog(payload)
      }
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["watchdogs"] })
    },
  })
}

export const useUpdateWatchdog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FilterSchemaType) => {
      if (data.variant !== "edit") return

      const payload = {
        id: data.id,
        categoryIds: data.categoryIds,
        search: data.search,
        offerType: data.offerType,
        variant: "edit",
      } satisfies ApiCreateEdit
      await apiUpdateWatchdog(payload)
    },
    onSuccess: async (_, variables) => {
      if (variables.variant === "edit") {
        await queryClient.invalidateQueries({ queryKey: ["watchdogs"] })
        await queryClient.invalidateQueries({
          queryKey: ["watchdog", variables.id],
        })
      }
    },
  })
}

export const useRemoveWatchdog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => apiRemoveWatchdog(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["watchdogs"] })
      await queryClient.invalidateQueries({ queryKey: ["watchdog", id] })
    },
  })
}

export const useDisableWatchdog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => await apiDisableWatchdog(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["watchdogs"] })
      await queryClient.invalidateQueries({ queryKey: ["watchdog", id] })
    },
  })
}

export const useEnableWatchdog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => await apiEnableWatchdog(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ["watchdogs"] })
      await queryClient.invalidateQueries({ queryKey: ["watchdog", id] })
    },
  })
}
