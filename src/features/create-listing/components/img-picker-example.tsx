import * as ImagePicker from "expo-image-picker"
import { type ImagePickerAsset } from "expo-image-picker"
import { ref, uploadBytes } from "firebase/storage"
import { useState } from "react"
import { Alert, Button, Image, StyleSheet, View } from "react-native"

import { auth, storage } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"
import { User } from "firebase/auth"

type Props = {
  productName: string
  productCategory: string
}

export default function ImagePickerExample() {
  const [selectedImages, setSelectedImages] = useState<ImagePickerAsset[]>([])
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        setSelectedImages(result.assets)
      }
    } catch (error) {
      Alert.alert(`${error}`)
    }
  }

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

  const uploadImages = async () => {
    if (selectedImages.length !== 3) {
      Alert.alert("Select only 3 Images")
      return
    }
    const imagePaths: string[] = []

    for (const image of selectedImages) {
      const path = await uploadImageToFirebase(image)
      imagePaths.push(path)
    }

    console.log("paths:", imagePaths)

    const newListing = {
      title: "Test Listing Title",
      description: "lotem asjdn asdknasdk ask dask and asda",
      price: 12_000,
      listing_status: "active",
      offer_type: "rent",
      address_id: 11,
      category_ids: [1],
      image_paths: imagePaths,
    }
    try {
      const response = await api.post("/listings", newListing)

      console.log("Upload successful:", response.data)
    } catch (error) {
      console.error("Upload error1:", JSON.stringify(error, null, 2))
    }
    return
  }
  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <View style={styles.imageContainer}>
        {selectedImages?.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </View>
      <Button title="Upload Images" onPress={uploadImages} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
  },
})
