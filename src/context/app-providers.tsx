import { queryClient } from "@lib/query-client"
import useThemeStore from "@store/theme-store"
import { QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { NotificationProvider } from "./notifications-context"

type Props = {
  children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
  const currentTheme = useThemeStore((store) => store.theme)

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <SafeAreaProvider>
          <PaperProvider theme={currentTheme}>{children}</PaperProvider>
        </SafeAreaProvider>
      </NotificationProvider>
    </QueryClientProvider>
  )
}
