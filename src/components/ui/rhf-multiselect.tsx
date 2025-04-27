import React, { useState } from "react"
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form"
import { StyleSheet, View } from "react-native"
import {
  Checkbox,
  HelperText,
  Menu,
  TextInput,
  useTheme,
} from "react-native-paper"

export type Option = { id: string; label: string }

type Props<T extends FieldValues> = {
  name: Path<T>
  label: string
  options: Option[]
  placeholder?: string
}

export function RHFMultiSelect<T extends FieldValues>({
  name,
  label,
  options,
  placeholder = "Select…",
}: Props<T>) {
  const { control } = useFormContext<T>()
  const theme = useTheme()
  const [visible, setVisible] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        const toggle = (id: string) => {
          if (value.includes(id)) {
            onChange((value as string[]).filter((i) => i !== id))
          } else {
            onChange([...(value as string[]), id])
          }
        }

        const selectedLabels = options
          .filter((o) => value.includes(o.id))
          .map((o) => o.label)
          .join(", ")

        return (
          <View style={styles.wrapper}>
            {/* anchor = samotný TextInput */}
            <Menu
              visible={visible}
              onDismiss={() => setVisible(false)}
              anchor={
                <TextInput
                  mode="outlined"
                  label={label}
                  value={selectedLabels}
                  placeholder={placeholder}
                  onPress={() => {
                    setVisible(true)
                  }}
                  onFocus={() => setVisible(true)}
                  right={<TextInput.Icon icon="menu-down" />}
                  //   editable={false}
                  error={!!error}
                />
              }
              //   anchor={
              //     <Button onPress={() => setVisible(true)}>Show menu</Button>
              //   }
              style={{ maxWidth: "90%" }}
            >
              {options.map((opt) => {
                const val = (value ?? []) as string[]
                const checked = val.includes(opt.id)
                return (
                  <Checkbox.Item
                    key={opt.id}
                    label={opt.label}
                    status={checked ? "checked" : "unchecked"}
                    position="leading"
                    onPress={() => toggle(opt.id)}
                    style={styles.checkboxItem}
                  />
                )
              })}
            </Menu>

            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  menuItemTitle: {
    paddingVertical: 0,
  },
  checkboxItem: {
    paddingLeft: 0,
  },
})
