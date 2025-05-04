// src/features/search-results/search-results-screen.tsx

import React, { useCallback } from "react"
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, MD3Theme, Text, useTheme } from "react-native-paper"
import Animated, { LinearTransition } from "react-native-reanimated"
import { ListingCard } from "@/src/components/listing-card/liting-card"
import { AnimatedCard } from "@/src/components/animated/AnimatedCard"
import { useGlobalStyles } from "@/src/components/global-styles"
import { useScrollExtension } from "@/src/app/hooks/useScrollExtension"

import { useInfiniteSearchListings } from "./services/queries"

interface SearchResultsProps {
  query: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)

  // 1. Call your infinite‐scroll hook
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchListings(query)

  // 2. Flatten the pages into one array
  const listings = data?.pages.flat() ?? []

  const { isExtended, onScroll } = useScrollExtension(10)

  // 3. Memoize end‐reached handler
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isError) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge">Error: {error?.message}</Text>
      </View>
    )
  }

  return (
    <View style={globalStyles.pageContainer}>
      <Text variant="headlineLarge" style={globalStyles.pageTitle}>
        Search Results for “{query}”
      </Text>

      <Animated.FlatList
        data={listings}
        renderItem={({ item }) => (
          <AnimatedCard isActive={item.liked}>
            <ListingCard item={item} />
          </AnimatedCard>
        )}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        itemLayoutAnimation={LinearTransition}
        // 4. Infinite‐scroll triggers
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        // 5. Show loading indicator in footer
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" />
              <Text variant="bodySmall">Loading more…</Text>
            </View>
          ) : null
        }
        // 6. Empty state when nothing at all
        ListEmptyComponent={() =>
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
              <Text variant="bodyLarge">Searching…</Text>
            </View>
          ) : (
            <Text variant="bodySmall">No results found for “{query}.”</Text>
          )
        }
      />
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    footer: {
      paddingVertical: 12,
      alignItems: "center",
    },
  })
