import type * as ImagePicker from "expo-image-picker"
import { create } from "zustand"

import {
  type AddressSchemaType,
  type ListingInfoSchemaType,
} from "@/src/features/listing-wizard/components/create-listing/create-listing-schema"

interface CreateListingStore {
  listingInfo: ListingInfoSchemaType | null
  address: AddressSchemaType | null
  listingImages: ImagePicker.ImagePickerAsset[]
  setListingInfo: (data: ListingInfoSchemaType) => void
  setAddress: (data: AddressSchemaType) => void
  setListingImages: (data: ImagePicker.ImagePickerAsset[]) => void
  reset: () => void
}

export const useCreateListingStore = create<CreateListingStore>((set) => ({
  listingInfo: null,
  address: null,
  listingImages: [],
  setListingInfo: (data: ListingInfoSchemaType) => set({ listingInfo: data }),
  setAddress: (data: AddressSchemaType) => set({ address: data }),
  setListingImages: (data: ImagePicker.ImagePickerAsset[]) =>
    set({ listingImages: data }),
  reset: () => set({ listingInfo: null, address: null, listingImages: [] }),
}))
