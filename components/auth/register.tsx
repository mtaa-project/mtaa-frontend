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

import { authEmailPasswordHandleSignUp } from "@/lib/auth"
import { type FormRegisterUser, schemaRegisterUser } from "@/lib/types"

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
  })

  const onSubmit = (data: FormRegisterUser) => {
    authEmailPasswordHandleSignUp(data.email, data.password)
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
              style={styles.textInput}
              value={value}
              mode="outlined"
              onChangeText={onChange}
              autoCapitalize="words"
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
        name="repeatPassword"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={"Repeat Password"}
              mode="outlined"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              secureTextEntry
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
