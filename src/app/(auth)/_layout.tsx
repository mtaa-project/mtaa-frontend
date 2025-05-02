import { Slot, Stack, Redirect } from "expo-router"
// import { useAuth } from "@/src/hooks/useAuth" // príklad

export default function AuthLayout() {
  //   const user = useAuth()

  // ak nie je prihlásený, pošli na root:
  //   if (!user) return <Redirect href="/" />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* ← Stačí Slot, Stack alebo Tabs podľa potreby */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="listings/[id]/edit/[step]/edit-listing"
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
