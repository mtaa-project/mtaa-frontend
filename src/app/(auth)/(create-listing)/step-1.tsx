import {
  addressSchema,
  type AddressSchemaType,
} from "@features/create-listing/create-listing-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"

import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { useCreateListingStore } from "@/src/store/createListingStore"

export default function AddressStep() {
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
      <View>
        <Text variant="headlineLarge">Address Info</Text>

        <RHFTextInput<AddressSchemaType> name="visibility" label="Visibility" />
        <RHFTextInput<AddressSchemaType> name="country" label="Country" />
        <RHFTextInput<AddressSchemaType> name="city" label="City" />
        <RHFTextInput<AddressSchemaType> name="zipCode" label="Zip Code" />
        <Button onPress={handleSubmit(onSubmit)}>Next</Button>
      </View>
    </FormProvider>
  )
}
