import { WatchdogItem } from "@/src/api/watchdog"
import AntDesign from "@expo/vector-icons/AntDesign"
import Feather from "@expo/vector-icons/Feather"
import { useState } from "react"
import { View, StyleSheet } from "react-native"
import {
  useTheme,
  Text,
  Menu,
  Button,
  Divider,
  MD3Theme,
} from "react-native-paper"

export const WatchdogCard: React.FC<WatchdogItem> = ({ id, search_term }) => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const openMenu = () => setVisible(true)
  const [visible, setVisible] = useState(false)

  const closeMenu = () => setVisible(false)

  return (
    <View style={styles.watchDogCardContainer}>
      <Text variant="titleMedium">{search_term}</Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>Show menu</Button>}
      >
        <Menu.Item
          onPress={() => {}}
          title="Edit"
          leadingIcon={() => <AntDesign name="edit" size={24} color="black" />}
        />
        <Menu.Item
          onPress={() => {}}
          title="Hide"
          leadingIcon={() => <Feather name="eye-off" size={24} color="black" />}
        />
        <Divider />
        <Menu.Item
          onPress={() => {}}
          title="Delete"
          leadingIcon={() => (
            <AntDesign name="delete" size={24} color="black" />
          )}
        />
      </Menu>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    watchDogCardContainer: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",

      backgroundColor: theme.colors.surfaceVariant,
      paddingBlock: 12,
      marginBlock: 5,
      borderRadius: 7,
      paddingInline: 20,
    },
  })
