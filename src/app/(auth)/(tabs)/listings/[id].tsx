import { ListingDetail } from "@/src/features/listing-detail/listing-detail"
import { useLocalSearchParams } from "expo-router"

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams()

  return <ListingDetail listingId={Number(id)}></ListingDetail>
}
