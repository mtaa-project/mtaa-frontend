import { type AuthCredential, linkWithCredential } from "firebase/auth"

import { auth } from "@/firebase-config"

import { AuthErrorException } from "./exceptions"

export const linkProviderAccount = async (credential: AuthCredential) => {
  if (auth.currentUser) {
    try {
      const userCredential = await linkWithCredential(
        auth.currentUser,
        credential
      )
    } catch (error: any) {
      let message =
        "An error occurred while linking your account. Please try again."

      if (error.code === "auth/credential-already-in-use") {
        message =
          "This Facebook account is already linked to another user. Please use a different account or unlink it first."
      }
      throw new AuthErrorException(message)
    }
  } else {
    throw new AuthErrorException(
      "Link credential or current user not available."
    )
  }
}
