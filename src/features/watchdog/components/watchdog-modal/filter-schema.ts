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

const listingSaleSchema = z.discriminatedUnion("searchForSale", [
  z.object({
    searchForSale: z.literal(true),
    priceForSale: priceRangeSchema.optional().default({}),
  }),
  z.object({
    searchForSale: z.literal(false),
  }),
])

const listingRentSchema = z.discriminatedUnion("searchForRent", [
  z.object({
    searchForRent: z.literal(true),
    priceForRent: priceRangeSchema.optional().default({}),
  }),
  z.object({
    searchForRent: z.literal(false),
  }),
])

export const filterSchema = z
  .object({
    searchTerm: z.string().min(1),
    category: z.string(),
    location: z.enum(["Anywhere", "1", "2"]).optional(),
  })
  .and(listingSaleSchema)
  .and(listingRentSchema)

export type FilterSchemaType = z.infer<typeof filterSchema>

export const defaultValues: FilterSchemaType = {
  searchTerm: "",
  category: "",
  location: "Anywhere",
  searchForRent: false,
  searchForSale: false,
}
