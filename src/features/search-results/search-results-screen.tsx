// File: src/features/search-results/screens/search-results-screen.tsx
import React, { useState, useCallback, useEffect } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { TextInput, IconButton, Chip, useTheme } from "react-native-paper"

import type {
  ApiListingGet,
  ListingQueryParams,
  SortBy,
  SortOrder,
  OfferType,
} from "@/src/api/types"
import { useInfiniteSearchListings } from "./services/queries"
import { ListingCard } from "@/src/components/listing-card/listing-card"
import { FilterOverlay } from "./components/filter-overlay"
import { useGlobalStyles } from "@/src/components/global-styles"

export const SearchResults: React.FC<ListingQueryParams> = (props) => {
  const theme = useTheme()
  // const styles = createStyles(theme)
  const globalStyles = useGlobalStyles()

  // Destructure initial props for search and sorting
  const {
    search: initialSearch = "",
    sort_by: initialSortBy,
    sort_order: initialSortOrder,
  } = props

  // Local state initialized from props
  const [search, setSearch] = useState<string>(initialSearch)
  const [sortBy, setSortBy] = useState<SortBy | undefined>(initialSortBy)
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    initialSortOrder
  )
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  // Sync props if they change
  useEffect(() => {
    setSearch(initialSearch)
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
  }, [initialSearch, initialSortBy, initialSortOrder])

  // Build a typed filters object based on current state
  const filters: ListingQueryParams = {
    search,
    sort_by: sortBy,
    sort_order: sortOrder,
    offer_type: undefined as OfferType | undefined,
    // ...add other filter defaults here as needed
  }

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    hasNextPage,
  } = useInfiniteSearchListings(filters)

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const renderItem = ({ item }: { item: ApiListingGet }) => (
    <ListingCard item={item} />
  )

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          right={<TextInput.Icon icon="magnify" />}
        />
        <IconButton
          icon="filter-variant"
          size={28}
          onPress={() => setFiltersVisible(true)}
        />
      </View>

      <View style={styles.chipRow}>
        <Chip
          selected={sortBy === "price" && sortOrder === "asc"}
          onPress={() => {
            if (sortBy === "price" && sortOrder === "asc") {
              setSortBy(undefined)
              setSortOrder(undefined)
            } else {
              setSortBy("price")
              setSortOrder("asc")
            }
          }}
          style={styles.chip}
        >
          Cheapest
        </Chip>
        <Chip
          selected={sortBy === "price" && sortOrder === "desc"}
          onPress={() => {
            if (sortBy === "price" && sortOrder === "desc") {
              setSortBy(undefined)
              setSortOrder(undefined)
            } else {
              setSortBy("price")
              setSortOrder("desc")
            }
          }}
          style={styles.chip}
        >
          Highest Price
        </Chip>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={data?.pages.flat()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={refetch}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator /> : null
          }
        />
      )}

      <FilterOverlay
        visible={filtersVisible}
        onDismiss={() => setFiltersVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 32,
  },
})
