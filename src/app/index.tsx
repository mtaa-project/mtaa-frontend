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

  const [errorEmail, setErrorEmail] = useState("")

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn()
    } catch (error: any) {
      if (error.email) {
        setErrorEmail(error.email)
        setDialogVisible(true)
      } else {
        console.error("Facebook sign in error:", error)
      }
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
      <Button mode="contained" onPress={handleFacebookSignIn} icon={"facebook"}>
        Sign in with Facebook
      </Button>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          {/* Error type */}
          <Dialog.Title>Email Already Taken</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {/* Error detail */}
              The email {errorEmail} is already registered. Please use another
              sign-in method or link it to an existing account.
            </Paragraph>
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
