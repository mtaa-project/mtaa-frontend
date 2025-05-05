import { Advert, ListingStatus } from "@/src/api/types"
import { View, Image, StyleSheet } from "react-native"
import {
  ActivityIndicator,
  Button,
  Chip,
  MD3Theme,
  Menu,
  Text,
  useTheme,
} from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { AntDesign, Entypo, Feather } from "@expo/vector-icons"
import { useState } from "react"
import { useRouter } from "expo-router"
import {
  useDeleteAdvert,
  useHideAdvert,
  useShowAdvert,
} from "./services/mutations"

type Props = {
  advert: Advert
}

type PropsChipListingStatus = {
  listingStatus: ListingStatus
}

const ChipOfferType: React.FC<PropsChipListingStatus> = ({ listingStatus }) => {
  return (
    <Chip
      icon={({ size, color }) => (
        <MaterialIcons name="sell" size={size} color={color} />
      )}
      onPress={() => console.log("Pressed")}
    >
      {listingStatus}
    </Chip>
  )
}

export const AdvertCard: React.FC<Props> = ({ advert }) => {
  const theme = useTheme()
  const styles = createStyle(theme)
  const router = useRouter()
  const hideAdvertMutation = useHideAdvert()
  const deleteAdvertMutation = useDeleteAdvert()
  const showAdvertMutation = useShowAdvert()

  const title =
    advert.title.length > 25
      ? advert.title.substring(0, 25) + "..."
      : advert.title
  const description =
    advert.description.length > 25
      ? advert.description.substring(0, 25) + "..."
      : advert.description

  const [dialogVisible, dialogSetVisible] = useState(false)
  const [visible, setVisible] = useState(false)

  const showDialog = () => dialogSetVisible(true)
  const hideDialog = () => dialogSetVisible(false)
  const closeMenu = () => setVisible(false)
  const openMenu = () => setVisible(true)

  const listingSoldOrRented =
    advert.listingStatus === "sold" || advert.listingStatus === "rented"

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        {advert.imagePath.length > 0 ? (
          <Image
            source={{ uri: advert.imagePath }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={{ gap: 8 }}>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <ChipOfferType listingStatus={advert.listingStatus} />
          <Menu
            anchorPosition="bottom"
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="outlined"
                icon={({ color, size }) => (
                  <Entypo
                    name="dots-three-vertical"
                    size={size}
                    color={color}
                  />
                )}
                contentStyle={
                  {
                    // backgroundColor: theme.colors.surface,
                  }
                }
                onPress={openMenu}
              >
                More
              </Button>
            }
          >
            <Menu.Item
              disabled={listingSoldOrRented}
              onPress={() => {
                closeMenu()
                router.push({
                  pathname: "/(auth)/listings/[id]/edit/[step]/edit-listing",
                  params: { id: advert.id, step: "0" },
                })
              }}
              title="Edit"
              leadingIcon={({ color, size }) => (
                <AntDesign name="edit" size={size} color={color} />
              )}
            />

            {advert.listingStatus === "active" ? (
              <Menu.Item
                disabled={listingSoldOrRented}
                onPress={async () => {
                  await hideAdvertMutation.mutateAsync(advert.id)
                  closeMenu()
                }}
                title="Hide"
                leadingIcon={({ color, size }) =>
                  hideAdvertMutation.isPending ? (
                    <ActivityIndicator
                      size={size}
                      color={color}
                      style={{ marginRight: 4 }}
                    />
                  ) : (
                    <Feather name="eye-off" size={size} color={color} />
                  )
                }
              />
            ) : (
              <Menu.Item
                onPress={async () => {
                  await showAdvertMutation.mutateAsync(advert.id)
                  closeMenu()
                }}
                disabled={listingSoldOrRented}
                title="Show"
                leadingIcon={({ color, size }) =>
                  hideAdvertMutation.isPending ? (
                    <ActivityIndicator
                      size={size}
                      color={color}
                      style={{ marginRight: 4 }}
                    />
                  ) : (
                    <AntDesign name="eye" size={size} color={color} />
                  )
                }
              />
            )}
            <Menu.Item
              onPress={async () => {
                await deleteAdvertMutation.mutateAsync(advert.id)
                closeMenu()
              }}
              disabled={listingSoldOrRented}
              title="Remove"
              leadingIcon={({ color, size }) =>
                deleteAdvertMutation.isPending ? (
                  <ActivityIndicator
                    size={size}
                    color={color}
                    style={{ marginRight: 4 }}
                  />
                ) : (
                  <AntDesign name="delete" size={size} color={color} />
                )
              }
            />
          </Menu>
          {/* <Button>More</Button> */}
        </View>

        <View style={{ gap: 2 }}>
          <Text variant="titleSmall">{title}</Text>
          <Text variant="labelMedium">{advert.price}$</Text>
          <Text variant="bodySmall">{description}</Text>
        </View>
      </View>
    </View>
  )
}

const createStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 16,
      flexDirection: "row",
      gap: 16,
      padding: 10,
    },
    column: {
      flexDirection: "column",
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    image: {
      width: 90,
      height: 90,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
    },
    placeholder: {
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      color: theme.colors.onSurface,
      fontSize: 12,
    },
  })
