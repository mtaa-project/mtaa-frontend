import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import {
  Button,
  type MD3Theme,
  SegmentedButtons,
  useTheme,
} from "react-native-paper"

import { auth } from "@/firebase-config"
import { Login } from "@/src/components/auth/login"
import { Register } from "@/src/components/auth/register"
import { api } from "@/src/lib/axios-config"
import useUserStore from "@/src/store"

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

enum LoginType {
  Login = "Login",
  Register = "Register",
}

const LoginScreen: React.FC = () => {
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

        const data = {
          firstname: firstname,
          lastname: lastname,
          email: authResponse.user.email,
        }

        await api.post("/auth/google", data)
      }
    }
    upsertUser()
  }, [response])

  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormLoginUser>({
  //   resolver: zodResolver(schemaLoginUser),
  // })

  // const onSubmit = (data: FormLoginUser) => {
  //   console.log("Form data:", data) // Handle form submission
  //   authEmailPasswordHandleSignIn(data.email, data.password)
  // }

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

      {loginType === LoginType.Register ? <Register /> : <Login />}
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

export default LoginScreen
