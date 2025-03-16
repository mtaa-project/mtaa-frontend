import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
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

WebBrowser.maybeCompleteAuthSession()

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  //client IDs from .env
  const config = {
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  }
  // promptAsync function starts a sign in process
  // const [request, response, promptAsync] = Facebook.useAuthRequest({
  //   clientId: "1181775450142356",
  // })
  console.log(
    makeRedirectUri({
      scheme: "mtaa-frontend",
    })
  )

  const [request, response, promptAsync] = Google.useAuthRequest({
    ...config,
  })

  const handleSignUp = async (): Promise<void> => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password)
      const registeredUser: User = userCredential.user
      setUser(registeredUser)
      console.log("Registered user:", registeredUser)
    } catch (error: any) {
      const err = error as FirebaseError

      console.error("Error by registration:", err.message)
    }
  }

  const handleSignIn = async (): Promise<void> => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const loggedUser: User = userCredential.user
      setUser(loggedUser)
      console.log("Logged user:", loggedUser)
    } catch (error) {
      const err = error as FirebaseError
      console.error("Error in authentication:", err.message)
    }
  }

  const setUser = useUserStore(({ setUser }) => setUser)

  // add it to a useEffect with response as a dependency
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params
      // generate a credential and then authenticate user
      const credential = GoogleAuthProvider.credential(id_token)
      signInWithCredential(auth, credential)
    }
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
        <Button onPress={handleSignUp} title="Sign Up" />
        <Button onPress={handleSignIn} title="Sign In" />
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
