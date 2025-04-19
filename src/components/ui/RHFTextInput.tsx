import React from "react"
import { HelperText, TextInput, TextInputProps } from "react-native-paper"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"
import { View } from "react-native"

type Props<T extends FieldValues> = {
  name: Path<T>
} & Pick<TextInputProps, "label" | "mode" | "keyboardType" | "style">

export default function RHFTextInput<T extends FieldValues>({
  name,
  style,
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
            {...props}
            style={style}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            error={!!error}
          />
          {!!error ? (
            <HelperText type="error">{error?.message}</HelperText>
          ) : null}
        </>
      )}
      name={name}
      rules={{ required: true }}
    />
  )
}
