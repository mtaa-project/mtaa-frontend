import { z } from "zod"

export const userRegisterRequest = z.object({
  firstname: z.string().nonempty("First name is required"),
  lastname: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
})

export type UserRegisterRequestType = z.infer<typeof userRegisterRequest>

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
