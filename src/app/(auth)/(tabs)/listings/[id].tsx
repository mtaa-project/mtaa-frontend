import { useLocalSearchParams } from "expo-router"

import { ListingDetail } from "@/src/features/listing-detail/listing-detail"

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams()

  return <ListingDetail listingId={Number(id)}></ListingDetail>
}
