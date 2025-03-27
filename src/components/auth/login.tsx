import { zodResolver } from "@hookform/resolvers/zod"
import { type FirebaseError } from "firebase/app"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import {
  Button,
  HelperText,
  type MD3Theme,
  TextInput,
  useTheme,
} from "react-native-paper"

import { authEmailPasswordHandleSignIn } from "@/src/lib/auth"
import { type FormLoginUser, schemaLoginUser } from "@/src/lib/types"

type Props = {
  handleSignInError: (message: string) => void
}

export const Login = ({ handleSignInError }: Props) => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLoginUser>({
    resolver: zodResolver(schemaLoginUser),
  })

  const onSubmit = async (data: FormLoginUser) => {
    console.log("Form data:", data) // Handle form submission
    try {
      await authEmailPasswordHandleSignIn(data.email, data.password)
    } catch (error) {
      const err = error as FirebaseError
      handleSignInError(err.message)
    }
  }
  return (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={"Email"}
              value={value}
              mode="outlined"
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              error={!!error}
            />
            {error && (
              <HelperText type="error" visible={true}>
                {error.message}
              </HelperText>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={"password"}
              mode="outlined"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Password"
              error={!!error}
            />
            {error && (
              <HelperText type="error" visible={true}>
                {error.message}
              </HelperText>
            )}
          </>
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Login
      </Button>
    </View>
  )
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    inputContainer: {
      justifyContent: "center",
      gap: 12,
    },
  })
