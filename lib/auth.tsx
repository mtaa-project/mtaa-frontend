import { type FirebaseError } from "firebase/app"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from "firebase/auth"

import { auth } from "@/firebase-config"

import { api } from "./axios-config"
import { type RegisterFormData } from "./types"

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
    const [firstName, lastName] = displayName ?? ["", ""]

    const registeredUser: User = userCredential.user
    const registerForm: RegisterFormData = {
      username: email,
      firstname: firstName,
      lastname: lastName,
      phone_number: null,
      email: email,
    }
    await api.post("/auth/register", registerForm)

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
