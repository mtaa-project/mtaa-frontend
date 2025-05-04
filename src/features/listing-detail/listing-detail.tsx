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
import {
  ContactMethod,
  ContactMethodModal,
} from "./components/contact-method-modal"
import { useSellerContact } from "./services/queries"

type Props = {
  listingId: number
}

export const ListingDetail: React.FC<Props> = ({ listingId }) => {
  const removeLike = useRemoveLikeListing()
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)

  const listingDetailsQuery = useListingDetails(listingId)
  const sellerContactQuery = useSellerContact(
    listingDetailsQuery.data?.seller.id
  )
  const sellerContact = sellerContactQuery.data
  const [contactVisible, setContactVisible] = React.useState(false)

  if (listingDetailsQuery.isLoading) return <Text>Loading…</Text>
  if (listingDetailsQuery.isError)
    return <Text>Error: {listingDetailsQuery.error.message}</Text>

  const data = listingDetailsQuery.data!
  const handleFavoritePress = (id: number, liked: boolean) => {
    if (liked) removeLike.mutate(id)
  }

  return (
    <>
      <ScrollView
        style={globalStyles.pageContainer}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          {data.title}
        </Text>

        <View style={styles.carouselWrapper}>
          <ImageCarouselChat images={data.imagePaths} />
          <IconButton
            icon={data.liked ? "heart" : "heart-outline"}
            size={32}
            style={styles.heart}
            onPress={() => handleFavoritePress(data.id, data.liked)}
          />
        </View>

        <ProfileCard userId={data.seller.id} />

        <View style={styles.priceContainer}>
          <Text variant="headlineMedium" style={styles.priceText}>
            {data.price} €
          </Text>
        </View>

        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Description
            </Text>
            <Text variant="bodyMedium">{data.description}</Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          icon="phone"
          style={styles.contactButton}
          onPress={() => setContactVisible(true)}
        >
          Contact
        </Button>
      </ScrollView>
      <ContactMethodModal
        visible={contactVisible}
        onDismiss={() => setContactVisible(false)}
        sellerName={`${data.seller.firstname} ${data.seller.lastname}`}
        sellerEmail={sellerContact?.email}
        sellerPhone={sellerContact?.phoneNumber}
        listingTitle={data.title}
      />
    </>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    carouselWrapper: {
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      // option- ally add a fixed height, or let the carousel define its own
    },
    heart: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: theme.colors.backdrop,
    },
    priceContainer: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    priceText: {
      color: theme.colors.onSurfaceVariant,
    },
    section: {
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceVariant,
    },
    sectionTitle: {
      marginBottom: 8,
      color: theme.colors.primary,
    },
    contactButton: {
      marginTop: 24,
      borderRadius: 24,
      paddingVertical: 8,
    },
  })
