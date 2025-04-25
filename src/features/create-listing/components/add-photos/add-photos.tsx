import React, { useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { Button, Card, Text } from "react-native-paper"

import { ImageCarousel } from "../image-carousel/image-carousel"
import * as ImagePicker from "expo-image-picker"
import { useCreateListingStore } from "@/src/store/create-listing-store"

export const AddPhotos = () => {
  const selectedImages = useCreateListingStore((store) => store.listingImages)
  const setSelectedImages = useCreateListingStore(
    (store) => store.setListingImages
  )

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

  const handleClearSelectedPhotos = () => {
    setSelectedImages([])
  }

  return (
    <View>
      <View style={styles.addPhotosContainer}>
        <ImageCarousel selectedImages={selectedImages} />
        <Card.Content>
          <Text variant="bodyMedium">
            Photos will appear in the order you arrange them. The first photo
            will be set as the main image.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            disabled={selectedImages.length === 0}
            onPress={handleClearSelectedPhotos}
            accessibilityLabel="Clear selected photos"
            accessibilityHint="Removes all currently selected photos"
          >
            Clear Selection
          </Button>
          <Button
            onPress={pickImage}
            accessibilityLabel="Add photos to listing"
            accessibilityHint="Opens the gallery to select one or more photos"
          >
            Add Photos
          </Button>
        </Card.Actions>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  addPhotosContainer: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: "red",
  },
})
