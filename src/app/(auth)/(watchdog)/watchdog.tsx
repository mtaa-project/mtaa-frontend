import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native"
import {
  Text,
  MD3Theme,
  useTheme,
  AnimatedFAB,
  ActivityIndicator,
} from "react-native-paper"
import { useRef, useState } from "react"
import { WatchdogModal } from "@/src/features/watchdog/components/watchdog-modal/watchdog-modal"
import { SafeAreaView } from "react-native-safe-area-context"

import { WatchdogCard } from "@/src/features/watchdog/watchdog-card"
import { useGetWatchdogList } from "@/src/features/watchdog/services/queries"
import Animated, { LinearTransition } from "react-native-reanimated"
import { Skeleton } from "@/src/components/ui/Skeleton"

export default function WatchdogScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)
  const watchdogListQuery = useGetWatchdogList()

  const [editingId, setEditingId] = useState<number | undefined>(undefined)

  function handleEditWatchdog(id: number) {
    setEditingId(id)
    setModalVisible(true)
  }

  const [isExtended, setIsExtended] = useState(true)
  const scrollOffset = useRef(0)

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = e.nativeEvent.contentOffset.y
    const direction = currentOffset > scrollOffset.current ? "down" : "up"

    const shouldExtend = direction === "up" || currentOffset < 10
    setIsExtended(shouldExtend)
    scrollOffset.current = currentOffset
  }

  const [modalVisible, setModalVisible] = useState(false)

  const handleModalDismiss = () => {
    setModalVisible(false)
    setEditingId(undefined)
  }
  const toggleModalVisibility = () => {
    setModalVisible((visible) => !visible)
  }

  return (
    <View style={styles.root}>
      <Text variant="headlineLarge" style={styles.title}>
        Watchdog List
      </Text>
      {watchdogListQuery.isPending ? (
        <View style={styles.loadingContainer}>
          <View style={[{ padding: 16 }, styles.skeletonList]}>
            {Array.from(Array(10).keys()).map((key) => (
              <Skeleton key={key} height={60} style={{ width: "100%" }} />
            ))}
          </View>
        </View>
      ) : (
        <SafeAreaView style={styles.listWrapper} edges={["bottom"]}>
          <Animated.FlatList
            data={watchdogListQuery.data}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <WatchdogCard
                id={item.id}
                search={item.search}
                isActive={item.isActive}
                onEdit={() => handleEditWatchdog(item.id)}
              />
            )}
            keyExtractor={(item) => `${item.id}`}
            ListEmptyComponent={<Text>No alerts yet</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingBottom: 120 }}
            itemLayoutAnimation={LinearTransition}
          />

          <AnimatedFAB
            icon="plus"
            label="Create alert"
            extended={isExtended}
            onPress={toggleModalVisibility}
            visible
            animateFrom="right"
            iconMode="dynamic"
            style={styles.fab}
          />
        </SafeAreaView>
      )}

      <WatchdogModal
        visible={modalVisible}
        onDismiss={handleModalDismiss}
        id={editingId}
      />
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
    },
    skeletonList: {
      flex: 1,
      gap: 20,
    },
    title: {
      backgroundColor: theme.colors.surfaceVariant,
      margin: 20,
      padding: 16,
      borderRadius: 14,
    },
    listWrapper: { flex: 1, paddingHorizontal: 20 },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16,
    },
  })
