import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { onAuthStateChanged, type User } from "firebase/auth"
import React, { useEffect, useState } from "react"

import { auth } from "@/firebase-config"

import AppLayout from "../components/app-layout"
import AppProviders from "../context/app-providers"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AppProviders>
      <AppLayout>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={user === null}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={user !== null}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Screen
            redirect
            name="oauthredirect"
            options={{ headerShown: false }}
          />
        </Stack>
      </AppLayout>
    </AppProviders>
  )
}
