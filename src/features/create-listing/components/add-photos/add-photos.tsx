import { MaterialCommunityIcons } from "@expo/vector-icons"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"

export const AddPhotos = () => {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Add photos
      </Text>

      <View style={styles.card}>
        <View style={styles.leftSection}>
          <MaterialCommunityIcons name="image-outline" size={48} color="#888" />
        </View>

        <View style={styles.rightSection}>
          <MaterialCommunityIcons name="plus" size={32} color="#555" />
          <Text style={styles.addPhotoText}>Add photo</Text>
        </View>
      </View>

      <Text variant="bodyMedium" style={styles.note}>
        Photos will appear in the order you arrange them. The first photo will
        be set as the main image.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // Môžeš nastaviť šírku/výšku podľa potreby
    // width: 300,
    // height: 200,
  },
  title: {
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    height: 100,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSection: {
    width: 100,
    height: 100,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    marginTop: 4,
    color: "#555",
  },
  note: {
    marginTop: 8,
    color: "#666",
  },
})
