// RHFSegmentedButtons.tsx
import React from "react"
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form"
import {
  SegmentedButtons,
  type SegmentedButtonsProps,
} from "react-native-paper"

type Props<T extends FieldValues> = {
  /** react‑hook‑form path, e.g. "offerType" */
  name: Path<T>
  /** array of buttons to display */
  buttons: SegmentedButtonsProps["buttons"]
} & Omit<
  SegmentedButtonsProps,
  "value" | "onValueChange" | "buttons" | "multiSelect"
>

export default function RHFSegmentedButtons<T extends FieldValues>({
  name,
  buttons,
  ...rest
}: Props<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <SegmentedButtons
            {...rest}
            buttons={buttons}
            value={(value ?? "") as string}
            onValueChange={(v) => onChange(v)}
          />
          {/* Uncomment if you want inline error feedback
          {error && (
            <HelperText type="error" visible>
              {error.message}
            </HelperText>
          )} */}
        </>
      )}
    />
  )
}
