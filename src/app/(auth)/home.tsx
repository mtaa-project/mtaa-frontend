import * as Notifications from "expo-notifications"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { type MD3Theme, Text, useTheme } from "react-native-paper"

import { auth } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"
import { registerForPushNotificationsAsync } from "@/src/lib/notification"

export default function Home() {
  const user = auth.currentUser
  const [users, setUsers] = useState([])
  const theme = useTheme()
  const styles = createStyles(theme)

  // useEffect(() => {
  //   const foo = async () => {
  //     try {
  //       const users = await api.get("/users")
  //       if (users.data) {
  //         setUsers(users.data)
  //       }
  //     } catch {}
  //   }
  //   foo()
  // }, [user])

  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined)
  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    ;(async () => {
      try {
        const token = await registerForPushNotificationsAsync()
        setExpoPushToken(token)
      } catch (error) {
        setExpoPushToken(`${error}`)
      }
    })()

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text>Welcome back {user?.email}</Text>
      <Text style={{ color: "white" }}>data: </Text>

      {users &&
        users.map((user, index) => (
          <Text key={index}>{JSON.stringify(user)}</Text>
        ))}
      {/* <Text>{expoPushToken}</Text> */}
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.primary,
      fontSize: 18,
    },
  })
