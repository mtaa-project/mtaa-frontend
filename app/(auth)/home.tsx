import { auth } from "@/firebaseConfig"
import { useEffect, useState } from "react"
import { Button, Text, View } from "react-native"

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
