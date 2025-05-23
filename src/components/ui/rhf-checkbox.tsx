import React from "react"
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form"
import { View } from "react-native"
import { Checkbox, HelperText } from "react-native-paper"

type Props<T extends FieldValues> = {
  name: Path<T>
  label: string
}

export function RHFCheckbox<T extends FieldValues>({ name, label }: Props<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value = false, onChange },
        fieldState: { error },
      }) => (
        <View>
          <Checkbox.Item
            label={label}
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
            position="leading"
          />
          {!!error ? (
            <HelperText type="error">{error?.message}</HelperText>
          ) : null}
        </View>
      )}
    />
  )
}
