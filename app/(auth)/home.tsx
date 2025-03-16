import { auth } from "@/firebaseConfig"
import { Button, Text, View } from "react-native"

export default function Home() {
  const user = auth.currentUser
  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Button title="Sign out" onPress={() => auth.signOut()} />
    </View>
  )
}
