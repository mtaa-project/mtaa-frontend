import { useEffect, useState } from "react"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"

import { auth } from "@/firebase-config"
import { linkAccountFacebook } from "@/src/components/auth/facebook-auth"

export default function Profile() {
  const user = auth.currentUser
  const [hasFacebook, setHasFacebook] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      const providers = user.providerData.map((provider) => provider.providerId)
      setHasFacebook(providers.includes("facebook.com"))
    }
  }, [user])

  return (
    <View>
      <Text>Profile</Text>
      <Button
        icon={"facebook"}
        mode="contained"
        disabled={hasFacebook}
        onPress={() => {
          linkAccountFacebook()
          setHasFacebook(true)
        }}
      >
        {hasFacebook ? "Linked" : "Link Facebook Account"}
      </Button>
      <Button mode="contained" onPress={() => auth.signOut()}>
        Sign out
      </Button>
    </View>
  )
}
