import {
  type AddressSchemaType,
  type ListingInfoSchemaType,
} from "@features/create-listing/create-listing-schema"
import { create } from "zustand"
import * as ImagePicker from "expo-image-picker"

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
  reset: () => set({ listingInfo: null, address: null }),
  setListingImages: (data: ImagePicker.ImagePickerAsset[]) =>
    set({ listingImages: data }),
}))
