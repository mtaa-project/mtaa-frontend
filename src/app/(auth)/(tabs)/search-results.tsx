import React from "react"
import { useLocalSearchParams } from "expo-router"
import { SearchResults } from "@/src/features/search-results/search-results-screen"

export default function SearchResultsScreen() {
  const { query } = useLocalSearchParams<{ query: string }>()

  return <SearchResults search={query} />
}
