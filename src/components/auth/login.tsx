import { zodResolver } from "@hookform/resolvers/zod"
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
  handleOauthSignIn: <T>(signInMethod: () => Promise<T>) => Promise<void>
}

export const Login = ({ handleOauthSignIn }: Props) => {
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
    handleOauthSignIn(() =>
      authEmailPasswordHandleSignIn(data.email, data.password)
    )
    console.log("Form data:", data) // Handle form submission
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
