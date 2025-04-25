import AntDesign from "@expo/vector-icons/AntDesign"
import Entypo from "@expo/vector-icons/Entypo"
import Feather from "@expo/vector-icons/Feather"
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import {
  ActivityIndicator,
  Button,
  Dialog,
  Divider,
  type MD3Theme,
  Menu,
  Portal,
  Text,
  useTheme,
} from "react-native-paper"
import Animated, {
  FadeIn,
  interpolateColor,
  LinearTransition,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { type WatchdogItem } from "@/src/api/watchdog"

import {
  useDisableWatchdog,
  useEnableWatchdog,
  useRemoveWatchdog,
} from "./services/mutations"
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

  const activeValue = useSharedValue(isActive ? 1 : 0)
  useEffect(() => {
    activeValue.value = withTiming(isActive ? 1 : 0, { duration: 300 })
  }, [isActive])

  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      activeValue.value,
      [0, 1],
      [theme.colors.surfaceDisabled, theme.colors.surfaceVariant]
    )

    return {
      backgroundColor: bg,
      transform: [{ scale: withSpring(activeValue.value === 1 ? 1 : 0.95) }],
    }
  })

  return (
    <Animated.View
      style={[styles.watchDogCardContainer, animatedStyle]}
      layout={LinearTransition}
      exiting={SlideOutRight.duration(300)}
      entering={FadeIn.duration(250)}
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
              <ActivityIndicator size={16} />
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
