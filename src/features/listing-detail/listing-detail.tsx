import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import {
  Button,
  Card,
  IconButton,
  type MD3Theme,
  Text,
  useTheme,
} from "react-native-paper"

import { useListingDetails } from "@/src/api/listings/queries"
import { useGlobalStyles } from "@/src/components/global-styles"
import { ImageCarouselChat } from "@/src/components/image-carousel/image-carousel"
import { ProfileCard } from "@/src/components/profile-card/profile-card"

import {
  useRemoveLikeListing,
  useUpdateLikeListing,
} from "../favorites/services/mutations"
import { ContactMethodModal } from "./components/contact-method-modal"
import { useSellerContact } from "./services/queries"

type Props = {
  listingId: number
}

export const ListingDetail: React.FC<Props> = ({ listingId }) => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const globalStyles = useGlobalStyles()
  const router = useRouter()

  // 1) Fetch listing
  const {
    data: item,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useListingDetails(listingId)

  // 2) Local UI state
  const [liked, setLiked] = useState(item?.liked ?? false)
  const [contactVisible, setContactVisible] = useState(false)

  // 3) When the listing arrives, initialize `liked`
  useEffect(() => {
    if (item) {
      setLiked(item.liked)
    }
  }, [item])

  // 4) Fire off seller‐contact query only once we have an item
  const sellerContactQuery = useSellerContact(item?.seller.id ?? 0)
  const sellerContact = sellerContactQuery.data

  // 5) Mutations
  const addLike = useUpdateLikeListing()
  const removeLike = useRemoveLikeListing()

  const onHeartPress = () => {
    setLiked((prev) => !prev)
    // safe to do `item!.id` here because we guard below
    if (liked) removeLike.mutate(item!.id)
    else addLike.mutate(item!.id)
  }

  // 6) Loading / error guards
  if (isLoading) return <Text>Loading…</Text>
  if (isError) return <Text>Error: {error.message}</Text>
  if (isSuccess) {
    // ── From this point on, `item` is guaranteed to be defined ──
    return (
      <>
        <ScrollView
          style={globalStyles.pageContainer}
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        >
          <Text variant="headlineLarge" style={globalStyles.pageTitle}>
            {item.title}
          </Text>

          <View style={styles.carouselWrapper}>
            <ImageCarouselChat images={item.imagePaths} />
            <IconButton
              icon={liked ? "heart" : "heart-outline"}
              size={32}
              style={styles.heart}
              onPress={onHeartPress}
            />
          </View>

          <ProfileCard userId={item.seller.id} />

          <View style={styles.priceContainer}>
            <Text variant="headlineMedium" style={styles.priceText}>
              {item.price} €
            </Text>
          </View>

          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="bodyMedium">{item.description}</Text>
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
          sellerName={`${item.seller.firstname} ${item.seller.lastname}`}
          sellerEmail={sellerContact?.email}
          sellerPhone={sellerContact?.phoneNumber}
          listingTitle={item.title}
        />
      </>
    )
  }
  return (
    <View>
      <Text>Loading…</Text>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    carouselWrapper: {
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
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
