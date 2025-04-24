import { AddressType, OfferType } from "@/src/api/types"
import { z } from "zod"

const priceField = z.preprocess((val) => {
  if (val === "" || val === null) return undefined
  if (typeof val === "string") {
    const num = parseFloat(val)
    return isNaN(num) ? undefined : num
  }
  return val
}, z.number().nonnegative().optional())

export const listingInfoSchema = z.object({
  categoryIds: z
    .array(z.number())
    .min(1, "At least one category is required")
    .default([]),
  productName: z.string().min(1, "Product name required"),
  offerType: z.nativeEnum(OfferType),
  price: priceField,
})

export type ListingInfoSchemaType = z.infer<typeof listingInfoSchema>

export const listingInfoSchemaDefaultValues: ListingInfoSchemaType = {
  categoryIds: [],
  productName: "",
  offerType: OfferType.BUY,
  price: 0,
}

export const addressSchema = z.object({
  country: z.string().min(1, "Country required"),
  phone: z.string().min(1, "Phone number required"),
  city: z.string().min(1, "City required"),
  postalCode: z.string().min(1, "Postal Code name required"),
  street: z.string().min(1, "Street required"),
  addressType: z.nativeEnum(AddressType),
})

export type AddressSchemaType = z.infer<typeof addressSchema>

export const addressSchemaDefaultValues: AddressSchemaType = {
  country: "",
  phone: "",
  city: "",
  postalCode: "",
  street: "",
  addressType: AddressType.PROFILE,
}
