import { QueryClientProvider } from "@tanstack/react-query"
import * as Notifications from "expo-notifications"
import { Stack, useRouter, useSegments } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { onAuthStateChanged } from "firebase/auth"
// import { useColorScheme } from "@/components/useColorScheme"
import { useEffect, useRef, useState } from "react"
import React from "react"
import { StyleSheet, View } from "react-native"
import {
  ActivityIndicator,
  MD3DarkTheme,
  type MD3Theme,
  PaperProvider,
  Text,
} from "react-native-paper"
import { useTheme } from "react-native-paper"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import { auth } from "@/firebase-config"
import useUserStore from "@/src/store"

import { NotificationProvider } from "../context/notifications-context"
import { queryClient } from "../lib/query-client"
import { DarkTheme } from "@react-navigation/native"
import useThemeStore from "../store/theme-store"
import { StatusBar } from "expo-status-bar"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Android alert + iOS alert
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // iOS 15+ foreground banner
    shouldShowList: true, // iOS 15+ Notification Summary
  }),
})

export { ErrorBoundary } from "expo-router"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const setUser = useUserStore(({ setUser }) => setUser)
  const user = useUserStore(({ user }) => user)
  const setLoading = useUserStore((state) => state.setLoading)
  const theme = useTheme()

  const [initializing, setInitializing] = useState(true)
  const loading = useUserStore((state) => state.loading)

  const currentApplicationTheme = useThemeStore((store) => store.theme)

  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (currentUser !== null) {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const didMountRef = useRef(false)

  useEffect(() => {
    if (loading) return
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }

    const inAuthGroup = segments[0] === "(auth)"
    const isLoginRoute = !inAuthGroup

    if (auth.currentUser && isLoginRoute) {
      router.replace("/(auth)/(tabs)/home")
    } else if (!auth.currentUser && inAuthGroup) {
      router.replace("/")
    }
  }, [auth.currentUser, loading, router, segments])

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        {/* https://docs.expo.dev/guides/configuring-statusbar/#render-the-status-bar-in-with-your-layout */}
        <SafeAreaProvider>
          <PaperProvider theme={currentApplicationTheme}>
            <StatusBar
              style={
                currentApplicationTheme === MD3DarkTheme ? "light" : "dark"
              }
              backgroundColor={currentApplicationTheme.colors.background}
              translucent={true}
            />
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: currentApplicationTheme.colors.background,
              }}
            >
              {loading ? (
                <AppContent />
              ) : (
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    redirect
                    name="oauthredirect"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="onboarding"
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack>
              )}
            </SafeAreaView>
          </PaperProvider>
        </SafeAreaProvider>
      </NotificationProvider>
    </QueryClientProvider>
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
