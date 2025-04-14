import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { useEffect, useRef, useState } from "react"
import { Platform, StyleSheet, View } from "react-native"
import { type MD3Theme, Text, useTheme } from "react-native-paper"

import { auth } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  }

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage)
  throw new Error(errorMessage)
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      )
      return
    }
    const projectId = "mtaa-project-5235a"
    if (!projectId) {
      handleRegistrationError("Project ID not found")
    }
    try {
      const pushTokenString = (await Notifications.getDevicePushTokenAsync())
        .data

      console.log("PushToken: ", pushTokenString)
      return pushTokenString
    } catch (e: unknown) {
      handleRegistrationError(`${e}`)
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications")
  }
}

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
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`))

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
