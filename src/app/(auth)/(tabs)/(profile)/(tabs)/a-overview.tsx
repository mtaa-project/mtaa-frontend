import { ScrollView, StyleSheet, View } from "react-native"
import { type MD3Theme, Text, useTheme } from "react-native-paper"

import { ThemeSwitchButton } from "@/src/components/theme-switch-button/theme-switch-button"
import ProfileControl from "@/src/features/profile/components/profile-control"
import { StatisticsCard } from "@/src/features/profile/components/statistics-card"
import { UserDetails } from "@/src/features/profile/components/user-details/user-details"

export default function OverviewScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)
  return (
    <ScrollView style={styles.container}>
      <StatisticsCard />
      <ProfileControl />
      <View style={styles.changeThemeContainer}>
        <Text>Change theme</Text>

        <ThemeSwitchButton />
      </View>
      <UserDetails />
    </ScrollView>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // paddingBlock: 20,
      backgroundColor: theme.colors.onSecondary,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    changeThemeContainer: {
      paddingBlock: 22,
      flexDirection: "row",
      justifyContent: "space-around",
    },
  })
