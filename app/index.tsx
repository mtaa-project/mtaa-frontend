import {
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { auth } from "@/firebaseConfig"
import {
  MD3Theme,
  useTheme,
  TextInput,
  Button,
  SegmentedButtons,
} from "react-native-paper"

import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as Facebook from "expo-auth-session/providers/facebook"

import useUserStore from "@/store"
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

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "space-evenly",
      justifyContent: "center",
      // backgroundColor: theme.colorWhite,
      paddingHorizontal: 18,
      backgroundColor: theme.colors.background,
      gap: 24,
    },
    inputContainer: {
      justifyContent: "center",
      gap: 12,
    },
    textInput: {},
    buttonContainer: {
      gap: 12,
      flexDirection: "row",
    },
    button: {},
  })

enum LoginType {
  Login = "Login",
  Register = "Register",
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const theme = useTheme()
  const styles = createStyles(theme)

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

  const [loginType, setLoginType] = React.useState<LoginType>(LoginType.Login)

  const handleLoginTypeChange = (loginType: LoginType) => {
    // setLoginType
    setLoginType(loginType)
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={loginType}
        onValueChange={(newValue) =>
          handleLoginTypeChange(newValue as LoginType)
        }
        buttons={[
          {
            value: LoginType.Login,
            label: "Login",
          },
          {
            value: LoginType.Register,
            label: "Sign Up",
          },
        ]}
      />

      {loginType === LoginType.Register ? (
        // Sign Up
        <View style={styles.inputContainer}>
          <TextInput
            label={"Firstname"}
            style={styles.textInput}
            value={""}
            mode="outlined"
            onChangeText={() => {}}
            autoCapitalize="words"
          />
          <TextInput
            label={"Lastname"}
            mode="outlined"
            // style={styles.textInput}
            value={""}
            onChangeText={() => {}}
            autoCapitalize="words"
          />
          <TextInput
            label={"Email"}
            style={styles.textInput}
            value={email}
            mode="outlined"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
          />
          <TextInput
            label={"password"}
            mode="outlined"
            // style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            placeholder="Password"
          />
          <TextInput
            label={"Repeat Password"}
            mode="outlined"
            // style={styles.textInput}
            value={""}
            onChangeText={() => {}}
            autoCapitalize="none"
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={() => authEmailPasswordHandleSignUp(email, password)}
          >
            Register
          </Button>
        </View>
      ) : (
        // Sign In
        <View style={styles.inputContainer}>
          <TextInput
            label={"Email"}
            style={styles.textInput}
            value={email}
            mode="outlined"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
          />
          <TextInput
            label={"password"}
            mode="outlined"
            // style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            placeholder="Password"
          />
          <Button
            mode="contained"
            onPress={() => authEmailPasswordHandleSignIn(email, password)}
          >
            Login
          </Button>
        </View>
      )}
      {/* Buttons */}
      <Button
        mode="contained"
        onPress={() => {
          promptAsync()
        }}
        icon={"google"}
      >
        Sign in with google
      </Button>
    </View>
  )
}

export default Login
