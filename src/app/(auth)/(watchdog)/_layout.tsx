import AntDesign from "@expo/vector-icons/AntDesign"
import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="watchdog" options={{ headerShown: false }} />
    </Stack>
  )
}
