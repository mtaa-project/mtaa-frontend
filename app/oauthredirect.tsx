import { auth } from "@/firebaseConfig"
import { useRouter } from "expo-router"
import { useEffect } from "react"
import { StyleSheet, ActivityIndicator, Text, View } from "react-native"

export default function Asd() {
  const router = useRouter()

  useEffect(() => {
    if (auth.currentUser) {
      router.replace("/")
    }
  }, [router])

  return (
    <View style={[styles.container, styles.horizontal]}>
      <Text>Signing user...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    gap: 24,
    padding: 10,
  },
})
