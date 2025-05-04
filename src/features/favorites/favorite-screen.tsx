import { View } from "react-native"
import { ActivityIndicator, MD3Theme, Text, useTheme } from "react-native-paper"
import { useUserFavoriteListings } from "./services/queries"
import { StyleSheet, FlatList } from "react-native"
import { useGlobalStyles } from "@/src/components/global-styles"
import { ListingCard } from "@/src/components/listing-card/liting-card"

export const FavoriteListings = () => {
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)

  const favListingsQuery = useUserFavoriteListings()
  if (favListingsQuery.isError) {
    return <Text>Error: {favListingsQuery.error.message}</Text>
  }

  return (
    <View style={globalStyles.pageContainer}>
      <Text variant="headlineLarge" style={globalStyles.pageTitle}>
        Favorite Listings
      </Text>

      <FlatList
        data={favListingsQuery.data}
        renderItem={({ item }) => <ListingCard item={item} />}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{ gap: 16 }}
        ListEmptyComponent={() =>
          favListingsQuery.isLoading ? (
            <View style={styles.container}>
              <ActivityIndicator size={"large"} />
              <Text variant="bodyLarge">Loading...</Text>
            </View>
          ) : (
            <Text variant="bodySmall">No favorite listings found.</Text>
          )
        }
      />
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      // Use a theme color for background
      backgroundColor: theme.colors.background,
    },
  })
