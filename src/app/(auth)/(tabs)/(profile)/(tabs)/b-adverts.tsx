import { StyleSheet, View } from "react-native"
import { type MD3Theme, useTheme } from "react-native-paper"

import { AdvertList } from "@/src/features/profile/components/advert-list/advert-list"

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
    container: {
      flex: 1,
      backgroundColor: theme.colors.onSecondary,

      paddingInline: 12,
    }, // <— very important so swipe gestures & nesting work
  })
