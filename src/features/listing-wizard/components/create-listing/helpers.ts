import { auth, storage } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"
import * as ImagePicker from "expo-image-picker"
import { type ImagePickerAsset } from "expo-image-picker"
import { User } from "firebase/auth"
import { ref, uploadBytes } from "firebase/storage"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Address, AddressCreate, AddressType, OfferType } from "@/src/api/types"
import { ListingVariant } from "../../types"

// Create unique reference for the image
const createImageStoragePath = (
  imageName: ImagePicker.ImagePickerAsset,
  currentUser: User
) => {
  const generatedImageName = imageName.fileName ?? `image_${Date.now()}.jpg`
  return `user_uploads/${currentUser.uid}/${Date.now()}-${generatedImageName}`
}

// https://firebase.google.com/docs/reference/node/firebase.storage
export const uploadImageToFirebase = async (
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
