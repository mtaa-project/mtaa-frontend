/**
import { ApiListingGet } from "@/src/api/types"
import { useRemoveLikeListing } from "@/src/features/favorites/services/mutations"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet } from "react-native"
import { Button, MD3Theme, Text, useTheme } from "react-native-paper"
import { useGlobalStyles } from "../global-styles"

type Props = {
  item: ApiListingGet
  //   variant?: "mobile" | "tablet" there is a hook that will tell me the width of screen
}
export const ListingCard: React.FC<Props> = ({ item }) => {
  const router = useRouter()
  const removeListingMutation = useRemoveLikeListing()
  const theme = useTheme()
  const globalStyles = useGlobalStyles()
  const styles = createStyles(theme)

  const handleFavoritePress = (listingId: number, liked: boolean) => {
    if (liked) {
      removeListingMutation.mutate(listingId)
    }
  }
  return (
    <Pressable
      onPress={() => router.push(`/(auth)/(tabs)/listings/${item.id}`)}
    >
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>

      <Button onPress={() => handleFavoritePress(item.id, item.liked)}>
        Unlike
      </Button>
    </Pressable>
  )
}

// change these styles according to the design
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
 */

// components/listing-card/ListingCard.tsx
import React from "react"
import { View, StyleSheet, Pressable, Image } from "react-native"
import {
  Card,
  Avatar,
  IconButton,
  Chip,
  Text,
  useTheme,
  MD3Theme,
} from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ApiListingGet } from "@/src/api/types"
import { useRemoveLikeListing } from "@/src/features/favorites/services/mutations"
import { useRouter } from "expo-router"

type Props = { item: ApiListingGet }
export const ListingCard: React.FC<Props> = ({ item }) => {
  const router = useRouter()
  const theme = useTheme()
  const styles = makeStyles(theme)
  const removeLike = useRemoveLikeListing()

  const onHeartPress = () => {
    if (item.liked) removeLike.mutate(item.id)
  }

  return (
    <Pressable
      onPress={() => router.push(`/(auth)/(tabs)/listings/${item.id}`)}
    >
      <Card style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.imagePaths[0] }} style={styles.image} />
          <IconButton
            icon={item.liked ? "heart" : "heart-outline"}
            size={24}
            style={styles.heart}
            onPress={onHeartPress}
          />
          <View style={styles.locationBadge}>
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="labelSmall"
              style={{ marginLeft: 4, color: theme.colors.onSurfaceVariant }}
            >
              {item.address.city}
            </Text>
          </View>
        </View>

        <Card.Content style={styles.content}>
          <View style={styles.headerRow}>
            <Avatar.Text
              size={32}
              label={item.seller.firstname.charAt(0)}
              style={{ backgroundColor: theme.colors.primaryContainer }}
            />
            <View style={styles.sellerInfo}>
              <Text variant="labelMedium">
                {item.seller.firstname} {item.seller.lastname}
              </Text>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons
                  name="star"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall" style={{ marginLeft: 2 }}>
                  {item.seller.rating ?? 0}/5
                </Text>
              </View>
            </View>
            <Chip
              icon="handshake"
              mode="flat"
              style={styles.statusChip}
              textStyle={styles.statusText}
            >
              {item.offerType /* e.g. “Selling” */}
            </Chip>
          </View>

          <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text variant="titleSmall" style={styles.price}>
            {item.price}€
          </Text>
          <Text
            variant="bodySmall"
            style={styles.desc}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.colors.surfaceVariant,
      marginVertical: 8,
    },
    imageWrapper: {
      position: "relative",
    },
    image: {
      width: "100%",
      height: 120,
    },
    heart: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: theme.colors.backdrop,
    },
    locationBadge: {
      position: "absolute",
      bottom: 8,
      left: 8,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.backdrop,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    content: {
      paddingTop: 8,
      paddingHorizontal: 12,
      paddingBottom: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    sellerInfo: {
      flex: 1,
      marginLeft: 8,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    statusChip: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    statusText: {
      color: theme.colors.onSecondaryContainer,
      fontWeight: "600",
    },
    title: {
      fontWeight: "600",
      marginBottom: 4,
    },
    price: {
      fontWeight: "bold",
      marginBottom: 6,
    },
    desc: {
      color: theme.colors.onSurfaceVariant,
    },
  })
