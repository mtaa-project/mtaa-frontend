import { OfferType } from "@/src/api/types"

type Create = {
  variant: "create"
  devicePushToken: string
}

type Edit = {
  variant: "edit"
  id: number
}

type Get = {
  variant: "get"
  id: number
  isActive: boolean
}

export type ApiCommon = {
  search: string
  offerType: OfferType
  categoryIds: number[]
}

export type ApiCreateEdit = ApiCommon & (Create | Edit)
export type ApiGet = Get & ApiCommon
