import { View, StyleSheet, ScrollView } from "react-native"
import { Text, MD3Theme, useTheme } from "react-native-paper"
import { useEffect, useState } from "react"
import { api } from "@/src/lib/axios-config"
import { WatchdogModal } from "@/src/components/watchdog-modal/watchdog-modal"

type UserSearchAlert = {
  id: number
  is_active: boolean
  product_filters: Record<string, unknown>
  created_at: Date
  last_notified_at: Date
  user_id: number
}

export default function WatchdogScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)

  const [watchdogList, setWatchdogList] = useState<UserSearchAlert[]>([])

  useEffect(() => {
    const fetchWatchdogList = async () => {
      const response = await api.get<UserSearchAlert[]>("/alerts/my-alerts")
      console.log(response.data)
      setWatchdogList(response.data)
    }

    fetchWatchdogList()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineLarge">Watchdog</Text>
      <WatchdogModal />
      <View>
        {watchdogList.length === 0 ? (
          <Text>No alerts yet</Text>
        ) : (
          watchdogList.map((item) => (
            <Text
              key={item.id}
              style={{ color: "red", fontSize: 18, marginVertical: 4 }}
            >
              Alert #{item.id}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      backgroundColor: theme.colors.background,
    },
  })
