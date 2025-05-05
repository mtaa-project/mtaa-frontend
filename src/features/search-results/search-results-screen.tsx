// File: src/features/search-results/screens/SearchResultsScreen.tsx
import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { TextInput, Chip, useTheme, MD3Theme } from "react-native-paper"
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
  const globalStyles = useGlobalStyles()
  const theme = useTheme()
  const styles = createStyles(theme)

  // Destructure initial props for search and sorting
  const {
    search: initialSearch = "",
    sortBy: initialSortBy,
    sortOrder: initialSortOrder,
  } = props

  // Local state initialized from props
  const [search, setSearch] = useState<string>(initialSearch)
  const [sortBy, setSortBy] = useState<SortBy | undefined>(initialSortBy)
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    initialSortOrder
  )
  const [nearest, setNearest] = useState<boolean>(false)
  const [coords, setCoords] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  // Filter state
  const [filterCategoryIds, setFilterCategoryIds] = useState<string[]>([])
  const [filterLocation, setFilterLocation] = useState<string>("")
  const [filterDummyLocation, setFilterDummyLocation] = useState<string>("")
  const [filterOfferType, setFilterOfferType] = useState<OfferType>()
  const [filterPriceSaleMin, setFilterPriceSaleMin] = useState<number>(0)
  const [filterPriceSaleMax, setFilterPriceSaleMax] = useState<number>(0)
  const [filterPriceRentMin, setFilterPriceRentMin] = useState<number>(0)
  const [filterPriceRentMax, setFilterPriceRentMax] = useState<number>(0)
  const [filterRatingMin, setFilterRatingMin] = useState<number>(0)

  // Sync props if they change
  useEffect(() => {
    setSearch(initialSearch)
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
  }, [initialSearch, initialSortBy, initialSortOrder])

  // Build a typed query object based on current state
  const queryParams: ListingQueryParams = {
    search: search,
    sortBy: sortBy,
    sortOrder: sortOrder,
    userLatitude: coords?.latitude,
    userLongitude: coords?.longitude,
    categoryIds: filterCategoryIds.map((id) => Number(id)),
    country: filterDummyLocation,
    city: filterLocation,
    street: filterDummyLocation,
    saleMin: filterPriceSaleMin,
    saleMax: filterPriceSaleMax,
    rentMin: filterPriceRentMin,
    rentMax: filterPriceRentMax,
    minRating: filterRatingMin,
    offerType: filterOfferType,
  }

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    hasNextPage,
  } = useInfiniteSearchListings(queryParams)

  const applyFilters = useCallback(
    (filters: {
      categoryIds: string[]
      location: string
      locOfferType: OfferType
      saleMin: number
      saleMax: number
      rentMin: number
      rentMax: number
      ratingMin: number
    }) => {
      setFilterCategoryIds(filters.categoryIds)
      setFilterLocation(filters.location)
      setFilterOfferType(filters.locOfferType)
      setFilterPriceSaleMin(filters.saleMin)
      setFilterPriceSaleMax(filters.saleMax)
      setFilterPriceRentMin(filters.rentMin)
      setFilterPriceRentMax(filters.rentMax)
      setFilterRatingMin(filters.ratingMin)

      setFiltersVisible(false)

      // Reset infinite pagination if needed:
      // e.g. queryClient.resetQueries(...) or useInfiniteQuery's reset()
    },
    [refetch]
  )

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
    <View style={[globalStyles.pageContainer]}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          mode="outlined"
          outlineStyle={{
            borderRadius: 24,
          }}
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
          onPress={() => setFiltersVisible((prev) => !prev)}
          style={[styles.filterChip, filtersVisible && styles.chipSelected]}
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
            mode={
              sortBy === "price" && sortOrder === "asc" ? "flat" : "outlined"
            }
            onPress={() => {
              const on = !(sortBy === "price" && sortOrder === "asc")
              setSortBy(on ? "price" : undefined)
              setSortOrder(on ? "asc" : undefined)
              setNearest(false)
            }}
            style={[
              styles.chip,
              sortBy === "price" && sortOrder === "asc" && styles.chipSelected,
            ]}
            icon="piggy-bank"
          >
            Cheapest
          </Chip>

          <Chip
            selected={sortBy === "price" && sortOrder === "desc"}
            mode={
              sortBy === "price" && sortOrder === "desc" ? "flat" : "outlined"
            }
            onPress={() => {
              const on = !(sortBy === "price" && sortOrder === "desc")
              setSortBy(on ? "price" : undefined)
              setSortOrder(on ? "desc" : undefined)
              setNearest(false)
            }}
            style={[
              styles.chip,
              sortBy === "price" && sortOrder === "desc" && styles.chipSelected,
            ]}
            icon="currency-usd"
          >
            Highest Price
          </Chip>

          <Chip
            selected={nearest}
            mode={nearest ? "flat" : "outlined"}
            onPress={toggleNearest}
            style={[styles.chip, nearest && styles.chipSelected]}
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
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              No results found for current search params.
            </Text>
          )}
        />
      )}

      <FilterOverlay
        visible={filtersVisible}
        onDismiss={() => setFiltersVisible(false)}
        onApply={applyFilters}
      />
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "space-evenly",
      justifyContent: "center",
      // backgroundColor: theme.colorWhite,
      paddingHorizontal: 18,
      backgroundColor: theme.colors.background,
      gap: 24,
    },

    searchRow: {
      marginBottom: 12,
    },
    searchInput: {
      // backgroundColor: theme.colors.onBackground,
      // borderRadius: 24,
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
    chip: {
      marginRight: 8,
    },
    chipScrollRow: {
      flexDirection: "row",
    },
    chipSelected: {
      backgroundColor: "#7F3DFF", // purple background
      color: "#FFFFFF", // white text
    },
    list: {
      paddingBottom: 16,
    },
    loader: {
      marginTop: 32,
    },
    emptyListText: {
      textAlign: "center",
      marginTop: 32,
      color: theme.colors.primary,
    },
  })
