import {
  addressSchema,
  type AddressSchemaType,
} from "@features/create-listing/create-listing-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { View, StyleSheet } from "react-native"
import { Button, MD3Theme, Text, useTheme } from "react-native-paper"

import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { useCreateListingStore } from "@/src/store/create-listing-store"
import { useGlobalStyles } from "@/src/components/global-styles"
import RHFSegmentedButtons from "@/src/components/ui/rhf-segmented-buttons"
import { AddressType } from "@/src/api/types"

export default function AddressStep() {
  const globalStyles = useGlobalStyles()

  const theme = useTheme()
  const styles = createStyles(theme)
  const methods = useForm<AddressSchemaType>({
    resolver: zodResolver(addressSchema),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods

  const setAddress = useCreateListingStore((state) => state.setAddress)
  const listingInfo = useCreateListingStore((state) => state.listingInfo)

  console.log(errors)

  const handleStepBack = () => {}

  const onSubmit: SubmitHandler<AddressSchemaType> = (data) => {
    setAddress(data)

    const finalData = {
      listingInfo: listingInfo,
      address: data,
    }

    console.log("Final Data:", finalData)
  }

  return (
    <FormProvider {...methods}>
      <View style={globalStyles.pageContainer}>
        <Text variant="headlineLarge" style={globalStyles.pageTitle}>
          Address Info
        </Text>
        <Text variant="bodyLarge">
          Would you like to use the address data from your profile or fill in a
          new one ?
        </Text>
        <View>
          <Text variant="bodyLarge">
            On the offer page, you are displayed as follows:
          </Text>

          {/* TODO: Profile Image Cart */}
        </View>

        <RHFSegmentedButtons<AddressSchemaType>
          style={{ marginBlock: 20 }}
          name="addressType"
          buttons={[
            { value: AddressType.PROFILE, label: "Use profile address" },
            { value: AddressType.OTHER, label: "Use other address" },
          ]}
        />

        <RHFTextInput<AddressSchemaType> name="visibility" label="Visibility" />
        <RHFTextInput<AddressSchemaType> name="country" label="Country" />
        <RHFTextInput<AddressSchemaType> name="phone" label="Phone number" />

        <RHFTextInput<AddressSchemaType> name="city" label="City" />
        <RHFTextInput<AddressSchemaType> name="zipCode" label="Zip Code" />

        <View>
          <Button onPress={handleStepBack}>Back</Button>
          <Button onPress={handleSubmit(onSubmit)}>Next</Button>
        </View>
      </View>
    </FormProvider>
  )
}

const createStyles = (theme: MD3Theme) => StyleSheet.create({})
