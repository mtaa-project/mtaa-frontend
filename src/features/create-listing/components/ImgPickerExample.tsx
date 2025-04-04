import { useState } from "react"
import { Button, Image, View, StyleSheet, Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerAsset } from "expo-image-picker"
import { api } from "@/src/lib/axios-config"

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

  const uploadImages = async () => {
    if (selectedImages.length !== 3) {
      Alert.alert("Select only 3 Images")
      return
    }

    const formData = new FormData()

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
