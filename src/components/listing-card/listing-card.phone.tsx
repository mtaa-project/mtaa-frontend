import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Image, Pressable, StyleSheet, View } from "react-native"
import {
  Avatar,
  Card,
  IconButton,
  type MD3Theme,
  Text,
  useTheme,
} from "react-native-paper"

import { type ApiListingGet } from "@/src/api/types"
import {
  useRemoveLikeListing,
  useUpdateLikeListing,
} from "@/src/features/favorites/services/mutations"

import { OfferChips } from "./offer-chips"

type Props = { item: ApiListingGet }
export const ListingCardPhone: React.FC<Props> = ({ item }) => {
  const router = useRouter()
  const theme = useTheme()
  const styles = makeStyles(theme)
  const addLike = useUpdateLikeListing()
  const removeLike = useRemoveLikeListing()

  const [liked, setLiked] = React.useState(item.liked)

  const onHeartPress = () => {
    setLiked((prev) => !prev)
    if (liked) removeLike.mutate(item.id)
    else addLike.mutate(item.id)
  }

  return (
    <Pressable
      onPress={() => router.push(`/(auth)/(tabs)/listings/${item.id}`)}
    >
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.imagePaths[0] }}
              style={styles.thumb}
              resizeMode="cover"
            />
            <IconButton
              icon={liked ? "heart" : "heart-outline"}
              size={20}
              style={styles.heart}
              onPress={onHeartPress}
            />
            <View style={styles.locationBadge}>
              <MaterialCommunityIcons
                name="map-marker"
                size={12}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="labelSmall"
                style={[
                  styles.locationText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                numberOfLines={1}
              >
                {item.address.city}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <View style={styles.sellerRow}>
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
              </View>

              <OfferChips offerType={item.offerType} />
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
          </View>
        </View>
      </Card>
    </Pressable>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      overflow: "hidden", // ensure image is clipped
      backgroundColor: theme.colors.surfaceVariant,
      marginVertical: 8,
      maxHeight: 135,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start", // let children size themselves within the maxHeight
      flexShrink: 1, // allow the row to shrink if needed
    },
    imageWrapper: {
      width: 100, // or percentage if you prefer
      height: "100%",
      overflow: "hidden",
    },
    thumb: {
      width: "100%",
      height: "100%",
    },
    heart: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: theme.colors.surfaceVariant,
    },
    locationBadge: {
      position: "absolute",
      bottom: 6,
      left: 6,
      right: 6,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    locationText: {
      marginLeft: 4,
      flexShrink: 1,
    },
    content: {
      flex: 1,
      padding: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    sellerRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    sellerInfo: {
      marginLeft: 8,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    statusChip: {
      paddingHorizontal: 0,
      marginLeft: 8,
    },
    statusText: {
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
