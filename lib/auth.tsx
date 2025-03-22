import { type FirebaseError } from "firebase/app"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from "firebase/auth"

import { auth } from "@/firebase-config"

export const authEmailPasswordHandleSignUp = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const displayName = auth.currentUser?.displayName?.split(" ")
    const [firstname, lastname] = displayName ?? ["", ""]

    const registeredUser: User = userCredential.user
    // await api.post("/auth/google", data)

    console.log("Registered user:", registeredUser)
  } catch (error: any) {
    const err = error as FirebaseError

    console.error("Error by registration:", err.message)
  }
}

export const authEmailPasswordHandleSignIn = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const loggedUser: User = userCredential.user
    console.log("Logged user:", loggedUser)
  } catch (error) {
    const err = error as FirebaseError
    console.error("Error in authentication:", err.message)
  }
}
