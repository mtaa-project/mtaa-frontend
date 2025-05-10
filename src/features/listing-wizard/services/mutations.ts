import { useMutation, useQueryClient } from "@tanstack/react-query"

import { type AddressCreate, type OfferType } from "@/src/api/types"
import { useCreateListingStore } from "@/src/store/create-listing-store"

import { uploadImageToFirebase } from "../components/create-listing/helpers"
import { type ListingVariant } from "../types"
import { apiCreateListing, apiUpdateListing } from "./api"

interface CreateListingPayload {
  title: string
  description: string
  price: number
  offerType: OfferType
  categoryIds: number[]
  imagePaths: string[]
  address?: AddressCreate
}
type CreateEditListingProps = {
  variant: ListingVariant
  id?: number
}

export const useCreateListing = () => {
  const selectedImages = useCreateListingStore((store) => store.listingImages)
  const address = useCreateListingStore((store) => store.address)
  const listingInfo = useCreateListingStore((store) => store.listingInfo)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ variant, id }: CreateEditListingProps) => {
      if (listingInfo === null) {
        throw Error("CreateListing: Listing info not set.")
      }
      if (address === null) {
        throw Error("CreateListing: Listing address not set.")
      }

      const imagePaths: string[] = []

      for (const image of selectedImages) {
        const path = await uploadImageToFirebase(image)
        imagePaths.push(path)
      }

      let newListing: CreateListingPayload = {
        title: listingInfo.title,
        description: listingInfo.description,
        price: listingInfo.price,
        offerType: listingInfo.offerType,
        address: address,
        categoryIds: listingInfo.categoryIds,
        imagePaths: imagePaths,
      }
      if (variant === "create") {
        await apiCreateListing(newListing)
      } else if (id) {
        await apiUpdateListing(newListing, id)
      }
      console.log("newListing: ", newListing)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["listings", "details", variables.id],
      })

      queryClient.invalidateQueries({
        queryKey: ["searchListings"],
      })

      queryClient.invalidateQueries({
        queryKey: ["user", "profile"],
      })

      queryClient.invalidateQueries({
        queryKey: ["profile", "adverts"],
      })
    },
  })
}
