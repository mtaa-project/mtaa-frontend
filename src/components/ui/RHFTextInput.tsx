import React from "react"
import { HelperText, TextInput, TextInputProps } from "react-native-paper"
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form"

type Props<T extends FieldValues> = {
  /** react‑hook‑form path, napr. "priceForRent.minPrice" */
  name: Path<T>
  /** zapne režim čísla (parseFloat / undefined) */
  asNumber?: boolean
} & Pick<
  TextInputProps,
  | "label"
  | "mode"
  | "keyboardType"
  | "style"
  | "placeholder"
  | "onSubmitEditing"
>

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
        <>
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
          {/* {error && <HelperText type="error">{error.message}</HelperText>} */}
        </>
      )}
    />
  )
}
