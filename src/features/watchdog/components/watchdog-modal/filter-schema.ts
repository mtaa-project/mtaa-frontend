import { z } from "zod"

import { AddressType, OfferType } from "@/src/api/types"

const priceField = z.preprocess((val) => {
  if (val === "" || val === null) return undefined
  if (typeof val === "string") {
    const num = parseFloat(val)
    return isNaN(num) ? undefined : num
  }
  return val
}, z.number().nonnegative().optional())

const priceRangeSchema = z
  .object({
    minPrice: priceField.optional(),
    maxPrice: priceField.optional(),
  })
  .refine(
    (d) => d.minPrice == null || d.maxPrice == null || d.minPrice <= d.maxPrice,
    {
      message: "Min price must be equal or less than maximum price.",
      path: ["maxPrice"],
    }
  )

export const filterSchema = z.intersection(
  z.object({
    search: z.string().min(1),
    category: z.string(),
    location: z.enum(["Anywhere", "1", "2"]).optional(),
    categoryIds: z.array(z.number()).default([]),
    offerType: z.nativeEnum(OfferType),
    priceForSale: priceRangeSchema.optional().default({}),
    priceForRent: priceRangeSchema.optional().default({}),
  }),

  z.discriminatedUnion("variant", [
    z.object({ variant: z.literal("create") }),
    z.object({ variant: z.literal("edit"), id: z.number() }),
  ])
)

export type FilterSchemaType = z.infer<typeof filterSchema>

export const defaultValues: FilterSchemaType = {
  variant: "create",
  search: "",
  category: "",
  offerType: OfferType.BOTH,
  location: "Anywhere",
  priceForRent: {},
  priceForSale: {},
  categoryIds: [],
}
