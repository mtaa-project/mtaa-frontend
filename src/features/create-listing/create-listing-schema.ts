import { z } from "zod"

export const listingInfoSchema = z.object({
  categoryIds: z.array(z.number()).default([]),
  productName: z.string().min(1, "Product name required"),
})

export type ListingInfoSchemaType = z.infer<typeof listingInfoSchema>

export const addressSchema = z.object({
  visibility: z.string().min(1, "Visibility required"),
  country: z.string().min(1, "Country required"),
  city: z.string().min(1, "City required"),
  zipCode: z.string().min(1, "Zip Code name required"),
})

export type AddressSchemaType = z.infer<typeof addressSchema>
