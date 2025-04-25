import { AddressType, OfferType } from "@/src/api/types"
import { z } from "zod"

const priceField = z.preprocess((val) => {
  if (val === "" || val === null) return undefined
  if (typeof val === "string") {
    const num = parseFloat(val)
    return isNaN(num) ? undefined : num
  }
  return val
}, z.number().nonnegative())

export const listingInfoSchema = z.object({
  categoryIds: z
    .array(z.number())
    .min(1, "At least one category is required")
    .default([]),
  productName: z.string().min(1, "Product name required"),
  offerType: z.nativeEnum(OfferType),
  price: priceField,
  description: z.string().min(1, "Description is required"),
})

export type ListingInfoSchemaType = z.infer<typeof listingInfoSchema>

export const listingInfoSchemaDefaultValues: ListingInfoSchemaType = {
  categoryIds: [],
  productName: "",
  offerType: OfferType.BUY,
  price: 0,
  description: "",
}
z.discriminatedUnion("variant", [
  z.object({ variant: z.literal("create") }),
  z.object({ variant: z.literal("edit"), id: z.number() }),
])

export const addressSchema = z.intersection(
  z.object({
    country: z.string().min(1, "Country required"),
    city: z.string().min(1, "City required"),
    postalCode: z.string().min(1, "Postal Code name required"),
    street: z.string().min(1, "Street required"),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  }),

  z.discriminatedUnion("addressType", [
    z.object({ addressType: z.literal(AddressType.PROFILE) }),
    z.object({
      addressType: z.literal(AddressType.OTHER),
    }),
  ])
)

export type AddressSchemaType = z.infer<typeof addressSchema>

export const addressSchemaDefaultValues: AddressSchemaType = {
  addressType: AddressType.OTHER,
  country: "",
  city: "",
  postalCode: "",
  street: "",
}
