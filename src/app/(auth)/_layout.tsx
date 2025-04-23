import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { Tabs } from "expo-router"
import { useEffect } from "react"
import { useTheme } from "react-native-paper"

import { apiRegisterDeviceToken } from "@/src/api/watchdog"
import { useNotification } from "@/src/context/notifications-context"
import { useRegisterDeviceNotificationsToken } from "@/src/lib/notifications"
export default function Layout() {
  const theme = useTheme()
  const { expoPushToken } = useNotification()
  const registerDeviceTokenQuery = useRegisterDeviceNotificationsToken()

  useEffect(() => {
    async function registerExpoToken() {
      if (expoPushToken === null) {
        return
      }
      registerDeviceTokenQuery.mutate(expoPushToken)
    }
    registerExpoToken()
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
        name="(create-listing)"
        options={{
          title: "Create Listing",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
          ),
          headerShown: false,
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
