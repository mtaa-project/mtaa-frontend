import { useTheme } from "react-native-paper"

export const useGlobalStyles = () => {
  const theme = useTheme()

  return {
    pageContainer: {
      flex: 1,
      gap: 8,
      paddingInline: 16,
      paddingBlock: 16,
      backgroundColor: theme.colors.background,
    },
    pageTitle: {
      backgroundColor: theme.colors.surfaceVariant,
      marginBlock: 20,
      padding: 16,
      borderRadius: 14,
    },
  }
}
