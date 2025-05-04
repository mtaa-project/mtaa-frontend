import React from "react"
import { StyleSheet, View } from "react-native"
import { Chip, useTheme, MD3Theme } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { OfferType } from "@/src/api/types"

export const OfferChips: React.FC<{ offerType: OfferType }> = ({
  offerType,
}) => {
  const theme = useTheme()
  const styles = makeStyles(theme)

  // normalize offerType into array, expand "both"
  let types: OfferType[] = []
  if (offerType !== "both") {
    types = [offerType]
  } else {
    types = ["buy" as OfferType, "rent" as OfferType]
  }

  return (
    <View style={styles.container}>
      {types.map((type) => {
        const isBuy = type === "buy"
        const iconName = isBuy ? "hand-coin-outline" : "handshake-outline"
        const bgColor = isBuy ? "#FBBF24" : "#C084FC"
        return (
          <Chip
            onPress={() => console.log("Pressed" + " " + type)}
            key={type}
            mode="flat"
            icon={({ size }) => (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color="#000"
              />
            )}
            style={[styles.chip, { backgroundColor: bgColor }]}
            textStyle={styles.text}
          >
            {isBuy ? "buy" : "rent"}
          </Chip>
        )
      })}
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: { flexDirection: "row" },
    chip: {
      paddingHorizontal: 0,
      marginLeft: 8,
    },
    text: {
      fontWeight: "600",
      color: "#000",
    },
  })
