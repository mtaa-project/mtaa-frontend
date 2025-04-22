import React from "react"
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { Checkbox, Text } from "react-native-paper"

export type Option = { id: string; label: string }

type Props<T extends FieldValues> = {
  name: Path<T>
  options: Option[]
  label: string
}

export function RHFCheckboxGroup<T extends FieldValues>({
  name,
  options,
  label,
}: Props<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <Text variant="titleSmall" style={styles.groupLabel}>
            {label}
          </Text>

          {options.map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt.id)

            return (
              <Checkbox.Item
                key={opt.id}
                label={opt.label}
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  const currentValue = Array.isArray(value) ? value : []

                  if (checked) {
                    onChange(currentValue.filter((id) => id !== opt.id))
                  } else {
                    onChange([...currentValue, opt.id])
                  }
                }}
                style={styles.item}
                position="trailing"
              />
            )
          })}

          {/* <HelperText type="error" visible={!!error}>
            {error?.message}
          </HelperText> */}
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  wrapper: {
    // borderWidth: 4,
    // borderColor: "red",
  },
  groupLabel: {
    // marginBottom: 4,
  },
  item: {
    paddingLeft: 0,
  },
})
