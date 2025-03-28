import { type FirebaseError } from "firebase/app"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
} from "firebase/auth"

import { auth } from "@/firebase-config"
import { type UserRegisterRequestType } from "@/src/api/types"

import { AuthErrorException } from "../components/auth/exceptions"
import { api } from "./axios-config"
import { type FormRegisterUser } from "./types"

export const authEmailPasswordHandleSignUp = async (
  registerFormData: FormRegisterUser
): Promise<void> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      registerFormData.email,
      registerFormData.password
    )

    const registeredUser: User = userCredential.user

    const registerForm: UserRegisterRequestType = {
      firstname: registerFormData.firstname,
      lastname: registerFormData.lastname,
      email: registerFormData.email,
    }

    // TODO: handle request failed
    await api.post("/auth/register", registerForm)
  } catch (error: any) {
    const err = error as FirebaseError
    if (err.code === "auth/email-already-in-use") {
      throw new AuthErrorException("This email is already taken.")
    } else if (err.code === "auth/weak-password") {
      throw new AuthErrorException(
        "Your password must be at least 6 characters"
      )
    } else {
      throw new AuthErrorException("Authentication error")
    }
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
  } catch (error) {
    const err = error as FirebaseError
    // console.error("Error in authentication:", err.message)
    if (err.code === "auth/invalid-credential") {
      throw new AuthErrorException("Incorrect email or password.")
    }
    throw new AuthErrorException(
      "An error occurred during sign-in. Please try again."
    )
  }
}
