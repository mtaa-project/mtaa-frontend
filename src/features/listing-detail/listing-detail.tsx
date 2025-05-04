import { useRouter } from "expo-router"
import React from "react"
import {
  MD3Theme,
  useTheme,
  Text,
  Button,
  IconButton,
  Card,
} from "react-native-paper"
import { StyleSheet, ScrollView, View } from "react-native"
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
  const removeLike = useRemoveLikeListing()

  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)
  const listingDetailsQuery = useListingDetails(listingId)

  const handleFavoritePress = (listingId: number, liked: boolean) => {
    if (liked) {
      removeLike.mutate(listingId)
    }
  }

  if (listingDetailsQuery.isSuccess) {
    return (
      <ScrollView
        style={globalStyles.pageContainer}
        contentContainerStyle={{ gap: 16 }}
      >
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          {listingDetailsQuery.data.title}
        </Text>
        <View /*style={styles.carouselWrapper}*/>
          <ImageCarouselChat images={listingDetailsQuery.data.imagePaths} />
          <IconButton
            icon={listingDetailsQuery.data.liked ? "heart" : "heart-outline"}
            size={40}
            style={styles.heart}
            onPress={() => removeLike.mutate(listingDetailsQuery.data.id)}
          />
        </View>
        <ProfileCard userId={listingDetailsQuery.data.seller.id} />
        <Text variant="headlineMedium" /*style={styles.price}*/>
          {listingDetailsQuery.data.price} €
        </Text>
        <Card /*</ScrollView>style={styles.section}*/>
          <Text variant="titleLarge">Description</Text>
          <Text variant="bodyMedium">
            {listingDetailsQuery.data.description}
          </Text>
        </Card>
        <Button
          mode="contained"
          icon="phone"
          /*style={styles.contactButton}*/
          onPress={() => console.log("Contact seller")}
        >
          Contact
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
    heart: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: theme.colors.backdrop,
    },
  })
