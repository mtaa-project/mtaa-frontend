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

import { authEmailPasswordHandleSignIn } from "@/lib/auth"
import { type FormLoginUser, schemaLoginUser } from "@/lib/types"

export const Login = () => {
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

  const onSubmit = (data: FormLoginUser) => {
    console.log("Form data:", data) // Handle form submission
    authEmailPasswordHandleSignIn(data.email, data.password)
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
              style={styles.textInput}
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
      {/* {errors.name && (
          <Text style={styles.error}>{errors.name.message}</Text>
        )} */}
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
