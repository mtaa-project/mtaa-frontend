// app/listings/create/[step].tsx
import React from "react"
import { Text, View } from "react-native"
import { ListingWizard } from "@/src/features/listing-wizard/listing-wizard"
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router"

type Props = {
  step: string
}

export default function CreateListingScreen({ step }: Props) {
  const local = useLocalSearchParams()
  const glob = useGlobalSearchParams()

  const stepIdx = Number(glob["step"])

  console.log("Glob: ", glob)
  console.log("Local: ", local)
  console.log("Step: ", stepIdx)

  if (![0, 1].includes(stepIdx)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Invalid step</Text>
      </View>
    )
  }

  return <ListingWizard variant="create" activeStep={1} />
}
