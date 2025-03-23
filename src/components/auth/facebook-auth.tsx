import {
  type AuthCredential,
  FacebookAuthProvider,
  linkWithCredential,
  signInWithCredential,
} from "firebase/auth"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"

import { auth } from "@/firebase-config"

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

const SignInWithFB = async (linkAccount: boolean = false) => {
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
      await linkFacebookAccount(credential)
    } else {
      const user = await signInWithCredential(auth, credential)
    }
  } catch (error: any) {
    // const e = error as FirebaseError
    if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData.email
      const cred = FacebookAuthProvider.credentialFromError(error)
    }
    console.log(JSON.stringify(error))
  }
}

export const facebookSignIn = async () => {
  await SignInWithFB()
}

export const linkAccountFacebook = async () => {
  await SignInWithFB(true)
}
