import { z } from "zod"

export const userRegisterRequest = z.object({
  firstname: z.string().nonempty("First name is required"),
  lastname: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
})

export type UserRegisterRequestType = z.infer<typeof userRegisterRequest>

export enum AddressType {
  PROFILE = "profile",
  OTHER = "other",
}

export type Address = {
  id: number
  isPrimary: boolean
  city: string
  postalCode: string
  country: string
  street: string
  latitude?: number
  longitude?: number
}

export type AddressCreate = {
  city: string
  postalCode: string
  country: string
  street: string
  latitude?: number
  longitude?: number
}

export type UserProfile = {
  firstname: string
  lastname: string
  phoneNumber: string
  amountSoldListing: string
  amountRentListing: string
  rating: number
  address: Address
}

// export type DeviceToken = {
//   token: string
// }

export enum OfferType {
  BUY = "buy",
  RENT = "rent",
  BOTH = "both",
}

export type PriceRange = {
  min: number
  max: number
}

export type Category = {
  id: number
  name: string
}
