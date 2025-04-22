import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { Tabs } from "expo-router"
import { useEffect } from "react"
import { useTheme } from "react-native-paper"

import { apiRegisterDeviceToken } from "@/src/api/watchdog"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
export default function Layout() {
  const theme = useTheme()
  const { expoPushToken } = useNotification()

  useEffect(() => {
    let isActive = true

    async function registerExpoToken() {
      try {
        if (expoPushToken !== null) {
          console.log("Push token: ", expoPushToken)

          const registered = await apiRegisterDeviceToken(expoPushToken)
          console.log("Expo token registered:", registered)
        }
      } catch (err) {
        console.error("Failed to get or register Expo push token:", err)
      }
    }
    registerExpoToken()
    return () => {
      isActive = false
    }
  }, [expoPushToken])

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome size={size} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(watchdog)"
        options={{
          title: "Watchdog",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dog" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(watchdog)"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
