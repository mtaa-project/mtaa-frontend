import * as Google from "expo-auth-session/providers/google"
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import { useEffect } from "react"

import { auth } from "@/firebase-config"
import { api } from "@/src/lib/axios-config"
import { env } from "@/src/lib/env"
import useUserStore from "@/src/store"

import { AuthErrorException } from "./exceptions"
import { linkProviderAccount } from "./helpers"

type Props = {
  linkAccount?: boolean
}

export const useGoogleAuth = ({ linkAccount = false }: Props = {}) => {
  const setLoading = useUserStore((state) => state.setLoading)

  const [request, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: env.EXPO_PUBLIC_WEB_CLIENT_ID,
  })

  useEffect(() => {
    const upsertUser = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.params
          // generate a credential and then authenticate user
          const credential = GoogleAuthProvider.credential(id_token)
          if (linkAccount) {
            await linkProviderAccount(credential)
          } else {
            // setLoading(true)

            const authResponse = await signInWithCredential(auth, credential)
            const firebaseIdToken = await authResponse.user.getIdToken()

            const [firstname, lastname] =
              authResponse.user.displayName?.split(" ") || []

            const data = {
              firstname: firstname,
              lastname: lastname,
              email: authResponse.user.email,
            }
            await api.post("/auth/google", data)
          }
        } catch (error: any) {
          if (error instanceof AuthErrorException) {
            throw error
          }
          if (error.code === "auth/account-exists-with-different-credential") {
            throw new AuthErrorException(
              "This email is already taken by another user."
            )
          }
          throw new AuthErrorException(
            "An error occurred during sign-in. Please try again."
          )
        }
      }
    }
    upsertUser()
  }, [response])
  return { response, googleSignIn: googleSignIn }
}
