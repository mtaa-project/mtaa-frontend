import { z } from "zod"

export const profileDetails = z.object({
  firstname: z.string().min(1, "Firstname required"),
  lastname: z.string().min(1, "Lastname required"),
  phoneNumber: z.string().min(1, "Phone number required"),
})

export const profileAddressSchema = z.object({
  country: z.string().min(1, "Country required"),
  city: z.string().min(1, "City required"),
  postalCode: z.string().min(1, "Postal Code name required"),
  street: z.string().min(1, "Street required"),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
})

export const userProfileSchema = z.object({
  address: profileAddressSchema,
  profileDetails: profileDetails,
})

export type UserProfileSchemaType = z.infer<typeof userProfileSchema>

export const userProfileSchemaDefaultValues: UserProfileSchemaType = {
  address: {
    country: "",
    city: "",
    postalCode: "",
    street: "",
  },
  profileDetails: {
    firstname: "",
    lastname: "",
    phoneNumber: "",
  },
}
