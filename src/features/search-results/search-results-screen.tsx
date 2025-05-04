// File: src/features/search-results/screens/SearchResultsScreen.tsx
import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { TextInput, Chip, useTheme, IconButton } from "react-native-paper"
import * as Location from "expo-location"

import type {
  ApiListingGet,
  ListingQueryParams,
  SortBy,
  SortOrder,
  OfferType,
} from "@/src/api/types"
import { ListingCard } from "@/src/components/listing-card/listing-card"
import { useGlobalStyles } from "@/src/components/global-styles"
import { useInfiniteSearchListings } from "./services/queries"
import { FilterOverlay } from "./components/filter-overlay"

export const SearchResults: React.FC<ListingQueryParams> = (props) => {
  const theme = useTheme()
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

  // Search and filter state
  // const [search, setSearch] = useState<string>("")
  // const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined)
  // const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined)
  const [nearest, setNearest] = useState<boolean>(false)
  const [coords, setCoords] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  // Sync props if they change
  useEffect(() => {
    setSearch(initialSearch)
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
  }, [initialSearch, initialSortBy, initialSortOrder])

  // Build a typed filters object based on current state
  const filters: ListingQueryParams = {
    search: search,
    sort_by: sortBy,
    sort_order: sortOrder,
    offer_type: undefined as OfferType | undefined,
    user_latitude: coords?.latitude,
    user_longitude: coords?.longitude,
    // other defaults
  }

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    hasNextPage,
  } = useInfiniteSearchListings(filters)

  // Fetch next page on scroll
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Toggle nearest: get user location
  const toggleNearest = async () => {
    if (nearest) {
      // turn off
      setNearest(false)
      setCoords(null)
      setSortBy(undefined)
      setSortOrder(undefined)
    } else {
      // request permission
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.warn("Location permission denied")
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      setCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      setNearest(true)
      setSortBy("location")
      setSortOrder("asc")
    }
  }

  const renderItem = ({ item }: { item: ApiListingGet }) => (
    <ListingCard item={item} />
  )

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={styles.searchInput}
          right={<TextInput.Icon icon="magnify" onPress={() => refetch()} />}
        />
      </View>

      {/* Filter + Sorting Chips */}
      <View style={styles.chipContainer}>
        {/* Fixed Filter Chip */}
        <Chip
          icon="filter-variant"
          mode="outlined"
          style={styles.filterChip}
          onPress={() => setFiltersVisible(true)}
        >
          Filter
        </Chip>

        {/* Scrollable sort chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollRow}
        >
          <Chip
            selected={sortBy === "price" && sortOrder === "asc"}
            onPress={() => {
              const on = !(sortBy === "price" && sortOrder === "asc")
              setSortBy(on ? "price" : undefined)
              setSortOrder(on ? "asc" : undefined)
            }}
            style={styles.chip}
            icon="piggy-bank"
          >
            Cheapest
          </Chip>

          <Chip
            selected={sortBy === "price" && sortOrder === "desc"}
            onPress={() => {
              const on = !(sortBy === "price" && sortOrder === "desc")
              setSortBy(on ? "price" : undefined)
              setSortOrder(on ? "desc" : undefined)
            }}
            style={styles.chip}
            icon="currency-usd"
          >
            Highest Price
          </Chip>

          <Chip
            selected={nearest}
            onPress={toggleNearest}
            style={styles.chip}
            icon={"map-marker-radius"}
          >
            Nearest
          </Chip>
        </ScrollView>
      </View>

      {/* Listings List */}
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
    marginBottom: 12,
  },
  searchInput: {
    borderRadius: 24,
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: "#7F3DFF", // purple background
  },
  chipScrollRow: {
    flexDirection: "row",
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
