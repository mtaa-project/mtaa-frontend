import Feather from "@expo/vector-icons/Feather"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { View, StyleSheet } from "react-native"
import { MD3Theme, Text, useTheme } from "react-native-paper"
import { useUserProfile } from "../services/queries"

export const StatisticsCard = () => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const userProfileQuery = useUserProfile(undefined, true)

  return (
    <View style={styles.statisticsContainer}>
      <View style={styles.statisticsItem}>
        <FontAwesome name="handshake-o" size={24} color="black" />
        <View style={styles.statisticItemInfo}>
          <Text variant="titleLarge">
            {userProfileQuery.data?.amountRentListing ?? ""}
          </Text>
          <Text>Rent Items</Text>
        </View>
      </View>
      <View style={styles.statisticsItem}>
        <Feather name="shopping-cart" size={24} color="black" />
        <View style={styles.statisticItemInfo}>
          <Text variant="titleLarge">
            {userProfileQuery.data?.amountSoldListing ?? ""}
          </Text>
          <Text>Sold Items</Text>
        </View>
      </View>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    statisticsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 20,
      marginBlockStart: 20,
      paddingBlock: 25,
      paddingInline: 30,
      gap: 20,
    },
    statisticsItem: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    statisticItemInfo: {
      //   gap: 4,
    },
  })
