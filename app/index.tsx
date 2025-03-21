import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import React, { useEffect, useState } from "react"
import { StyleSheet, View, TextInput, Button } from "react-native"
import { auth } from "@/firebaseConfig"

import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as Facebook from "expo-auth-session/providers/facebook"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { makeRedirectUri } from "expo-auth-session"
import useUserStore from "@/store"
import axios from "axios"
import { api } from "@/lib/axiosConfig"
import {
  authEmailPasswordHandleSignIn,
  authEmailPasswordHandleSignUp,
} from "@/lib/auth"

WebBrowser.maybeCompleteAuthSession()

const googleCredentials = {
  androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
}

type RegisterFormData = {
  username: string
  firstname: string
  lastname: string
  phone_number: string | null
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [request, response, promptAsync] = Google.useAuthRequest({
    ...googleCredentials,
  })

  const setUser = useUserStore(({ setUser }) => setUser)

  useEffect(() => {
    const upsertUser = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params
        // generate a credential and then authenticate user
        const credential = GoogleAuthProvider.credential(id_token)
        const authResponse = await signInWithCredential(auth, credential)
        const firebaseIdToken = await authResponse.user.getIdToken()

        const [firstname, lastname] =
          authResponse.user.displayName?.split(" ") || []

        const data: RegisterFormData = {
          username: auth.currentUser?.email ?? " ",
          firstname: firstname,
          lastname: lastname,
          phone_number: authResponse.user.phoneNumber,
        }

        await api.post("/auth/google", data)
      }
    }
    upsertUser()
  }, [response])

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { access_token } = response.params
  //     console.log(access_token)

  //     // generate a credential and then authenticate user
  //     const credential = FacebookAuthProvider.credential(access_token)
  //     signInWithCredential(auth, credential)
  //   }
  // }, [response])

  //log the userInfo to see user details
  // console.log(JSON.stringify(userInfo))

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
        />
        <TextInput
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Password"
        />
      </View>
      <View style={styles.buttonContainer}>
        {/* TODO: add activity indicator when user sign in */}
        <Button
          onPress={() => authEmailPasswordHandleSignUp(email, password)}
          title="Sign Up"
        />
        <Button
          onPress={() => authEmailPasswordHandleSignIn(email, password)}
          title="Sign In"
        />
        <Button
          title="sign in with google"
          onPress={() => {
            promptAsync()
          }}
        />
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-evenly",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: theme.colorWhite,
    paddingHorizontal: 18,
    gap: 24,
  },
  inputContainer: {
    justifyContent: "center",
    gap: 12,
  },
  textInput: {
    minWidth: 300,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "black",
  },
  buttonContainer: {
    gap: 12,
    flexDirection: "row",
  },
  button: {
    minWidth: 150,
  },
})
