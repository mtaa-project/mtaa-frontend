// ListingInfoStep.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "expo-router"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"

import RHFTextInput from "@/src/components/ui/rhf-text-input"
import { AddPhotos } from "@/src/features/create-listing/components/add-photos/add-photos"
import ImagePickerExample from "@/src/features/create-listing/components/img-picker-example"
import {
  listingInfoSchema,
  type ListingInfoSchemaType,
} from "@/src/features/create-listing/create-listing-schema"
import { useCreateListingStore } from "@/src/store/create-listing-store"

export default function ListingInfoStep() {
  const methods = useForm<ListingInfoSchemaType>({
    resolver: zodResolver(listingInfoSchema),
  })
  const { control, handleSubmit, watch } = methods
  const setListingInfo = useCreateListingStore((state) => state.setListingInfo)

  const onSubmit = (data: ListingInfoSchemaType) => {
    setListingInfo(data)
    router.push("/(auth)/(create-listing)/step-1")
  }

  const productName = watch("productName")
  const productCategory = watch("productCategory")

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
        <Button onPress={() => router.push("/(auth)/(create-listing)/step-1")}>
          Next without
        </Button>

        <ImagePickerExample
          productName={productName}
          productCategory={productCategory}
        />
      </View>
    </FormProvider>
  )
}
