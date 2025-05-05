import React, { useState } from "react"
import { View, StyleSheet, FlatList, ScrollView } from "react-native"
import { TextInput, Text, useTheme, MD3Theme } from "react-native-paper"
import { useRouter } from "expo-router"

import { ImageCarouselChat } from "@/src/components/image-carousel/image-carousel"
import { useUserFavoriteListings } from "./services/queries"
import { useGlobalStyles } from "@/src/components/global-styles"
import { ListingQueryParams } from "@/src/api/types"
import { CategoryPill } from "./components/category-pill"
import { useGetCategories } from "../watchdog/services/queries"

export const HomeScreen: React.FC = () => {
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState<string>("")

  const { data: listings, isLoading, isError } = useUserFavoriteListings()
  const {
    data: categories,
    isLoading: catLoading,
    isError: catError,
  } = useGetCategories()
  const images = listings?.map((l) => l.imagePaths[0]) ?? []

  const topCategories = React.useMemo(
    () =>
      (categories ?? [])
        .sort((a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name)
        )
        .slice(0, 4),
    [categories]
  )

  const handleCategoryPress = (categoryId: number) => {
    router.push({
      pathname: "/search-results",
      params: { categoryIds: [categoryId] },
    })
  }

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
    setSearchQuery("")
    if (filters.search) {
      router.push({
        pathname: "/search-results",
        params: { query: filters.search },
      })
    }
  }

  return (
    <View style={globalStyles.pageContainer}>
      <TextInput
        mode="outlined"
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        right={<TextInput.Icon icon="magnify" onPress={handleSearch} />}
        style={styles.searchInput}
        outlineStyle={{
          borderRadius: 24,
        }}
      />
      <ScrollView>
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
        <Text style={styles.header}>Top Categories</Text>

        {catLoading && <Text>Loading categories…</Text>}
        {catError && <Text>Oops, couldn't load categories.</Text>}
        {!catLoading && !catError && (
          <FlatList
            contentContainerStyle={{ gap: 12 }}
            numColumns={2}
            data={topCategories}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // keeps whole screen scroll behavior unchanged
            columnWrapperStyle={styles.categoryRow}
            renderItem={({ item }) => (
              <CategoryPill
                category={item}
                onPress={() => handleCategoryPress(item.id)}
              />
            )}
          />
        )}
      </ScrollView>
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
      // borderRadius: 24,
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
    categoryRow: {
      justifyContent: "space-between",
      marginBottom: 12,
    },
  })
