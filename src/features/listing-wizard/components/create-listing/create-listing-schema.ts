import { AddressType, OfferType } from "@/src/api/types"
import { z } from "zod"
const priceField = z.preprocess(
  (val) => {
    // Empty strings → undefined
    if (val === "" || val == null) return undefined

    // Numeric strings → number
    if (typeof val === "string" && /^\d+(\.\d+)?$/.test(val)) {
      return parseFloat(val)
    }
    return val
  },
  // Then validate as a nonnegative number
  z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than zero")
)

const listingPayload = z.object({
  categoryIds: z.array(z.number()).min(1, "At least one category"),
  title: z.string().min(1, "Product name required"),
  offerType: z.nativeEnum(OfferType),
  price: priceField,
  description: z.string().min(1, "Description required"),
})

export const listingInfoSchema = listingPayload.and(
  z.discriminatedUnion("variant", [
    z.object({ variant: z.literal("create") }), // no id
    z.object({ variant: z.literal("edit"), id: z.number() }),
  ])
)

export type ListingInfoSchemaType = z.infer<typeof listingInfoSchema>

export const listingInfoSchemaDefaultValues: ListingInfoSchemaType = {
  variant: "create",
  title: "",
  description: "",
  price: undefined as unknown as number,
  offerType: OfferType.BUY,
  categoryIds: [],
  // RHF happy-hack (otherwise -1)
}
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
