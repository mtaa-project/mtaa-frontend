import { ListingDetail } from "@/src/features/listing-detail/listing-detail"
import { useLocalSearchParams } from "expo-router"
import { View, Text, StyleSheet } from "react-native"

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams()

  return <ListingDetail listingId={Number(id)}></ListingDetail>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
