import { View } from "react-native"
import { ActivityIndicator, MD3Theme, Text, useTheme } from "react-native-paper"
import { useUserFavoriteListings } from "./services/queries"
import { StyleSheet } from "react-native"
import { useGlobalStyles } from "@/src/components/global-styles"
import { ListingCard } from "@/src/components/listing-card/liting-card"
import Animated, { LinearTransition } from "react-native-reanimated"
import { AnimatedCard } from "@/src/components/animated/AnimatedCard"
import { useScrollExtension } from "@/src/hooks/useScrollExtension"

export const FavoriteListings = () => {
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)

  const favListingsQuery = useUserFavoriteListings()
  if (favListingsQuery.isError) {
    return <Text>Error: {favListingsQuery.error.message}</Text>
  }
  const { isExtended, onScroll } = useScrollExtension(10)

  return (
    <View style={globalStyles.pageContainer}>
      <Text variant="headlineLarge" style={globalStyles.pageTitle}>
        Favorite Listings
      </Text>

      <Animated.FlatList
        data={favListingsQuery.data}
        renderItem={({ item }) => (
          <AnimatedCard isActive={item.liked}>
            <ListingCard item={item} />
          </AnimatedCard>
        )}
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
        // required props for animation
        itemLayoutAnimation={LinearTransition}
        onScroll={onScroll}
        scrollEventThrottle={16}
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
