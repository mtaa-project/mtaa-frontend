import {
  type AuthCredential,
  FacebookAuthProvider,
  linkWithCredential,
} from "firebase/auth"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"
import { Button, Text } from "react-native-paper"

import { auth } from "@/firebase-config"
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

  const linkAccount = async (credential: AuthCredential) => {
    if (auth.currentUser) {
      try {
        const userCredential = await linkWithCredential(
          auth.currentUser,
          credential
        )
        console.log("Your account was successfully linked:", userCredential)
      } catch (error) {
        console.error("Error with linking the account:", error)
      }
    } else {
      console.warn("Link credential or current user not available")
    }
  }
  // const setLinkCredential = useUserStore((state) => state.setLinkCredential)

  const SignInWithFB = async () => {
    try {
      const fbResult = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ])

      if (fbResult.isCancelled) {
        throw new Error("Something went wrong...")
      }

      const data = await AccessToken.getCurrentAccessToken()
      if (!data) {
        throw new Error("Something went wrong with obtaining access token...")
      }

      const credential = FacebookAuthProvider.credential(data.accessToken)
      await linkAccount(credential)
    } catch (error: any) {
      // const e = error as FirebaseError
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email
        const cred = FacebookAuthProvider.credentialFromError(error)
      }
    }
  }

  return (
    <View>
      <Text>Welcome back {user?.email}</Text>
      <Text style={{ color: "white" }}>data: </Text>

      <Button mode="contained" onPress={() => auth.signOut()}>
        Sign out
      </Button>
      <Button mode="contained" onPress={() => SignInWithFB()}>
        Link Account
      </Button>

      {users &&
        users.map((user, index) => (
          <Text key={index}>{JSON.stringify(user)}</Text>
        ))}
    </View>
  )
}
