import { FacebookAuthProvider, signInWithCredential } from "firebase/auth"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"

import { auth } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"

import { AuthErrorException } from "./exceptions"
import { linkProviderAccount } from "./helpers"

const signInWithFB = async (linkAccount: boolean = false) => {
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
    if (linkAccount) {
      await linkProviderAccount(credential)
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
    if (error instanceof AuthErrorException) {
      throw error
    }
    if (error.code === "auth/account-exists-with-different-credential") {
      throw new AuthErrorException(
        "This email is already registered. Please use another sign-in method or link it to an existing account."
      )
    }

    throw new AuthErrorException(
      "An error occurred during sign-in. Please try again."
    )
  }
}

export const facebookSignIn = async () => {
  await signInWithFB()
}

export const linkAccountFacebook = async () => {
  return signInWithFB(true)
}
