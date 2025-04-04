// ListingInfoStep.tsx
import React from "react"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  listingInfoSchema,
  ListingInfoSchemaType,
} from "@/src/features/create-listing/create-listing-schema"
import RHFTextInput from "@/src/components/ui/RHFTextInput"
import { router } from "expo-router"
import { useCreateListingStore } from "@/src/store/createListingStore"
import { AddPhotos } from "@/src/features/create-listing/components/add-photos/add-photos"
import ImagePickerExample from "@/src/features/create-listing/components/ImgPickerExample"

export default function ListingInfoStep() {
  const methods = useForm<ListingInfoSchemaType>({
    resolver: zodResolver(listingInfoSchema),
  })
  const { control, handleSubmit } = methods
  const setListingInfo = useCreateListingStore((state) => state.setListingInfo)

  const onSubmit = (data: ListingInfoSchemaType) => {
    setListingInfo(data)
    router.push("/(auth)/(create-listing)/step-1")
  }

  return (
    <FormProvider {...methods}>
      <View>
        <AddPhotos />
        <Text variant="headlineLarge">Listing Info</Text>
        <RHFTextInput<ListingInfoSchemaType>
          name="productName"
          label="Product Name"
        />
        <RHFTextInput<ListingInfoSchemaType>
          name="productCategory"
          label="Product Category"
        />
        <Button onPress={handleSubmit(onSubmit)}>Next</Button>
        <ImagePickerExample />
      </View>
    </FormProvider>
  )
}
