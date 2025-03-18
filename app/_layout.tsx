import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { Stack, useRouter, useSegments } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import "react-native-reanimated"

import { useColorScheme } from "@/components/useColorScheme"
import { useEffect, useState } from "react"
import { auth } from "@/firebaseConfig"
import { onAuthStateChanged, User } from "firebase/auth"
import { ActivityIndicator, View } from "react-native"
import useUserStore from "@/store"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const setUser = useUserStore(({ setUser }) => setUser)
  const user = useUserStore(({ user }) => user)

  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(true)

  const colorScheme = useColorScheme()

  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    // Firebase autentifikácia - získanie používateľa
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("onAuthStateChanged:", currentUser)
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser])

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (auth.currentUser) {
      console.log("User is authenticated, redirecting...")
      router.replace("/(auth)/home")
    } else if (!auth.currentUser && inAuthGroup) {
      console.log("User not authenticated, redirecting to login")
      router.replace("/")
    }
  }, [auth.currentUser, loading, router, segments])

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        <Stack.Screen
          redirect
          name="oauthredirect"
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  )
}
