import React from "react"
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form"
import { HelperText } from "react-native-paper"
import { type MultiSelectDropdownProps } from "react-native-paper-dropdown"
import { MultiSelectDropdown } from "react-native-paper-dropdown"

type Props<T extends FieldValues> = Omit<
  MultiSelectDropdownProps,
  "value" | "onSelect"
> & {
  name: Path<T>
}

export default function RHFMultiSelectDropdown<T extends FieldValues>({
  name,
  ...props
}: Props<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        // convert numbers to strings for dropdown
        const stringValues: string[] = Array.isArray(value)
          ? value.map((v: any) => String(v))
          : []

        return (
          <>
            <MultiSelectDropdown
              {...props}
              value={stringValues}
              onSelect={(selected: string[]) => {
                // convert selected string back to numbers
                const nums = selected
                  .map((s) => parseInt(s, 10))
                  .filter((n) => !isNaN(n))
                onChange(nums as any)
              }}
            />
            {error?.message && (
              <HelperText type="error" visible>
                {error.message}
              </HelperText>
            )}
          </>
        )
      }}
    />
  )
}
