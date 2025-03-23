import { useEffect, useState } from "react"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"

import { auth } from "@/firebase-config"
import { linkAccountFacebook } from "@/src/components/auth/facebook-auth"
import { api } from "@/src/lib/axios-config"

export default function Home() {
  const user = auth.currentUser
  const [users, setUsers] = useState([])

  useEffect(() => {
    const foo = async () => {
      try {
        const users = await api.get("/users")
        if (users.data) {
          setUsers(users.data)
        }
      } catch {}
    }
    foo()
  }, [user])

  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Text style={{ color: "white" }}>data: </Text>

      <Button mode="contained" onPress={() => auth.signOut()}>
        Sign out
      </Button>
      <Button mode="contained" onPress={() => linkAccountFacebook()}>
        Link Account
      </Button>

      {users &&
        users.map((user, index) => (
          <Text key={index}>{JSON.stringify(user)}</Text>
        ))}
    </View>
  )
}
