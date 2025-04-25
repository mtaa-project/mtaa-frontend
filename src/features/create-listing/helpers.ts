import { auth, storage } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"
import * as ImagePicker from "expo-image-picker"
import { type ImagePickerAsset } from "expo-image-picker"
import { User } from "firebase/auth"
import { ref, uploadBytes } from "firebase/storage"
import { Alert } from "react-native"
import {
  AddressSchemaType,
  ListingInfoSchemaType,
} from "./create-listing-schema"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useMutation } from "@tanstack/react-query"
import { Address, AddressCreate, AddressType, OfferType } from "@/src/api/types"

// Create unique reference for the image
const createImageStoragePath = (
  imageName: ImagePicker.ImagePickerAsset,
  currentUser: User
) => {
  const generatedImageName = imageName.fileName ?? `image_${Date.now()}.jpg`
  return `user_uploads/${currentUser.uid}/${Date.now()}-${generatedImageName}`
}

// https://firebase.google.com/docs/reference/node/firebase.storage
const uploadImageToFirebase = async (
  image: ImagePickerAsset
): Promise<string> => {
  try {
    if (!auth.currentUser) {
      throw new Error("User not authenticated")
    }

    // Load image from local URI as blob
    const response = await fetch(image.uri)
    // Binary Large Object (BLOB) - firebase uploadBytes expect BLOB
    const blob = await response.blob()

    // get storage reference for this image also
    // if we want to get download URL, use getDownloadURL(fileRef)
    const fileRef = ref(
      storage,
      createImageStoragePath(image, auth.currentUser)
    )
    console.log("FileRef:")

    console.log(fileRef)

    // Upload blob
    await uploadBytes(fileRef, blob)

    // But for backend we only send the path:
    return fileRef.fullPath
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

const apiCreateListing = async (data: any) => {
  return (await api.post("/listings", data)).data
}

interface CreateListingPayload {
  title: string
  description: string
  price: number
  listingStatus: "active" | "inactive"
  offerType: OfferType
  categoryIds: number[]
  imagePaths: string[]
  address?: AddressCreate
}

export const useCreateListing = () => {
  const selectedImages = useCreateListingStore((store) => store.listingImages)
  const address = useCreateListingStore((store) => store.address)
  const listingInfo = useCreateListingStore((store) => store.listingInfo)
  // try {
  //   const response = await api.post("/listings", newListing)

  //   console.log("Upload successful:", response.data)
  // } catch (error) {
  //   console.error("Upload error1:", JSON.stringify(error, null, 2))
  // }
  return useMutation({
    mutationFn: async () => {
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
        title: listingInfo.productName,
        description: listingInfo.description,
        price: listingInfo.price,
        listingStatus: "active",
        offerType: listingInfo.offerType,
        categoryIds: listingInfo.categoryIds,
        imagePaths: imagePaths,
        address: address,
      }

      console.log("newListing: ", newListing)
      await apiCreateListing(newListing)
    },
  })
}
