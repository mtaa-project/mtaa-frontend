import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { type MD3Theme, Text, useTheme } from "react-native-paper"

import { auth } from "@/firebase-config"
import { useNotification } from "@/src/context/notifications-context"
import { api } from "@/src/lib/axios-config"

export default function Home() {
  const user = auth.currentUser
  const [users, setUsers] = useState([])
  const theme = useTheme()
  const styles = createStyles(theme)

  const { expoPushToken, error, notification } = useNotification()

  if (error) {
    return (
      <View>
        <Text>Notification Error {error.message}</Text>
      </View>
    )
  }

  useEffect(() => {
    console.log("Expo Push Token: ", expoPushToken)
  }, [])

  useEffect(() => {
    const foo = async () => {
      try {
        const users = await api.get("/users")
        if (users.data) {
          setUsers(users.data)
        }
      } catch {}
    }
    foo()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Welcome back {user?.email}</Text>
      <Text style={{ color: "white" }}>data: </Text>

      {users &&
        users.map((user, index) => (
          <Text key={index}>{JSON.stringify(user)}</Text>
        ))}
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
