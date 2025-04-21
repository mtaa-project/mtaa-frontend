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

export type PriceRange = {
  minPrice?: number
  maxPrice?: number
}

export type ApiCommon = {
  search: string
  offerType: OfferType
  categoryIds: number[]
  priceRangeRent?: PriceRange
  priceRangeSale?: PriceRange
}

export type ApiCreateEdit = ApiCommon & (Create | Edit)
export type ApiGet = Get & ApiCommon
