import { useEffect } from "react"
import { Button, Text, View } from "react-native"

import { auth } from "@/firebase-config"

export default function Home() {
  const user = auth.currentUser

  useEffect(() => {
    // foo()
  }, [user])
  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Text style={{ color: "white" }}>data: </Text>

      <Button title="Sign out" onPress={() => auth.signOut()} />
    </View>
  )
}
