import {
  type AddressSchemaType,
  type ListingInfoSchemaType,
} from "@features/create-listing/create-listing-schema"
import { create } from "zustand"

interface CreateListingStore {
  listingInfo: ListingInfoSchemaType | null
  address: AddressSchemaType | null
  setListingInfo: (data: ListingInfoSchemaType) => void
  setAddress: (data: AddressSchemaType) => void
  reset: () => void
}

export const useCreateListingStore = create<CreateListingStore>((set) => ({
  listingInfo: null,
  address: null,
  setListingInfo: (data: ListingInfoSchemaType) => set({ listingInfo: data }),
  setAddress: (data: AddressSchemaType) => set({ address: data }),
  reset: () => set({ listingInfo: null, address: null }),
}))
