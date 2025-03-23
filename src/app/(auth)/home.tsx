import { useEffect, useState } from "react"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"

import { auth } from "@/firebase-config"
import { linkAccountFacebook } from "@/src/components/auth/facebook-auth"
import { api } from "@/src/lib/axios-config"

export default function Home() {
  const user = auth.currentUser
  const [users, setUsers] = useState([])
  const [hasFacebook, setHasFacebook] = useState<boolean>(false)

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

  useEffect(() => {
    if (user) {
      const providers = user.providerData.map((provider) => provider.providerId)
      setHasFacebook(providers.includes("facebook.com"))
    }
  }, [user])

  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Text style={{ color: "white" }}>data: </Text>

      <Button mode="contained" onPress={() => auth.signOut()}>
        Sign out
      </Button>
      <Button
        icon={"facebook"}
        mode="contained"
        onPress={() => {
          linkAccountFacebook()
          setHasFacebook(true)
        }}
      >
        {hasFacebook ? "Linked" : "Link Account"}
      </Button>

      {users &&
        users.map((user, index) => (
          <Text key={index}>{JSON.stringify(user)}</Text>
        ))}
    </View>
  )
}
