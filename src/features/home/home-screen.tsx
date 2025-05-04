import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { TextInput, Text, useTheme, MD3Theme } from "react-native-paper"
import { useRouter } from "expo-router"

import { ImageCarouselChat } from "@/src/components/image-carousel/image-carousel"
import { useUserFavoriteListings } from "./services/queries"
import { useGlobalStyles } from "@/src/components/global-styles"
import { ListingQueryParams } from "@/src/api/types"

export const HomeScreen: React.FC = () => {
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState<string>("")

  const { data: listings, isLoading, isError } = useUserFavoriteListings()
  const images = listings?.map((l) => l.imagePaths[0]) ?? []

  const handleImagePress = (index: number) => {
    const listingId = listings?.[index]?.id
    if (!listingId) return
    // Navigate to the listing detail screen with the listingId
    router.push(`/listings/${listingId}`)
  }

  const handleSearch = () => {
    const filters: ListingQueryParams = {
      search: searchQuery.trim(),
    }
    console.log("Search query:", filters.search)
    if (filters.search) {
      router.push({
        pathname: "/search-results",
        params: { filters: JSON.stringify(filters) },
      })
    }
  }

  return (
    <View style={globalStyles.pageContainer}>
      <TextInput
        mode="flat"
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        right={<TextInput.Icon icon="magnify" onPress={handleSearch} />}
        style={[styles.searchInput, { backgroundColor: theme.colors.surface }]}
      />

      <Text style={styles.header}>Liked Listings</Text>

      {isLoading ? (
        <Text>Loading your favorites…</Text>
      ) : isError ? (
        <Text>Oops, couldn’t load favorites.</Text>
      ) : images.length > 0 ? (
        <ImageCarouselChat
          images={images}
          style={styles.carousel}
          onImagePress={handleImagePress}
        />
      ) : (
        <Text>No liked listings yet.</Text>
      )}
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    searchInput: {
      borderRadius: 24,
      marginBottom: 24,
    },
    header: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 12,
    },
    carousel: {
      // if you need extra spacing or a fixed height, tweak here
      // height: 300,
    },
  })
