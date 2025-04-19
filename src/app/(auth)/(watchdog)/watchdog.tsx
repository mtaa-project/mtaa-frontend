import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native"
import { Text, MD3Theme, useTheme, AnimatedFAB } from "react-native-paper"
import { useEffect, useRef, useState } from "react"
import { WatchdogModal } from "@/src/features/watchdog/components/watchdog-modal/watchdog-modal"
import { apiGetMyWatchdogList, WatchdogItem } from "@/src/api/watchdog"
import { SafeAreaView } from "react-native-safe-area-context"

import { WatchdogCard } from "@/src/features/watchdog/watchdog-card"
// type UserSearchAlert = {
//   id: number
//   is_active: boolean
//   product_filters: Record<string, unknown>
//   created_at: Date
//   last_notified_at: Date
//   user_id: number
// }
export default function WatchdogScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)

  const [watchdogList, setWatchdogList] = useState<WatchdogItem[]>([])

  useEffect(() => {
    const fetchWatchdogList = async () => {
      const watchdogList = await apiGetMyWatchdogList()
      setWatchdogList(watchdogList)
    }

    fetchWatchdogList()
  }, [])

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
  }
  const toggleModalVisibility = () => {
    setModalVisible((visible) => !visible)
  }

  return (
    <View style={styles.root}>
      <Text variant="headlineLarge" style={styles.title}>
        Watchdog
      </Text>

      <SafeAreaView style={styles.listWrapper} edges={["bottom"]}>
        <FlatList
          data={watchdogList}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <WatchdogCard
              id={item.id}
              search_term={item.search_term}
              isActive={item.isActive}
            />
          )}
          keyExtractor={(item) => `${item.id}`}
          ListEmptyComponent={<Text>No alerts yet</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 120 }}
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
      <WatchdogModal visible={modalVisible} onDismiss={handleModalDismiss} />
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
