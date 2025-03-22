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

import { authEmailPasswordHandleSignUp } from "@/src/lib/auth"
import { type FormRegisterUser, schemaRegisterUser } from "@/src/lib/types"

export const Register = () => {
  const theme = useTheme()
  const styles = createStyles(theme)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRegisterUser>({
    resolver: zodResolver(schemaRegisterUser),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: FormRegisterUser) => {
    authEmailPasswordHandleSignUp(data)
  }

  return (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        name="firstname"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={"Firstname"}
              value={value}
              mode="outlined"
              onChangeText={onChange}
              autoCapitalize="words"
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
        name="lastname"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={"Lastname"}
              mode="outlined"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={"Confirm Password"}
              mode="outlined"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              secureTextEntry
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
        Register
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
