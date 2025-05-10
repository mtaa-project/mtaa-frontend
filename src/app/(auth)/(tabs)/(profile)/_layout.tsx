// app/(profile)/_layout.tsx
import { Slot } from "expo-router"
import { SafeAreaView, StyleSheet, View } from "react-native"

import { useGlobalStyles } from "@/src/components/global-styles"
import { ProfileCard } from "@/src/components/profile-card/profile-card"

export default function ProfileShell() {
  const globalStyles = useGlobalStyles()
  return (
    <SafeAreaView style={[globalStyles.pageContainer]}>
      <View>
        <ProfileCard currentUser={true} />
      </View>
      <View style={styles.container}>
        <Slot />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
})
