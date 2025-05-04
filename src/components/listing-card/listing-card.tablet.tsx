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
import { ApiListingGet, OfferType } from "@/src/api/types"
import { useRemoveLikeListing } from "@/src/features/favorites/services/mutations"
import { useRouter } from "expo-router"

type Props = { item: ApiListingGet }
export const ListingCardTablet: React.FC<Props> = ({ item }) => {
  const router = useRouter()
  const theme = useTheme()
  const styles = makeStyles(theme)
  const removeLike = useRemoveLikeListing()

  const onHeartPress = () => {
    if (item.liked) removeLike.mutate(item.id)
  }

  // normalize into array
  let offerTypes: OfferType[] = []
  if (item.offerType !== "both") {
    offerTypes = [item.offerType]
  } else {
    offerTypes = ["buy" as OfferType, "rent" as OfferType]
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
              variant="labelLarge"
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
            <View style={styles.chipContainer}>
              {offerTypes.map((type) => (
                <Chip
                  key={type}
                  icon={({ size }) => (
                    <MaterialCommunityIcons
                      name={type === "buy" ? "hand-coin" : "handshake"}
                      size={size}
                      color="#000000" // Set icon color to black
                    />
                  )}
                  mode="flat"
                  style={[
                    styles.statusChip,
                    type === "buy" ? styles.sellingChip : styles.rentingChip,
                  ]}
                  textStyle={[
                    styles.statusText,
                    type === "buy" ? styles.sellingText : styles.rentingText,
                  ]}
                >
                  {type}
                </Chip>
              ))}
            </View>
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
    chipContainer: {
      flexDirection: "row",
      gap: 8,
    },
    statusChip: {
      // shared flat‐chip overrides
      paddingHorizontal: 0,
    },
    sellingChip: {
      backgroundColor: "#FBBF24", // golden/orange
    },
    rentingChip: {
      backgroundColor: "#C084FC", // purple
    },
    statusText: {
      fontWeight: "600",
    },
    sellingText: {
      color: "#000000",
    },
    rentingText: {
      color: "#000000",
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
