import { AdvertList } from "@/src/features/profile/advert-list/advert-list"
import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { MD3Theme, useTheme } from "react-native-paper"

export default function AdvertScreen() {
  const theme = useTheme()
  const styles = createTheme(theme)
  return (
    <View style={styles.container}>
      <AdvertList />
    </View>
  )
}
const createTheme = (theme: MD3Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.onSecondary }, // <— very important so swipe gestures & nesting work
  })
