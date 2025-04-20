import { OfferType } from "@/src/api/types"
import { z } from "zod"

const priceField = z
  .union([
    z.literal("").transform(() => undefined),
    z.coerce.number().nonnegative(),
  ])
  .optional()

const priceRangeSchema = z
  .object({
    min: priceField,
    max: priceField,
  })
  .refine(
    (data) => (
      data.min == null || data.max == null || data.min <= data.max,
      {
        message: "Min price must be equal or less than maximum price.",
        path: ["max"],
      }
    )
  )
const listingSaleSchema = z
  .discriminatedUnion("searchForSale", [
    z.object({
      searchForSale: z.literal(true),
      priceForSale: priceRangeSchema.optional().default({}),
    }),
    z.object({
      searchForSale: z.literal(false),
    }),
  ])
  .optional()
  .default({ searchForSale: false })

const listingRentSchema = z
  .discriminatedUnion("searchForRent", [
    z.object({
      searchForRent: z.literal(true),
      priceForRent: priceRangeSchema.optional().default({}),
    }),
    z.object({
      searchForRent: z.literal(false),
    }),
  ])
  .optional()
  .default({ searchForRent: false })

export const filterSchema = z
  .intersection(
    z.object({
      search: z.string().min(1),
      category: z.string(),
      location: z.enum(["Anywhere", "1", "2"]).optional(),
      categoryIds: z.array(z.number()).default([]),
    }),

    z.discriminatedUnion("variant", [
      z.object({ variant: z.literal("create") }),
      z.object({ variant: z.literal("edit"), id: z.number() }),
    ])
  )
  .and(listingRentSchema)
  .and(listingSaleSchema)
  .transform((data) => {
    // compute offerType automatically
    let offerType: OfferType
    if (data.searchForSale && data.searchForRent) {
      offerType = OfferType.BOTH
    } else if (data.searchForSale) {
      offerType = OfferType.BUY
    } else if (data.searchForRent) {
      offerType = OfferType.RENT
    } else {
      // up to you: either set a default or throw
      offerType = OfferType.BOTH
    }

    return {
      ...data,
      offerType,
    }
  })

export type FilterSchemaType = z.infer<typeof filterSchema>

export const defaultValues: FilterSchemaType = {
  variant: "create",
  search: "",
  category: "",
  offerType: OfferType.BOTH,
  location: "Anywhere",
  searchForRent: false,
  searchForSale: false,
  categoryIds: [],
}
