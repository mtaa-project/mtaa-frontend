import { StyleSheet } from "react-native"
import { type MD3Theme, useTheme } from "react-native-paper"

export const useCreateListingStyles = () => {
  const theme = useTheme()
  const styles = createStyles(theme)

  return styles
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    buttonContainer: {
      justifyContent: "space-around",
      flexDirection: "row",
      gap: 14,
      marginBlockStart: 24,
      marginBlockEnd: 54,
    },
    buttonStyle: {
      flex: 1,
      paddingBlock: 10,
    },
  })
