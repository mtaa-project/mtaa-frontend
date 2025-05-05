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

export type UserProfileBase = {
  firstname: string
  lastname: string
  phoneNumber?: string
}

export type UserProfile = UserProfileBase & {
  amountSoldListing: number
  amountRentListing: number
  rating: number
  address: Address
}

export type UserProfileUpdate = {
  userMetadata: UserProfileBase
  addressMetadata: AddressCreate
}

export type UserProfileGet = UserProfile & {
  id: number
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

export type SortBy =
  | "created_at"
  | "updated_at"
  | "price"
  | "rating"
  | "location"

export type SortOrder = "asc" | "desc"

export type Category = {
  id: number
  name: string
}

export interface Review {
  rating: number
  reviewer: Reviewer
}

// Nested object with reviewer details
export interface Reviewer {
  id: number
  firstname: string
  lastname: string
}

export interface ListingQueryParams {
  // === AlertQuery fields ===
  offerType?: OfferType
  categoryIds?: number[]

  // price ranges
  saleMin?: number
  saleMax?: number
  rentMin?: number
  rentMax?: number

  minRating?: number // ≥ 0
  timeFrom?: string // ISO timestamp, or let axios stringify a Date

  // sorting
  sortBy?: SortBy
  sortOrder?: SortOrder

  // full‐text search
  search: string

  // location filters
  country?: string
  city?: string
  street?: string

  // === ListingQueryParameters extensions ===
  limit?: number // default 10
  offset?: number // default 0

  userLatitude?: number
  userLongitude?: number
  maxDistance?: number // km
}

export type ListingStatus = "active" | "sold" | "hidden" | "removed" | "rented"

export type ApiSellerContact = {
  // firstname: string
  // lastname: string
  email: string
  phoneNumber?: string
}

export type ApiSellerBase = {
  firstname: string
  lastname: string
  rating: number
}

export type ApiSellerGet = ApiSellerBase & {
  id: number
}

export type ApiListingCommon = {
  title: string
  description: string
  price: number
  offerType: OfferType
  address: Address
  categoryIds: number[]
  imagePaths: string[]
}

export type ApiListingGet = ApiListingCommon & {
  id: number
  seller: ApiSellerGet
  createdAt: string
  listingStatus: ListingStatus
  liked: boolean
  distanceFromUser: number
}

export type ApiListingUpdate = ApiListingCommon & {
  id: number
  // TODO: overwrite Address
}

export type Advert = {
  id: number
  title: string
  description: string
  price: number
  offerType: OfferType
  listingStatus: ListingStatus
  imagePath: string
}
