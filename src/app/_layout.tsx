import "react-native-reanimated"

import { Stack, useRouter, useSegments } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { onAuthStateChanged } from "firebase/auth"
// import { useColorScheme } from "@/components/useColorScheme"
import { useEffect, useState } from "react"
import React from "react"
import { StyleSheet, View } from "react-native"
import {
  ActivityIndicator,
  type MD3Theme,
  PaperProvider,
  Text,
} from "react-native-paper"
import { useTheme } from "react-native-paper"

import { auth } from "@/firebase-config"
import useUserStore from "@/src/store"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const setUser = useUserStore(({ setUser }) => setUser)
  const user = useUserStore(({ user }) => user)
  const setLoading = useUserStore((state) => state.setLoading)
  const theme = useTheme()
  const styles = createStyles(theme) // Create styles based on the theme

  const [initializing, setInitializing] = useState(true)
  const loading = useUserStore((state) => state.loading)
  console.log("loading state: ", loading)

  // const colorScheme = useColorScheme()

  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("onAuthStateChanged:", JSON.stringify(currentUser, null, 2))
      setUser(currentUser)
      if (currentUser !== null) {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [setUser])

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === "(auth)"
    const isLoginRoute = !inAuthGroup // ak prvý segment nie je "(auth)", považujeme, že sme na login

    if (auth.currentUser && isLoginRoute && !loading) {
      console.log("User is authenticated, redirecting...")
      router.replace("/(auth)/home")
    } else if (!auth.currentUser && inAuthGroup && !loading) {
      console.log("User not authenticated, redirecting to login")
      router.replace("/")
    }
  }, [auth.currentUser, loading, router, segments])

  return (
    <PaperProvider>
      {loading ? (
        <AppContent />
      ) : (
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          <Stack.Screen
            redirect
            name="oauthredirect"
            options={{ headerShown: false }}
          />
        </Stack>
      )}
    </PaperProvider>
  )
}

const AppContent = () => {
  const theme = useTheme()
  const styles = createStyles(theme)
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} />
      <Text variant="bodyLarge">Signing in...</Text>
    </View>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <PaperProvider>{children}</PaperProvider>
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
      // Use a theme color for background
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.primary, // use theme primary color for text
      fontSize: 18,
    },
  })
