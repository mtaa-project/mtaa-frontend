import { Advert, OfferType } from "@/src/api/types"
import { View, Image, StyleSheet } from "react-native"
import { Button, Chip, MD3Theme, Text, useTheme } from "react-native-paper"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

type Props = {
  advert: Advert
}

type PropsChipOfferType = {
  offerType: OfferType
}

const ChipOfferType: React.FC<PropsChipOfferType> = ({ offerType }) => {
  return (
    <Chip
      icon={({ size, color }) => (
        <MaterialIcons name="sell" size={size} color={color} />
      )}
      onPress={() => console.log("Pressed")}
    >
      {offerType}
    </Chip>
  )
}

export const AdvertCard: React.FC<Props> = ({ advert }) => {
  const theme = useTheme()
  const styles = createStyle(theme)

  const title =
    advert.title.length > 25
      ? advert.title.substring(0, 25) + "..."
      : advert.title
  const description =
    advert.description.length > 25
      ? advert.description.substring(0, 25) + "..."
      : advert.description

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
          <ChipOfferType offerType={advert.offerType} />
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
