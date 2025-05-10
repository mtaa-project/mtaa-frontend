import { View } from "react-native"

import { ListingInfoStep } from "./components/step-0/step-0"
import { ListingAddressStep } from "./components/step-1/step-1"
import { useListingDetails } from "./services/queries"
import { type ListingVariant } from "./types"

type Props = {
  variant: ListingVariant
  id?: number
  initialValues?: any
  activeStep: number
}
export function ListingWizard({
  variant,
  id,
  initialValues,
  activeStep,
}: Props) {
  // ...tu si nastavíš RHF/zod formu s defaultValues podľa variant/id...
  const listingDetailsQuery = useListingDetails(id)

  return (
    <View style={{ flex: 1 }}>
      {activeStep === 0 ? (
        <ListingInfoStep
          listingVariant={variant}
          listingDetailsQuery={listingDetailsQuery}
        />
      ) : null}
      {activeStep === 1 ? (
        <ListingAddressStep
          listingVariant={variant}
          listingDetailsQuery={listingDetailsQuery}
        />
      ) : null}
    </View>
  )
}
