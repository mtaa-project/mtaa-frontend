import { useRouter } from "expo-router"
import React from "react"
import { MD3Theme, useTheme, Text, Button } from "react-native-paper"
import { StyleSheet, ScrollView } from "react-native"
import { useRemoveLikeListing } from "../favorites/services/mutations"
import { useGlobalStyles } from "@/src/components/global-styles"
import { useListingDetails } from "@/src/api/listings/queries"
import { ImageCarouselChat } from "@/src/components/image-carousel/image-carousel"
import { ProfileCard } from "@/src/components/profile-card/profile-card"

type Props = {
  listingId: number
}

export const ListingDetail: React.FC<Props> = ({ listingId }) => {
  const router = useRouter()
  const removeListingMutation = useRemoveLikeListing()

  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)
  const listingDetailsQuery = useListingDetails(listingId)

  const handleFavoritePress = (listingId: number, liked: boolean) => {
    if (liked) {
      removeListingMutation.mutate(listingId)
    }
  }

  if (listingDetailsQuery.isSuccess) {
    return (
      <ScrollView style={globalStyles.pageContainer}>
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          {listingDetailsQuery.data.title}
        </Text>
        <ImageCarouselChat images={listingDetailsQuery.data.imagePaths} />
        <ProfileCard userId={listingDetailsQuery.data.seller.id} />
        <Text>{listingDetailsQuery.data.description}</Text>
        <Button
          onPress={() =>
            handleFavoritePress(
              listingDetailsQuery.data.id,
              listingDetailsQuery.data.liked
            )
          }
        >
          Unlike
        </Button>
      </ScrollView>
    )
  } else if (listingDetailsQuery.isLoading) {
    return <Text>Loading...</Text>
  } else if (listingDetailsQuery.isError) {
    return <Text>Error: {listingDetailsQuery.error.message}</Text>
  }
}
const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      paddingBlock: 12,
      paddingInline: 14,
      borderRadius: 12,
    },
    userInfoContainer: {
      flexDirection: "column",
      gap: 2,
    },
    row: {
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    },
  })
