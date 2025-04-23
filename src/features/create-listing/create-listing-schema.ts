import { AddressType } from "@/src/api/types"
import { z } from "zod"

export const listingInfoSchema = z.object({
  categoryIds: z.array(z.number()).default([]),
  productName: z.string().min(1, "Product name required"),
})

export type ListingInfoSchemaType = z.infer<typeof listingInfoSchema>

export const addressSchema = z.object({
  visibility: z.string().min(1, "Visibility required"),
  country: z.string().min(1, "Country required"),
  phone: z.string().min(1, "Phone number required"),
  city: z.string().min(1, "City required"),
  zipCode: z.string().min(1, "Zip Code name required"),
  street: z.string().min(1, "Street required"),
  addressType: z.nativeEnum(AddressType),
})

export type AddressSchemaType = z.infer<typeof addressSchema>
