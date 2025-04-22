import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { Button } from "react-native-paper"

export default function OnboardingScreen() {
  const router = useRouter()
  // const toggleHasOnboarded = useUserStore((store) => store.toggleHasOnboarded)

  const handlePress = () => {
    // toggleHasOnboarded()
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View>
        <Text style={styles.heading}>Plantly</Text>
        <Text style={styles.tagline}>
          Keep your polants healthy and hydrated
        </Text>
      </View>
      <Button onPress={handlePress}>Let me in</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  heading: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 12,
  },
  tagline: {
    textAlign: "center",
    fontSize: 34,
    fontFamily: "Caveat_400Regular",
  },
})
