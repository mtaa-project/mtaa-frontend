import React from "react"
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form"
import { View } from "react-native"
import { HelperText, TextInput, type TextInputProps } from "react-native-paper"
type PaperTextInputProps = React.ComponentProps<typeof TextInput>

type Props<T extends FieldValues> = {
  /** react‑hook‑form path, napr. "priceForRent.minPrice" */
  name: Path<T>
  /** zapne režim čísla (parseFloat / undefined) */
  asNumber?: boolean
} & PaperTextInputProps

export default function RHFTextInput<T extends FieldValues>({
  name,
  asNumber = false,

  ...props
}: Props<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View>
          <TextInput
            {...props}
            onBlur={onBlur}
            value={
              asNumber
                ? typeof value === "number"
                  ? String(value)
                  : ""
                : (value ?? "")
            }
            /** change value only (if asNumber) */
            onChangeText={(text) => {
              if (!asNumber) {
                onChange(text ?? "")
                return
              }

              if (text === "" || text == null) {
                onChange(undefined)
              } else {
                const parsed = parseFloat(text)
                onChange(isNaN(parsed) ? undefined : parsed)
              }
            }}
            error={!!error}
          />
          <HelperText type="error" visible={!!error}>
            {error?.message}
          </HelperText>
          {/* {error && <HelperText type="error">{error.message}</HelperText>} */}
        </View>
      )}
    />
  )
}
