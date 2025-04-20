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
  Portal,
  Dialog,
  ActivityIndicator,
} from "react-native-paper"
import {
  useDisableWatchdog,
  useEnableWatchdog,
  useRemoveWatchdog,
} from "./services/mutations"
import Animated, {
  FadeIn,
  LinearTransition,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated"
import Entypo from "@expo/vector-icons/Entypo"
type WatchdogCardType = {
  onEdit(id: number): void
}

export const WatchdogCard: React.FC<WatchdogItem & WatchdogCardType> = ({
  id,
  search,
  isActive,
  onEdit,
}) => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const watchdogRemoveQuery = useRemoveWatchdog()
  const watchdogDisableQuery = useDisableWatchdog()
  const watchdogEnableQuery = useEnableWatchdog()

  const [visible, setVisible] = useState(false)
  const [dialogVisible, dialogSetVisible] = useState(false)

  const closeMenu = () => setVisible(false)
  const openMenu = () => setVisible(true)

  const showDialog = () => dialogSetVisible(true)
  const hideDialog = () => dialogSetVisible(false)

  const handleRemoveWatchdog = async () => {
    closeMenu()
    hideDialog()
    await watchdogRemoveQuery.mutateAsync(id)
  }

  const handleEnableWatchdog = async () => {
    closeMenu()
    hideDialog()
    await watchdogEnableQuery.mutateAsync(id)
  }

  const handleDisableWatchdog = async () => {
    closeMenu()
    hideDialog()
    try {
      await watchdogDisableQuery.mutateAsync(id)
    } catch (err) {
      // console.error("Enable failed:", err)
    }
  }

  return (
    <Animated.View
      style={[styles.watchDogCardContainer, !isActive && styles.disabled]}
      layout={LinearTransition}
      exiting={SlideInLeft.duration(600)}
      entering={FadeIn.duration(250)}
      // layout={LinearTransition.springify()}
    >
      <Text variant="titleMedium">{search}</Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            icon={({ color, size }) => (
              <Entypo name="dots-three-vertical" size={size} color={color} />
            )}
            contentStyle={
              {
                // backgroundColor: theme.colors.surface,
              }
            }
            onPress={openMenu}
          >
            More
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            closeMenu()
            onEdit(id)
          }}
          title="Edit"
          leadingIcon={({ color, size }) => (
            <AntDesign name="edit" size={size} color={color} />
          )}
        />

        {isActive ? (
          <Menu.Item
            onPress={handleDisableWatchdog}
            title="Disable"
            leadingIcon={({ color, size }) => (
              <Feather name="eye-off" size={size} color={color} />
            )}
          />
        ) : (
          <Menu.Item
            onPress={handleEnableWatchdog}
            title="Enable"
            leadingIcon={({ color, size }) => (
              <Feather name="eye" size={size} color={color} />
            )}
          />
        )}
        <Divider />
        <Menu.Item
          onPress={showDialog}
          title="Delete"
          disabled={watchdogRemoveQuery.isPending}
          leadingIcon={({ color, size }) => (
            <AntDesign name="delete" size={size} color={color} />
          )}
          trailingIcon={({ size }) =>
            watchdogRemoveQuery.isPending ? (
              <ActivityIndicator size={size} />
            ) : null
          }
        />
      </Menu>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Remove watchdog</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete '{search}' watchdog? This action
              cannot be undone.
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
    </Animated.View>
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
