// app/(profile)/_layout.tsx
import { useGlobalStyles } from "@/src/components/global-styles"
import { ProfileCard } from "@/src/components/profile-card/profile-card"
import { Slot } from "expo-router"
import { SafeAreaView, ScrollView, View, StyleSheet } from "react-native"

export default function ProfileShell() {
  const globalStyles = useGlobalStyles()
  return (
    <SafeAreaView style={[globalStyles.pageContainer]}>
      <View>
        <ProfileCard />
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
