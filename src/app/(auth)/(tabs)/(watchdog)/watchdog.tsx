import { useRef, useState } from "react"
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native"
import { AnimatedFAB, type MD3Theme, Text, useTheme } from "react-native-paper"
import Animated, { LinearTransition } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

import { Skeleton } from "@/src/components/ui/skeleton"
import { WatchdogModal } from "@/src/features/watchdog/components/watchdog-modal/watchdog-modal"
import { useGetWatchdogList } from "@/src/features/watchdog/services/queries"
import { WatchdogCard } from "@/src/features/watchdog/watchdog-card"
import { useGlobalStyles } from "@/src/components/global-styles"

export default function WatchdogScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)
  const watchdogListQuery = useGetWatchdogList()
  const globalStyles = useGlobalStyles()
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
    <View style={globalStyles.pageContainer}>
      <Text variant="headlineLarge" style={globalStyles.pageTitle}>
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
    },
    skeletonList: {
      flex: 1,
      gap: 20,
    },
    listWrapper: { flex: 1, paddingHorizontal: 20 },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16,
    },
  })
