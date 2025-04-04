import React from "react"
import { HelperText, TextInput, TextInputProps } from "react-native-paper"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"
import { View } from "react-native"

type Props<T extends FieldValues> = {
  name: Path<T>
} & Pick<TextInputProps, "label">

export default function RHFTextInput<T extends FieldValues>({
  name,
  ...props
}: Props<T>) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <TextInput
            // style={styles.input}
            {...props}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            error={!!error}
          />
          <HelperText type="error">{error?.message ?? ""}</HelperText>
        </>
      )}
      name={name}
      rules={{ required: true }}
    />
  )
}
