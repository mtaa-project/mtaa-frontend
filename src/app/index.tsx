import * as WebBrowser from "expo-web-browser"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import {
  Button,
  Dialog,
  type MD3Theme,
  Paragraph,
  Portal,
  SegmentedButtons,
  useTheme,
} from "react-native-paper"

import { Login } from "@/src/components/auth/login"
import { Register } from "@/src/components/auth/register"

import { AuthErrorException } from "../components/auth/exceptions"
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

  const [dialogVisible, setDialogVisible] = useState(false)

  const [signInErrorMessage, setSignInErrorMessage] = useState("")

  const handleSignInError = (message: string) => {
    setDialogVisible(true)
    setSignInErrorMessage(message)
  }

  const handleOauthSignIn = async <T,>(
    signInMethod: () => Promise<T>
  ): Promise<void> => {
    try {
      const result = await signInMethod()
    } catch (error: any) {
      let message = "An error occurred during sign-in. Please try again."

      if (error instanceof AuthErrorException) {
        message = error.message
      }
      handleSignInError(message)
    }
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
        <Register />
      ) : (
        <Login handleSignInError={handleSignInError} />
      )}
      {/* Buttons */}
      <Button
        mode="contained"
        onPress={() => {
          handleOauthSignIn(promptAsync)
        }}
        icon={"google"}
      >
        Sign in with google
      </Button>
      <Button
        mode="contained"
        onPress={() => handleOauthSignIn(facebookSignIn)}
        icon={"facebook"}
      >
        Sign in with Facebook
      </Button>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Authentication Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{signInErrorMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
