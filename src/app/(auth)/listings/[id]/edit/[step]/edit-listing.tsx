import { ListingWizard } from "@/src/features/listing-wizard/listing-wizard"
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router"
import { Text } from "react-native-paper"

type Props = {
  params: {
    id: string
    step: string
  }
}

export default function EditListingScreen({ params }: Props) {
  const { id, step } = useLocalSearchParams()
  const glob = useGlobalSearchParams()

  const stepIdx = Number(glob["step"])
  const idNum = Number(id)

  if (isNaN(idNum) || isNaN(stepIdx)) {
    return <Text>Invalid route</Text>
  }
  console.log("Params: ", params)

  return <ListingWizard variant="edit" id={idNum} activeStep={stepIdx} />
}
