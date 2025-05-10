// src/components/AppLayout.tsx
import useThemeStore from "@store/theme-store"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { StyleSheet } from "react-native"
import { MD3DarkTheme } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  const currentApplicationTheme = useThemeStore((store) => store.theme)

  return (
    <>
      <StatusBar
        style={currentApplicationTheme === MD3DarkTheme ? "light" : "dark"}
        backgroundColor={currentApplicationTheme.colors.background}
        translucent={true}
      />
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: currentApplicationTheme.colors.background },
        ]}
      >
        {children}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
