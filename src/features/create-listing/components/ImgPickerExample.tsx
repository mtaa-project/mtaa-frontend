import { useState } from "react"
import { Button, Image, View, StyleSheet, Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerAsset } from "expo-image-picker"
import { api } from "@/src/lib/axios-config"
import { getAuth } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, storage } from "@/firebase-config"

type Props = {
  productName: string
  productCategory: string
}

export default function ImagePickerExample(props: Props) {
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

  const uploadImageToFirebase = async (
    image: ImagePickerAsset
  ): Promise<string> => {
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated")
      }

      // Load image from local URI as blob
      const response = await fetch(image.uri)
      const blob = await response.blob()

      // Create unique reference for the image
      const fileName = image.fileName ?? `image_${Date.now()}.jpg`
      const fileRef = ref(
        storage,
        `user_uploads/${auth.currentUser.uid}/${Date.now()}-${fileName}`
      )

      // Upload blob
      await uploadBytes(fileRef, blob)

      // If you want to get download URL, use getDownloadURL(fileRef)
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
    return

    const formData = new FormData()
    formData.append("product_name", props.productName)
    formData.append("product_category", props.productCategory)

    selectedImages.forEach((image, index) => {
      const uri = image.uri
      const name = image.fileName ?? `image_${index}.jpg`
      const type = image.mimeType ?? "image/jpeg"

      formData.append(`files`, {
        uri,
        name,
        type,
      } as any)
    })

    console.log([...formData])

    try {
      const response = await api.post("/uploadfile", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Upload successful:", response.data)
    } catch (error) {
      console.error("Upload error1:", JSON.stringify(error, null, 2))
    }
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
