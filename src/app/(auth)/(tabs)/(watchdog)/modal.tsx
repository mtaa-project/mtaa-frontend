import { StyleSheet, Text, View } from "react-native"
import { type MD3Theme, useTheme } from "react-native-paper"

export default function Modal() {
  const theme = useTheme()
  const styles = createStyles(theme)
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
    </View>
  )
}
const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
  })
