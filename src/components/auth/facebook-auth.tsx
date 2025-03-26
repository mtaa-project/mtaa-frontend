import {
  type AuthCredential,
  FacebookAuthProvider,
  linkWithCredential,
  signInWithCredential,
} from "firebase/auth"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"

import { auth } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"

const linkFacebookAccount = async (credential: AuthCredential) => {
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

const signInWithFB = async (linkAccount: boolean = false) => {
  try {
    console.log("ahoj")

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
    if (linkAccount) {
      await linkFacebookAccount(credential)
    } else {
      const authResponse = await signInWithCredential(auth, credential)
      const [firstname, lastname] =
        authResponse.user.displayName?.split(" ") || []

      const data = {
        firstname: firstname,
        lastname: lastname,
        email: authResponse.user.email,
      }
      console.log(" : ", data)

      await api.post("/auth/facebook", data)
    }
  } catch (error: any) {
    // Ak je chyba "account-exists-with-different-credential", vyhodíme ju
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData.email
      throw { message: "Email už je obsadený", email }
    }
    throw error
  }
}

export const facebookSignIn = async () => {
  await signInWithFB()
}

export const linkAccountFacebook = async () => {
  await signInWithFB(true)
}
