import {
  apiDisableWatchdog,
  apiEnableWatchdog,
  apiRemoveWatchdog,
  WatchdogItem,
} from "@/src/api/watchdog"
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
  Portal,
  Dialog,
} from "react-native-paper"

export const WatchdogCard: React.FC<WatchdogItem> = ({
  id,
  search_term,
  isActive,
}) => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const [visible, setVisible] = useState(false)
  const [dialogVisible, dialogSetVisible] = useState(false)

  const closeMenu = () => setVisible(false)
  const openMenu = () => setVisible(true)

  const showDialog = () => dialogSetVisible(true)
  const hideDialog = () => dialogSetVisible(false)

  const handleRemoveWatchdog = async () => {
    await apiRemoveWatchdog(id)
    hideDialog()
  }

  const handleEnableWatchdog = async () => {
    await apiEnableWatchdog(id)
    hideDialog()
  }

  const handleDisableWatchdog = async () => {
    await apiDisableWatchdog(id)
    hideDialog()
  }
  console.log(isActive, isActive, isActive)

  return (
    <View style={[styles.watchDogCardContainer, !isActive && styles.disabled]}>
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

        {isActive ? (
          <Menu.Item
            onPress={handleDisableWatchdog}
            title="Disable"
            leadingIcon={() => (
              <Feather name="eye-off" size={24} color="black" />
            )}
          />
        ) : (
          <Menu.Item
            onPress={handleEnableWatchdog}
            title="Enable"
            leadingIcon={() => <Feather name="eye" size={24} color="black" />}
          />
        )}
        <Divider />
        <Menu.Item
          onPress={showDialog}
          title="Delete"
          leadingIcon={() => (
            <AntDesign name="delete" size={24} color="black" />
          )}
        />
      </Menu>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Remove watchdog</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete '{search_term}' watchdog? This
              action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleRemoveWatchdog} textColor="red">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    disabled: {
      backgroundColor: theme.colors.surfaceDisabled,
    },
  })
