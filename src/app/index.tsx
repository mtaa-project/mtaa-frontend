import * as WebBrowser from "expo-web-browser"
import React from "react"
import { StyleSheet, View } from "react-native"
import {
  Button,
  type MD3Theme,
  SegmentedButtons,
  useTheme,
} from "react-native-paper"

import { Login } from "@/src/components/auth/login"
import { Register } from "@/src/components/auth/register"

import { facebookSignIn } from "../components/auth/facebook-auth"
import { useGoogleAuth } from "../components/auth/google-auth"

WebBrowser.maybeCompleteAuthSession()

enum LoginType {
  Login = "Login",
  Register = "Register",
}

const LoginScreen: React.FC = () => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const [loginType, setLoginType] = React.useState<LoginType>(LoginType.Login)

  const handleLoginTypeChange = (loginType: LoginType) => {
    setLoginType(loginType)
  }
  const { response, promptAsync } = useGoogleAuth()

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
      <Button
        mode="contained"
        onPress={() => {
          facebookSignIn()
        }}
        icon={"facebook"}
      >
        Sign in with Facebook
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
